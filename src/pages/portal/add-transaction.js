// pages/portal/add-transaction.js
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import Layout from "../../components/Layout";
import AuthGuard, { useAuth } from "../../components/AuthGuard";

function AddTransactionContent() {
  const { user, profile, setProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [filingId, setFilingId] = useState(null);
  const [showViewButton, setShowViewButton] = useState(false);

  const [form, setForm] = useState({
    date: "",
    description: "",
    amount: "",
    type: "expense",
    category: "uncategorized",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    async function initUserAndFiling() {
      setLoading(true);

      // 1️⃣ Ensure user exists in public.users
      const { data: existingUser, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!existingUser) {
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              id: user.id,
              full_name: profile?.full_name || "Anonymous",
              email: user.email,
            },
          ])
          .select()
          .single();

        if (insertError) {
          setMessage("Error creating user: " + insertError.message);
          setLoading(false);
          return;
        }
      }

      // 2️⃣ Get or create current year's filing
      const currentYear = new Date().getFullYear();
      let { data: filingData } = await supabase
        .from("filings")
        .select("*")
        .eq("user_id", user.id)
        .eq("tax_year", currentYear)
        .single();

      if (!filingData) {
        const { data: newFiling, error: filingError } = await supabase
          .from("filings")
          .insert([
            {
              user_id: user.id,
              tax_year: currentYear,
              status: "open",
            },
          ])
          .select()
          .single();

        if (filingError) {
          setMessage("Error creating filing: " + filingError.message);
          setLoading(false);
          return;
        }
        filingData = newFiling;
      }

      setFilingId(filingData.id);
      setLoading(false);
    }

    initUserAndFiling();
  }, [user, profile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveTransaction = async (e) => {
  e.preventDefault();
  if (!filingId) {
    setMessage("No filing available.");
    return;
  }

  setMessage("Saving…");
  setShowViewButton(false); // reset

  const { data, error } = await supabase.from("transactions").insert([
    {
      filing_id: filingId,
      user_id: user.id,
      date: form.date,
      description: form.description,
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
      source: "manual",
    },
  ]);

  if (error) {
    setMessage("Error saving transaction: " + error.message);
  } else {
    setMessage("✅ Transaction saved!");
    setShowViewButton(true);
    setForm({
      date: "",
      description: "",
      amount: "",
      type: "expense",
      category: "uncategorized",
    });
  }
};


  if (!user) return <p className="p-6 text-gray-600">Loading user…</p>;
  if (loading) return <p className="p-6 text-gray-600">Preparing your portal…</p>;

  return (
    <Layout>
      <h2 className="text-2xl font-semibold text-[#6C63FF] mb-6">Add Transaction</h2>
      <form
        onSubmit={saveTransaction}
        className="bg-white p-6 rounded-xl shadow space-y-6"
      >
        <div>
          <label className="block text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#6C63FF]"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#6C63FF]"
            placeholder="e.g. Fuel (Shell)"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Amount (£)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#6C63FF]"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#6C63FF]"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#6C63FF]"
            placeholder="e.g. Fuel, Fares, Insurance"
          />
        </div>
        <button
          type="submit"
          className="bg-[#6C63FF] text-white p-3 rounded-full w-full font-medium hover:bg-[#5a54d4] transition"
        >
          Save Transaction
        </button>
        {message && <p className="text-center mt-2 text-sm">{message}</p>}
      </form>
      {showViewButton && (
  <div className="text-center mt-4">
    <a
      href="/portal/transactions"
      className="inline-block bg-[#3f3d56] text-white px-5 py-3 rounded-lg shadow hover:bg-[#2e2c46] transition"
    >
      View Transactions
    </a>
  </div>
)}

    </Layout>
  );
}

export default function AddTransactionPage() {
  return (
    <AuthGuard>
      <AddTransactionContent />
    </AuthGuard>
  );
}
