// pages/TaxSummaryPage.tsx
import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { fetchTaxData, TaxData } from '@/lib/tax';
import Layout from '@/components/Layout';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';

function TaxSummaryPage() {
  const user = useUser();
  const [data, setData] = useState<TaxData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      console.log('👤 Supabase user ID:', user.id);
      fetchTaxData(user.id).then((res) => {
        console.log('📦 Tax data response:', res);
        setData(res);
        setLoading(false);
      });
    }
  }, [user?.id]);

  const summary = data?.summary;
  const breakdown = data?.monthlyBreakdown || [];

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          Loading user session...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 px-6 py-10 space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📊 Your Tax Summary</h1>
            <p className="text-sm text-gray-500">Updated as of {new Date().toLocaleDateString()}</p>
          </div>
          <button
            onClick={() => exportCSV(breakdown)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Export CSV
          </button>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-200 rounded p-4 text-sm text-gray-600 shadow">
            Fetching your financial data... hang tight.
          </div>
        ) : !data || breakdown.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800 shadow">
            No data found. Try uploading transactions or linking your account.
          </div>
        ) : (
          <>
            {/* 📊 Summary & Graph Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {summary && <SummaryCard summary={summary} />}
              <NetProfitGraph breakdown={breakdown} />
            </div>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                📅 Monthly Breakdown
              </h2>
              <BreakdownTable breakdown={breakdown} />
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}

(TaxSummaryPage as any).requiresAuth = true;
export default TaxSummaryPage;


interface Summary {
  income: number;
  expenses: number;
  net: number;
  estimatedTax: number;
}

interface MonthlyBreakdownItem {
  month: string;
  income: number;
  expenses: number;
  net: number;
  estimatedTax: number;
}

const formatCurrency = (value: number): string =>
  `£${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function exportCSV(data: MonthlyBreakdownItem[]) {
  const headers = ['Month', 'Income', 'Expenses', 'Net', 'Estimated Tax'];
  const rows = data.map((row) => [
    row.month,
    row.income.toFixed(2),
    row.expenses.toFixed(2),
    row.net.toFixed(2),
    row.estimatedTax.toFixed(2),
  ]);

  const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `tax-summary-${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function SummaryCard({ summary }: { summary: Summary }) {
  const items = [
    { label: 'Total Income', value: summary.income, icon: '💰' },
    { label: 'Total Expenses', value: summary.expenses, icon: '🧾' },
    {
      label: 'Net Profit',
      value: summary.net,
      icon: '📈',
      trend: summary.net >= 0 ? 'up' : 'down',
    },
    { label: 'Estimated Tax', value: summary.estimatedTax, icon: '💸' },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow p-6 grid grid-cols-2 gap-4">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center space-x-3">
          <span className="text-2xl">{item.icon}</span>
          <div>
            <p className="text-sm text-gray-500">{item.label}</p>
            <div className="flex items-center space-x-1">
              <p className="text-lg font-semibold text-gray-800">
                {formatCurrency(item.value)}
              </p>
              {item.trend === 'up' && (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
              )}
              {item.trend === 'down' && (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NetProfitGraph({ breakdown }: { breakdown: MonthlyBreakdownItem[] }) {
  const formatted = breakdown.map((item) => ({
    month: item.month,
    net: item.net,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        📈 Net Profit Trend
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={formatted}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Line
            type="monotone"
            dataKey="net"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function BreakdownTable({ breakdown }: { breakdown: MonthlyBreakdownItem[] }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">Month</th>
            <th className="px-4 py-3">Income</th>
            <th className="px-4 py-3">Expenses</th>
            <th className="px-4 py-3">Net</th>
            <th className="px-4 py-3">Est. Tax</th>
          </tr>
        </thead>
        <tbody>
          {breakdown.map((row, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-3">{row.month}</td>
              <td className="px-4 py-3">{formatCurrency(row.income)}</td>
              <td className="px-4 py-3">{formatCurrency(row.expenses)}</td>
              <td
                className={`px-4 py-3 ${
                  row.net < 0 ? 'text-red-500' : 'text-green-600'
                }`}
              >
                {formatCurrency(row.net)}
              </td>
              <td className="px-4 py-3">{formatCurrency(row.estimatedTax)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
