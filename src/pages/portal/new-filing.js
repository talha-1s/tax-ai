import Head from "next/head";
import Layout from "../../components/Layout";
import AuthGuard, { useAuth } from "../../components/AuthGuard";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

function NewFilingContent() {
  const { user } = useAuth();
  const [filingMode, setFilingMode] = useState("monthly");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("January");
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (!user) return <div className="p-6 text-gray-600">Loading your account…</div>;

  const saveFiling = async (e) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);

    const payload = {
      user_id: user.id,
      tax_year: Number(year),
      status: "draft",
      created_at: new Date().toISOString(),
      ...(filingMode === "monthly" && { month }),
    };

    const { data: filing, error: filingError } = await supabase
      .from("filings")
      .insert([payload])
      .select()
      .single();

    if (filingError || !filing) {
      setMessage("Error creating filing: " + filingError?.message);
      setSaving(false);
      return;
    }

    const transactionPayload = {
      filing_id: filing.id,
      user_id: user.id,
      date: new Date().toISOString(),
      amount: Number(income || 0),
      type: "income",
      category: filingMode === "monthly" ? month : "yearly",
      source: "manual",
    };

    const expensePayload = {
      filing_id: filing.id,
      user_id: user.id,
      date: new Date().toISOString(),
      amount: Number(expenses || 0),
      type: "expense",
      category: filingMode === "monthly" ? month : "yearly",
      source: "manual",
    };

    const { error: txError } = await supabase
      .from("transactions")
      .insert([transactionPayload, expensePayload]);

    setSaving(false);
    setMessage(txError ? "Error saving transactions: " + txError.message : "Filing saved!");
  };

  return (
    <>
      <Head>
        <title>New Tax Filing - TaxMateAI</title>
      </Head>
      <Layout>
        <div className="flex justify-center items-start min-h-screen pt-10 px-4">
          <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow space-y-6">
            <h2 className="text-2xl font-semibold text-[#6C63FF]">Start a New Tax Filing</h2>

            <div className="flex gap-4">
              <button
                onClick={() => setFilingMode("monthly")}
                className={`px-4 py-2 rounded ${filingMode === "monthly" ? "bg-[#6C63FF] text-white" : "bg-gray-200 text-gray-700"}`}
              >
                Monthly Filing
              </button>
              <button
                onClick={() => setFilingMode("yearly")}
                className={`px-4 py-2 rounded ${filingMode === "yearly" ? "bg-[#6C63FF] text-white" : "bg-gray-200 text-gray-700"}`}
              >
                Yearly Filing
              </button>
            </div>

            <form onSubmit={saveFiling} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Filing Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#6C63FF]"
                  min="2000"
                  max="2100"
                  required
                />
              </div>

              {filingMode === "monthly" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Month</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#6C63FF]"
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Income (£)</label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#6C63FF]"
                  min="0"
                  placeholder="Enter total income"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Expenses (£)</label>
                <input
                  type="number"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#6C63FF]"
                  min="0"
                  placeholder="Enter total expenses"
                  required
                />
              </div>

              <button
                disabled={saving}
                className="bg-[#6C63FF] text-white p-3 rounded-full w-full font-medium hover:bg-[#5a54d4] transition disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Filing"}
              </button>

              {message && (
                <p className="text-center text-sm mt-2 text-gray-600">{message}</p>
              )}
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default function NewFiling() {
  return (
    <AuthGuard>
      <NewFilingContent />
    </AuthGuard>
  );
}
