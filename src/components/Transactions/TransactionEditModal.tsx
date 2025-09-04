import { useEffect, useState } from "react";
import { Transaction } from "@/lib/types";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onSave: () => void;
}

export default function TransactionEditModal({ isOpen, onClose, transaction, onSave }: Props) {
  const [form, setForm] = useState({
    date: "",
    description: "",
    amount: "",
    type: "",
    category: ""
  });

  useEffect(() => {
    if (transaction) {
      setForm({
        date: transaction.date ?? "",
        description: transaction.description ?? "",
        amount: transaction.amount?.toString() ?? "",
        type: transaction.type ?? "",
        category: transaction.category ?? ""
      });
    }
  }, [transaction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from("transactions")
      .update({
        date: form.date,
        description: form.description,
        amount: parseFloat(form.amount),
        type: form.type,
        category: form.category
      })
      .eq("id", transaction?.id);

    if (!error) {
      onSave();
      onClose();
    } else {
      console.error("Update error:", error.message);
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/30 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-fade-in"
      >
        <h2 className="text-xl font-semibold text-[#3f3d56] mb-4">Edit Transaction</h2>

        <div className="space-y-4">
          {/* Two-column layout */}
          <div className="grid grid-cols-3 items-center gap-4">
            <label htmlFor="date" className="text-sm text-[#3f3d56] font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="col-span-2 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
            />
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <label htmlFor="description" className="text-sm text-[#3f3d56] font-medium">Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="col-span-2 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
            />
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <label htmlFor="amount" className="text-sm text-[#3f3d56] font-medium">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount"
              className="col-span-2 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
            />
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <label htmlFor="type" className="text-sm text-[#3f3d56] font-medium">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="col-span-2 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <label htmlFor="category" className="text-sm text-[#3f3d56] font-medium">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="col-span-2 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
            >
              <option value="fuel">Fuel</option>
              <option value="insurance">Insurance</option>
              <option value="uber income">Uber Income</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-[#3f3d56]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#6C63FF] text-white rounded hover:bg-[#5a54d4] transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
