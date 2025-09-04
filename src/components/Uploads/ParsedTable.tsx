import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ParsedTransaction } from '@/lib/tax';
import { useAuth } from '@/components/AuthGuard';

export function ParsedTable({ data }: { data: ParsedTransaction[] }) {
  const { user } = useAuth();
  const [acceptedIds, setAcceptedIds] = useState<number[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedTx, setEditedTx] = useState<ParsedTransaction | null>(null);

  const handleAccept = async (tx: ParsedTransaction, index: number) => {
    if (!user?.id) {
      alert('User not authenticated.');
      return;
    }

    if (isNaN(tx.amount)) {
      alert('Invalid amount. Please edit the transaction first.');
      return;
    }

    const { error } = await supabase.from('transactions').insert({
      date: tx.date,
      amount: tx.amount,
      description: tx.vendor,
      category: tx.category,
      type: 'expense',
      user_id: user.id,
    });

    if (error) {
      console.error('Insert error:', error);
      alert('Failed to save transaction.');
    } else {
      setAcceptedIds((prev) => [...prev, index]);
    }
  };

  const openEditModal = (index: number) => {
    setEditingIndex(index);
    setEditedTx(data[index]);
  };

  const handleEditChange = (field: keyof ParsedTransaction, value: string | number) => {
    if (!editedTx) return;
    setEditedTx({ ...editedTx, [field]: value });
  };

  const saveEdit = () => {
    if (editingIndex !== null && editedTx) {
      data[editingIndex] = editedTx;
      setEditingIndex(null);
      setEditedTx(null);
    }
  };

  return (
    <>
      <table className="w-full text-sm border mt-6">
        <thead className="bg-gray-50">
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Vendor</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((tx, i) => (
            <tr key={i} className={acceptedIds.includes(i) ? 'bg-green-50' : ''}>
              <td>{tx.date}</td>
              <td>£{isNaN(tx.amount) ? '—' : tx.amount.toFixed(2)}</td>
              <td>{tx.vendor}</td>
              <td>{tx.category}</td>
              <td className="space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => openEditModal(i)}
                >
                  Edit
                </button>
                <button
                  className={`text-green-600 hover:underline ${
                    acceptedIds.includes(i) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleAccept(tx, i)}
                  disabled={acceptedIds.includes(i)}
                >
                  {acceptedIds.includes(i) ? 'Accepted ✅' : 'Accept'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingIndex !== null && editedTx && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[400px] space-y-4">
            <h2 className="text-lg font-semibold">Edit Transaction</h2>
            <div className="space-y-2">
              <label className="block text-sm">
                Date
                <input
                  type="date"
                  value={editedTx.date}
                  onChange={(e) => handleEditChange('date', e.target.value)}
                  className="w-full border px-2 py-1 rounded mt-1"
                />
              </label>
              <label className="block text-sm">
                Amount
                <input
                  type="number"
                  value={editedTx.amount}
                  onChange={(e) => handleEditChange('amount', parseFloat(e.target.value))}
                  className="w-full border px-2 py-1 rounded mt-1"
                />
              </label>
              <label className="block text-sm">
                Vendor
                <input
                  type="text"
                  value={editedTx.vendor}
                  onChange={(e) => handleEditChange('vendor', e.target.value)}
                  className="w-full border px-2 py-1 rounded mt-1"
                />
              </label>
              <label className="block text-sm">
                Category
                <input
                  type="text"
                  value={editedTx.category}
                  onChange={(e) => handleEditChange('category', e.target.value)}
                  className="w-full border px-2 py-1 rounded mt-1"
                />
              </label>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                className="text-sm px-3 py-1 bg-gray-200 rounded"
                onClick={() => {
                  setEditingIndex(null);
                  setEditedTx(null);
                }}
              >
                Cancel
              </button>
              <button
                className="text-sm px-3 py-1 bg-blue-600 text-white rounded"
                onClick={saveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
