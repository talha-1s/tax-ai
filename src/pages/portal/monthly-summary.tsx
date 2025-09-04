// src/pages/portal/monthly-summary.tsx

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../components/AuthGuard";
import Layout from "../../components/Layout";
import Head from "next/head";
import { MonthlySummaryCard } from "../../components/MonthlySummaryCard";
import { autoCategorize } from "../../lib/autoCategorize";
import { format } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  type: "income" | "expense";
  category?: string;
  description?: string;
  date: string;
  source?: string;
  month?: string;
};

type MonthlyData = {
  income: number;
  expense: number;
};

type Summary = {
  grouped: Record<string, MonthlyData>;
  latest: string | null;
  previous: string | null;
  trend: number | null;
};

export default function MonthlySummary() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uniqueMonths, setUniqueMonths] = useState<string[]>([]);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState<Transaction[] | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const userId = user.id;

    async function fetchData() {
      setLoading(true);

      const { data: txData, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Transactions error:", error);
        setLoading(false);
        return;
      }

      const enriched = (txData || []).map((tx) => ({
        ...tx,
        amount: Number(tx.amount),
        month: format(new Date(tx.date), "MMMM yyyy"),
        category: tx.category || autoCategorize(tx.description || ""),
      }));

      const sortedMonths = [...new Set(enriched.map((tx) => tx.month!))].sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );

      const latestMonth = format(new Date(), "MMMM yyyy");
      const recentMonths = sortedMonths.filter((m) => {
        const mDate = new Date(m);
        const now = new Date();
        return mDate <= now || enriched.some((tx) => tx.month === m);
      }).slice(-3);

      setTransactions(enriched);
      setSummary(generateSummary(enriched));
      setUniqueMonths(recentMonths);
      setUniqueCategories([
        ...new Set(enriched.map((tx) => tx.category!).filter(Boolean)),
      ]);

      setLoading(false);
    }

    fetchData();

    const channel = supabase
      .channel("transactions-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
          filter: `user_id=eq.${userId}`,
        },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  function generateSummary(data: Transaction[]): Summary {
    const grouped: Record<string, MonthlyData> = {};

    data.forEach((tx) => {
      if (!tx.month) return;
      if (!grouped[tx.month]) {
        grouped[tx.month] = { income: 0, expense: 0 };
      }
      if (tx.type === "income") grouped[tx.month].income += tx.amount;
      if (tx.type === "expense") grouped[tx.month].expense += tx.amount;
    });

    const months = Object.keys(grouped).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const latest = months.at(-1) || null;
    const previous = months.at(-2) || null;

    const trend =
      latest && previous
        ? grouped[latest].expense - grouped[previous].expense
        : null;

    return { grouped, latest, previous, trend };
  }

  const filtered = transactions.filter((tx) => {
    return (
      (!selectedMonth || tx.month === selectedMonth) &&
      (!selectedCategory || tx.category === selectedCategory)
    );
  });

  const filteredGrouped = generateSummary(filtered).grouped;

  const chartData = {
    labels: Object.keys(filteredGrouped),
    datasets: [
      {
        label: "Income",
        data: Object.values(filteredGrouped).map((d) => d.income),
        backgroundColor: "#6C63FF",
      },
      {
        label: "Expenses",
        data: Object.values(filteredGrouped).map((d) => d.expense),
        backgroundColor: "#FF6B6B",
      },
    ],
  };

  const openModal = (month: string, type: "income" | "expense") => {
    const data = transactions.filter(
      (tx) => tx.month === month && tx.type === type
    );
    setModalData(data);
  };

  const closeModal = () => setModalData(null);

  return (
    <>
      <Head>
        <title>Monthly Summary - TaxMateAI</title>
      </Head>
      <Layout>
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-[#3f3d56]">
            Smart Monthly Summary
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedMonth || ""}
              onChange={(e) => setSelectedMonth(e.target.value || null)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">All Months</option>
              {uniqueMonths.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          
          {/* Onboarding Tip */}
{!selectedMonth && !selectedCategory && (
  <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md shadow text-sm text-[#3f3d56]">
    💡 <strong>Tip:</strong> This summary shows your income and expenses by month.
    Use the filters above to explore trends, categories, and transaction details.
  </div>
)}

{/* Insight */}
{summary && summary.trend !== null && (
  <div className="bg-[#FFF8E1] p-4 rounded-lg shadow text-[#3f3d56]">
    <strong>Insight:</strong>{" "}
    Your expenses {summary.trend > 0 ? "↑ increased" : "↓ decreased"} by{" "}
    <strong>£{Math.abs(summary.trend).toFixed(2)}</strong> from{" "}
    {summary.previous} to {summary.latest}.
  </div>
)}

{/* Chart */}
<div className="bg-white p-6 rounded-lg shadow w-full max-w-4xl mx-auto">
  <h3 className="text-lg font-semibold text-[#3f3d56] mb-4">
    Income vs. Expenses
  </h3>
  <div className="relative h-[345px]">
    <Bar data={chartData} options={{ maintainAspectRatio: false }} />
  </div>
</div>

{/* Monthly Cards */}
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {Object.entries(filteredGrouped).map(([month], index, arr) => {
    const txs = filtered.filter((tx) => tx.month === month);
    const isCurrentMonth = month === format(new Date(), "MMMM yyyy");

    const previousMonthEntry = arr[index - 1];
    const previousMonth = previousMonthEntry?.[0];
    const previousTxs = previousMonth
      ? filtered.filter((tx) => tx.month === previousMonth)
      : [];

    const previousNet = previousTxs.length > 0
      ? previousTxs.reduce((acc, tx) => {
          return tx.type === "income"
            ? acc + tx.amount
            : tx.type === "expense"
            ? acc - tx.amount
            : acc;
        }, 0)
      : undefined;

    return (
      <MonthlySummaryCard
        key={month}
        month={month}
        transactions={txs}
        isCurrent={isCurrentMonth}
        previousNet={previousNet}
        onClick={(type: "income" | "expense") => openModal(month, type)}
      />
    );
  })}
</div>

{/* Empty State */}
{Object.keys(filteredGrouped).length === 0 && (
  <div className="text-center text-gray-500 mt-8">
    No data found for selected filters. Try adjusting your month or category.
  </div>
)}

        </section>

        {/* Modal with blurred background */}
        {modalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/60">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full border border-gray-200 relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
                aria-label="Close modal"
              >
                ✖
              </button>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                📋 Transaction Details
              </h2>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                {modalData.map((tx) => (
                  <div key={tx.id} className="py-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {tx.type === "income" ? "💰 Income" : "🧾 Expense"}
                      </span>
                      <span className="text-gray-700">£{tx.amount.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(tx.date), "dd MMM yyyy")} •{" "}
                      {tx.category || "Uncategorized"} •{" "}
                      {tx.description || "No description"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
}
