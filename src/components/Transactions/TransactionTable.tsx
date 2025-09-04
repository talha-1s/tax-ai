import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Transaction } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

interface Props {
  transactions: Transaction[];
  onRefresh: () => void;
  onEdit: (tx: Transaction) => void;
  onNotes: (tx: Transaction) => void;
}

export default function TransactionTable({ transactions, onRefresh, onEdit, onNotes }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>({});

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    setDeletingId(pendingDeleteId);
    const { error } = await supabase.from("transactions").delete().eq("id", pendingDeleteId);
    if (error) console.error("Delete error:", error);
    setDeletingId(null);
    setPendingDeleteId(null);
    onRefresh();
  };

  const formatDate = (iso: string) => {
    const zoned = toZonedTime(parseISO(iso), "Europe/London");
    return format(zoned, "dd MMM yyyy");
  };

  const grouped = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .reduce((acc, tx) => {
      const month = formatDate(tx.date).slice(3);
      acc[month] = acc[month] ? [...acc[month], tx] : [tx];
      return acc;
    }, {} as Record<string, Transaction[]>);

  return (
    <div className="space-y-6 relative">
      {Object.entries(grouped).map(([month, txs]) => (
        <div key={month} className="border rounded-xl shadow">
          <button
            onClick={() =>
              setOpenMonths((prev) => ({ ...prev, [month]: !prev[month] }))
            }
            className="w-full flex items-center justify-between px-6 py-4 bg-[#F3F2FF] text-[#3f3d56] font-semibold hover:bg-[#eae8ff] transition"
          >
            <span>{month} ({txs.length} transactions)</span>
            <span className="text-lg">{openMonths[month] ? "▲" : "▼"}</span>
          </button>

          {openMonths[month] && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-[#3f3d56]">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {txs.map((tx) => (
                    <tr key={tx.id} className="border-t hover:bg-[#FAFAFF]">
                      <td className="px-4 py-2">{formatDate(tx.date)}</td>
                      <td className="px-4 py-2">{tx.description || "—"}</td>
                      <td className="px-4 py-2 font-medium">£{tx.amount.toFixed(2)}</td>
                      <td className="px-4 py-2 capitalize">{tx.type}</td>
                      <td className="px-4 py-2">
                        {tx.category}
                        {tx.receipt_url && (
                          <span className="ml-2 text-xs text-green-600">🧾 Receipt attached</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex flex-wrap justify-center gap-2">
                          <button
                            className="bg-[#6C63FF] text-white px-3 py-1 rounded hover:bg-[#5a54d4] transition"
                            onClick={() => onEdit(tx)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-[#FF6B6B] text-white px-3 py-1 rounded hover:bg-[#e55a5a] transition"
                            onClick={() => setPendingDeleteId(tx.id)}
                            disabled={deletingId === tx.id}
                          >
                            {deletingId === tx.id ? "Deleting…" : "Delete"}
                          </button>
                          <button
                            className="bg-[#F3F2FF] text-[#3f3d56] px-2 py-1 rounded hover:bg-[#eae8ff] transition"
                            onClick={() => onNotes(tx)}
                            title="Add/View Notes"
                          >
                            📝
                          </button>
                          {tx.receipt_url && (
                            <a
                              href={tx.receipt_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#F3F2FF] text-[#3f3d56] px-2 py-1 rounded hover:bg-[#eae8ff] transition"
                              title="View Receipt"
                            >
                              📎
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                 </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-40 backdrop-blur-sm bg-white/30 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm animate-fade-in">
            <h2 className="text-lg font-semibold text-[#3f3d56] mb-4">Confirm Deletion</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPendingDeleteId(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-[#3f3d56] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-[#FF6B6B] text-white hover:bg-[#e55a5a] transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
