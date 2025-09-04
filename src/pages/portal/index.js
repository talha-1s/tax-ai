import Head from "next/head";
import Layout from "../../components/Layout";
import AuthGuard, { useAuth } from "../../components/AuthGuard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

function DashboardContent() {
  const { profile, user } = useAuth();
  const [filings, setFilings] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      const { data: filingsData } = await supabase
        .from("filings")
        .select("*")
        .eq("user_id", user.id);

      const { data: txData } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id);

      setFilings(filingsData || []);
      setTransactions(txData || []);
    }

    fetchData();
  }, [user]);

  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const pendingCount = filings.filter((f) => f.status === "draft" || f.status === "open").length;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <>
      <Head>
        <title>Dashboard - TaxMateAI</title>
      </Head>
      <Layout>
        <section className="space-y-10">
          {/* Welcome Header */}
          <div className="bg-white p-6 rounded-xl shadow flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-[#3f3d56]">
                {greeting()}
                {profile?.full_name ? `, ${profile.full_name}` : ""} 👋
              </h2>
              {user?.email && (
                <p className="text-gray-600">
                  Email: <span className="font-medium">{user.email}</span>
                </p>
              )}
              {profile?.occupation && (
                <p className="text-gray-600">
                  Occupation: <span className="font-medium">{profile.occupation}</span>
                </p>
              )}
              {profile?.ni_number && (
                <p className="text-gray-600">
                  NI Number: <span className="font-medium">{profile.ni_number}</span>
                </p>
              )}
            </div>
            <Link
              href="/portal/add-transaction"
              className="bg-[#6C63FF] hover:bg-[#5a54d4] text-white px-5 py-3 rounded-lg shadow transition"
            >
              + Add Transaction
            </Link>
          </div>

        {/* Financial Overview */}
<div>
  <h3 className="text-xl font-semibold text-[#3f3d56] mb-2">Your Financial Overview</h3>
  <div className="grid sm:grid-cols-3 gap-6">
    <Link href="/portal/monthly-summary" className="block">
      <div className="bg-[#F3F2FF] p-6 rounded-lg text-center shadow hover:shadow-md hover:ring-2 hover:ring-[#6C63FF] transition cursor-pointer">
        <h4 className="text-lg font-semibold text-[#3f3d56]">Total Income</h4>
        <p className="text-2xl font-bold text-[#6C63FF]">£{totalIncome.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mt-1">Across all months</p>
      </div>
    </Link>

    <Link href="/portal/monthly-summary" className="block">
      <div className="bg-[#F3F2FF] p-6 rounded-lg text-center shadow hover:shadow-md hover:ring-2 hover:ring-[#FF6B6B] transition cursor-pointer">
        <h4 className="text-lg font-semibold text-[#3f3d56]">Total Expenses</h4>
        <p className="text-2xl font-bold text-[#FF6B6B]">£{totalExpenses.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mt-1">Across all months</p>
      </div>
    </Link>

    <Link href="/portal/continue-filing" className="block">
      <div className="bg-[#F3F2FF] p-6 rounded-lg text-center shadow hover:shadow-md hover:ring-2 hover:ring-[#FFA500] transition cursor-pointer">
        <h4 className="text-lg font-semibold text-[#3f3d56]">Pending Filings</h4>
        <p className="text-2xl font-bold text-[#FFA500]">{pendingCount}</p>
        <p className="text-sm text-gray-500 mt-1">Awaiting submission</p>
      </div>
    </Link>
  </div>
</div>

          {/* Quick Insights */}
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h3 className="text-lg font-semibold text-[#3f3d56]">Quick Insights</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>You’ve submitted <strong>{transactions.length}</strong> transactions</li>
              <li>You have <strong>{pendingCount}</strong> filings awaiting submission</li>
              <li>Check your <Link href="/portal/tax-summary" className="underline text-[#6C63FF]">Tax Summary</Link> for estimated tax</li>
            </ul>
          </div>

          {/* Action Center */}
          <div>
            <h3 className="text-xl font-semibold text-[#3f3d56] mb-2">Actions</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                href="/portal/new-filing"
                className="bg-[#6C63FF] text-white p-6 rounded-lg text-center font-medium shadow hover:bg-[#5a54d4] transition"
              >
                + New Tax Filing
              </Link>
              <Link
                href="/portal/continue-filing"
                className="bg-[#3f3d56] text-white p-6 rounded-lg text-center font-medium shadow hover:bg-[#2e2c46] transition"
              >
                Continue Filing
              </Link>
              <Link
                href="/portal/monthly-summary"
                className="bg-[#FFA500] text-white p-6 rounded-lg text-center font-medium shadow hover:bg-[#e69500] transition"
              >
                Monthly Summary
              </Link>
              <Link
                href="/portal/tax-summary"
                className="bg-[#00B894] text-white p-6 rounded-lg text-center font-medium shadow hover:bg-[#009e7a] transition"
              >
                View Tax Summary
              </Link>
              <Link
                href="/portal/uploads"
                className="bg-[#FF6B6B] text-white p-6 rounded-lg text-center font-medium shadow hover:bg-[#e55a5a] transition"
              >
                View Uploads
              </Link>
              <Link
                href="/portal/add-transaction"
                className="bg-[#6C63FF] text-white p-6 rounded-lg text-center font-medium shadow hover:bg-[#5a54d4] transition"
              >
                Add Transaction
              </Link>
              <Link
  href="/portal/transactions"
  className="bg-[#3f3d56] text-white p-6 rounded-lg text-center font-medium shadow hover:bg-[#2e2c46] transition"
>
  View Transactions
</Link>

            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

export default function Portal() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
