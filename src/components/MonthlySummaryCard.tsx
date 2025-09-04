import React, { useState } from "react";
import {
  Sparklines,
  SparklinesLine,
  SparklinesSpots,
  SparklinesReferenceLine,
} from "react-sparklines";
import { saveAs } from "file-saver";
import { supabase } from "../lib/supabaseClient"; // adjust path if needed

type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  category?: string;
  description?: string;
  date: string;
};

type Props = {
  month: string;
  transactions: Transaction[];
  isCurrent?: boolean;
  previousNet?: number;
  onClick?: (type: "income" | "expense") => void;
};

const categoryIcons: Record<string, string> = {
  Rent: "🏠",
  Software: "💻",
  Phone: "📱",
  Travel: "✈️",
  Food: "🍽️",
};

export const MonthlySummaryCard: React.FC<Props> = ({
  month,
  transactions,
  isCurrent = false,
  previousNet,
  onClick,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [localTxs, setLocalTxs] = useState(transactions);

  const income = localTxs.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expenses = localTxs.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const net = income - expenses;

  const categoryTotals: Record<string, number> = {};
  localTxs.forEach((t) => {
    if (t.type === "expense" && t.category) {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    }
  });

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const netHistory = localTxs.map((tx) => (tx.type === "income" ? tx.amount : -tx.amount));

  function exportCSV() {
    const rows = localTxs.map((tx) => ({
      Date: tx.date,
      Type: tx.type,
      Amount: tx.amount,
      Category: tx.category || "",
      Description: tx.description || "",
    }));

    const csv = [
      ["Date", "Type", "Amount", "Category", "Description"],
      ...rows.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${month}-summary.csv`);
  }

  async function handleCategoryEdit(txId: string) {
    const newCategory = prompt("Enter a new category:");
    if (!newCategory) return;

    const updated = localTxs.map((tx) =>
      tx.id === txId ? { ...tx, category: newCategory } : tx
    );
    setLocalTxs(updated);

    const { error } = await supabase
      .from("transactions")
      .update({ category: newCategory })
      .eq("id", txId);

    if (error) console.error("Category update failed:", error);
  }

  return (
    <div className="relative">
      {/* Blurred overlay */}
      {showDetails && (
        <div className="absolute inset-0 z-10 backdrop-blur-md bg-white/60 rounded-lg" />
      )}

      {/* Summary Card */}
      <div
        className={`bg-white p-6 rounded-lg shadow relative z-0 ${
          isCurrent ? "border border-indigo-500" : ""
        }`}
      >
        <h3 className="text-lg font-semibold text-[#3f3d56]">{month}</h3>
        <p className="text-sm text-gray-500 mb-2">Income vs. Expenses</p>
        <div className="text-sm space-y-1">
          <p
            className="text-[#6C63FF] cursor-pointer hover:underline"
            onClick={() => {
              onClick?.("income");
              setShowDetails(true);
            }}
          >
            💰 Income: <strong>£{income.toFixed(2)}</strong>
          </p>
          <p
            className="text-[#FF6B6B] cursor-pointer hover:underline"
            onClick={() => {
              onClick?.("expense");
              setShowDetails(true);
            }}
          >
            🧾 Expenses: <strong>£{expenses.toFixed(2)}</strong>
          </p>
          <p className="text-gray-600">
            📊 Net Balance:{" "}
            <strong>
              £{net.toFixed(2)}{" "}
              {typeof previousNet === "number" && (
                <span
                  className={`ml-1 text-xs ${
                    net > previousNet ? "text-green-600" : "text-red-600"
                  }`}
                  title={`Change from last month: ${(((net - previousNet) / previousNet) * 100).toFixed(1)}%`}
                >
                  {net > previousNet ? "↑" : "↓"}
                </span>
              )}
            </strong>
          </p>
        </div>

        {topCategories.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">Top Categories</h4>
            <ul className="text-xs text-gray-700">
              {topCategories.map(([cat, amt]) => (
                <li key={cat}>
                  • {categoryIcons[cat] || "📦"} {cat}: £{amt.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4">
          <Sparklines data={netHistory} limit={10} svgWidth={100} svgHeight={30}>
            <SparklinesLine color="#3f3d56" />
            <SparklinesSpots />
            <SparklinesReferenceLine type="mean" />
          </Sparklines>
        </div>

        <button
          onClick={exportCSV}
          className="mt-4 text-xs text-indigo-600 hover:underline"
          aria-label={`Export ${month} summary as CSV`}
        >
          📤 Export CSV
        </button>

        <button
          onClick={() => setShowDetails(true)}
          className="mt-2 text-xs text-gray-500 hover:text-indigo-600"
          aria-label={`View details for ${month}`}
        >
          ➕ View transaction details
        </button>
      </div>

      {/* Transaction Detail Panel */}
      {showDetails && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg border border-gray-200 relative">
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
              aria-label="Close modal"
            >
              ✖
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              📋 {month} Transactions
            </h2>
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
              {localTxs.map((tx) => (
                <div key={tx.id} className="py-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {tx.type === "income" ? "💰 Income" : "🧾 Expense"}
                    </span>
                    <span className="text-gray-700">£{tx.amount.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {tx.date} •{" "}
                    <span className="inline-flex items-center gap-2">
                      {tx.category || "Uncategorized"}
                      <button
                        className="text-xs text-indigo-600 hover:underline"
                        onClick={() => handleCategoryEdit(tx.id)}
                      >
                        Edit
                      </button>
                    </span>{" "}
                    • {tx.description || "No description"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
