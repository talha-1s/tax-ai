import { supabase } from '@/lib/supabaseClient';
import { format } from 'date-fns';

export type TaxSummary = {
  income: number;
  expenses: number;
  net: number;
  estimatedTax: number;
};

export type MonthlyBreakdown = {
  month: string;
  income: number;
  expenses: number;
  net: number;
  estimatedTax: number;
};

export type TaxData = {
  summary: TaxSummary;
  monthlyBreakdown: MonthlyBreakdown[];
};

export type ParsedTransaction = {
  date: string;
  amount: number;
  vendor: string;
  category: string;
};

// 🧠 Auto-categorization fallback
export function autoCategorize(description: string): string {
  const desc = description.toLowerCase();
  if (desc.includes('uber') || desc.includes('train')) return 'Transport';
  if (desc.includes('tesco') || desc.includes('sainsbury')) return 'Groceries';
  if (desc.includes('stripe') || desc.includes('client')) return 'Income';
  if (desc.includes('rent') || desc.includes('mortgage')) return 'Housing';
  return 'Other';
}

export async function parseCSV(file: File): Promise<ParsedTransaction[]> {
  const text = await file.text();
  const lines = text.split('\n').filter(Boolean);
  const rows = lines.slice(1); // skip header

  const parsed: ParsedTransaction[] = [];

  for (const line of rows) {
    const [date, amount, vendor, category] = line.split(',');

    if (!date || !amount || !vendor) continue; // skip malformed rows

    const parsedAmount = parseFloat(amount.trim());

    parsed.push({
      date: date.trim(),
      amount: isNaN(parsedAmount) ? 0 : parsedAmount,
      vendor: vendor.trim(),
      category: category?.trim() || 'Uncategorized',
    });
  }

  return parsed;
}

// 📊 Supabase-powered tax summary
export async function fetchTaxData(userId: string): Promise<TaxData> {
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId);

  if (error || !transactions) {
    console.error('Error fetching transactions:', error);
    return {
      summary: { income: 0, expenses: 0, net: 0, estimatedTax: 0 },
      monthlyBreakdown: [],
    };
  }

  const monthlySummary: Record<string, { income: number; expenses: number }> = {};

  transactions.forEach((tx) => {
    const month = format(new Date(tx.date), 'MMMM yyyy');
    if (!monthlySummary[month]) {
      monthlySummary[month] = { income: 0, expenses: 0 };
    }

    const amount = typeof tx.amount === 'string' ? parseFloat(tx.amount) : tx.amount;

    if (tx.type === 'income') {
      monthlySummary[month].income += amount;
    } else if (tx.type === 'expense') {
      monthlySummary[month].expenses += amount;
    }
  });

  const monthlyBreakdown: MonthlyBreakdown[] = Object.entries(monthlySummary).map(
    ([month, { income, expenses }]) => {
      const net = income - expenses;
      const estimatedTax = net > 0 ? net * 0.2 : 0;
      return { month, income, expenses, net, estimatedTax };
    }
  );

  const totalIncome = monthlyBreakdown.reduce((sum, m) => sum + m.income, 0);
  const totalExpenses = monthlyBreakdown.reduce((sum, m) => sum + m.expenses, 0);
  const netProfit = totalIncome - totalExpenses;
  const estimatedTax = netProfit > 0 ? netProfit * 0.2 : 0;

  return {
    summary: {
      income: totalIncome,
      expenses: totalExpenses,
      net: netProfit,
      estimatedTax,
    },
    monthlyBreakdown,
  };
}
