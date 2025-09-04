import Head from "next/head";
import Layout from "../../components/Layout";
import AuthGuard, { useAuth } from "../../components/AuthGuard";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

function ContinueFilingContent() {
  const { user } = useAuth();
  const [filings, setFilings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const fetchFilings = async () => {
      const { data, error } = await supabase
        .from("filings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      setFilings(data || []);
      setLoading(false);
    };

    fetchFilings();
  }, [user]);

  if (!user) return <div className="p-6 text-gray-600">Loading your account…</div>;
  if (loading) return <div className="p-6 text-gray-600">Loading filings…</div>;

  return (
    <Layout>
      <Head>
        <title>Continue Filing - TaxMateAI</title>
      </Head>
      <div className="flex justify-center items-start min-h-screen pt-10 px-4">
        <div className="w-full max-w-xl space-y-6">
          <h2 className="text-2xl font-semibold text-[#6C63FF]">
            Continue Existing Tax Filings
          </h2>

          {filings.length === 0 ? (
            <p className="text-gray-500">No filings found.</p>
          ) : (
            filings.map((filing) => (
              <div
                key={filing.id}
                className="bg-white p-6 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-700">
                    Filing - Year {filing.tax_year}
                  </p>
                  <p className="text-gray-500">Status: {filing.status}</p>
                </div>
                <button
                  onClick={() => router.push(`/portal/filing/${filing.id}`)}
                  className="bg-[#6C63FF] hover:bg-[#5a54d4] text-white px-4 py-2 rounded-full font-medium transition"
                >
                  Continue
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

export default function ContinueFiling() {
  return (
    <AuthGuard>
      <ContinueFilingContent />
    </AuthGuard>
  );
}
