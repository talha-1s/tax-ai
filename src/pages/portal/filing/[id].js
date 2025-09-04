import Head from "next/head";
import Layout from "../../../components/Layout";
import AuthGuard, { useAuth } from "../../../components/AuthGuard";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

function FilingDetailContent() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  const [filing, setFiling] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user || !id) return;

    const fetchData = async () => {
      setLoading(true);

      const { data: filingData } = await supabase
        .from("filings")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      const { data: txData } = await supabase
        .from("transactions")
        .select("*")
        .eq("filing_id", id)
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      setFiling(filingData);
      setTransactions(txData || []);
      setLoading(false);
    };

    fetchData();
  }, [user, id]);

  const deleteTransaction = async (txId) => {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", txId)
      .eq("user_id", user.id);

    if (error) {
      setMessage("Error deleting transaction: " + error.message);
    } else {
      setTransactions((prev) => prev.filter((tx) => tx.id !== txId));
      setMessage("Transaction deleted.");
    }
  };

  const submitFiling = async () => {
    const { error } = await supabase
      .from("filings")
      .update({ status: "submitted" })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      setMessage("Error submitting filing: " + error.message);
    } else {
      setFiling((prev) => ({ ...prev, status: "submitted" }));
      setMessage("Filing submitted successfully.");
    }
  };

  if (!user) return <div className="p-6 text-gray-600">Loading user…</div>;
  if (loading) return <div className="p-6 text-gray-600">Loading filing…</div>;
  if (!filing) return <div className="p-6 text-gray-600">Filing not found.</div>;

  return (
    <Layout>
      <Head>
        <title>Filing Details - TaxMateAI</title>
      </Head>

      <h2 className="text-2xl font-semibold text-[#6C63FF] mb-4">
        Filing for {filing.tax_year} — {filing.status}
      </h2>

      <div className="mb-6">
        <button
          onClick={submitFiling}
          disabled={filing.status === "submitted"}
          className="bg-[#6C63FF] text-white px-5 py-2 rounded-full font-medium hover:bg-[#5a54d4] transition disabled:opacity-60"
        >
          {filing.status === "submitted" ? "Already Submitted" : "Submit Filing"}
        </button>
        {message && <p className="mt-2 text-sm text-center">{message}</p>}
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F3F2FF]">
                <th className="p-3">Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Amount (£)</th>
                <th className="p-3">Category</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-t">
                  <td className="p-3">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="p-3 capitalize">{tx.type}</td>
                  <td className="p-3">£{tx.amount.toFixed(2)}</td>
                  <td className="p-3">{tx.category}</td>
                  <td className="p-3">{tx.description || "—"}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

export default function FilingDetailPage() {
  return (
    <AuthGuard>
      <FilingDetailContent />
    </AuthGuard>
  );
}
