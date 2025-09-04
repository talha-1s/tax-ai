import { MonthlyBreakdown } from '@/lib/tax'

export const BreakdownTable = ({ data }: { data: MonthlyBreakdown[] }) => {
  return (
    <table className="w-full text-sm border mt-6">
      <thead className="bg-gray-50">
        <tr>
          <th>Month</th>
          <th>Income</th>
          <th>Expenses</th>
          <th>Net</th>
          <th>Est. Tax</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.month}>
            <td>{row.month}</td>
            <td>£{row.income}</td>
            <td>£{row.expenses}</td>
            <td>£{row.net}</td>
            <td>£{row.tax}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
