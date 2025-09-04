import { useEffect, useState } from "react";
import { getUserDashboard } from "../lib/api";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [filings, setFilings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const { profile, filings } = await getUserDashboard();
        setProfile(profile);
        setFilings(filings);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) return <p className="p-4">Loading dashboard...</p>;
  if (!profile) return <p className="p-4">No profile found.</p>;

  const totalIncome = filings.reduce((sum, f) => sum + f.income, 0);
  const totalExpenses = filings.reduce((sum, f) => sum + f.expenses, 0);
  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">
        Welcome back, {profile.full_name}!
      </h1>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
        <p>Country: {profile.country}</p>
        <p>NI Number: {profile.ni_number?.replace(/.(?=.{2})/g, "*")}</p>
        <p>
          DOB:{" "}
          {profile.dob
            ? new Date(profile.dob).toLocaleDateString()
            : "Not provided"}
        </p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Tax Summary</h2>
        <p>Total Income: £{totalIncome}</p>
        <p>Total Expenses: £{totalExpenses}</p>
        <p>Net Profit: £{netProfit}</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Your Filings</h2>
        {filings.length === 0 ? (
          <p>No filings found.</p>
        ) : (
          <ul className="space-y-2">
            {filings.map((f) => (
              <li key={f.id} className="border p-2 rounded">
                <strong>Tax Year:</strong> {f.tax_year} <br />
                <strong>Income:</strong> £{f.income} <br />
                <strong>Expenses:</strong> £{f.expenses} <br />
                <strong>Submitted:</strong>{" "}
                {f.submitted ? "✅ Yes" : "❌ No"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
