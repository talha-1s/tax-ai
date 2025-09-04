export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  type: "income" | "expense";
  category?: string;
  description?: string;
  receipt_url?: string;
  date: string;
};


export type MonthlyData = {
  income: number;
  expense: number;
};

export type Summary = {
  grouped: Record<string, MonthlyData>;
  latest: string | null;
  previous: string | null;
  trend: number | null;
};
