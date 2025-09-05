import { TaxSummary } from '@/lib/tax'

export function SummaryCard({ data }: { data: TaxSummary }) {
  const items = [
    { label: 'Total Income', value: data.income },
    { label: 'Total Expenses', value: data.expenses },
    { label: 'Net Profit', value: data.net },
    { label: 'Estimated Tax', value: data.estimatedTax },

  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map(({ label, value }) => (
        <div key={label} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-muted">{label}</p>
          <p className="text-xl font-bold">£{value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
