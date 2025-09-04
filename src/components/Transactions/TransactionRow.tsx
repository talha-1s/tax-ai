import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Transaction } from "../../lib/types";
import { EditableCell } from "./EditableCell";
import { EditableSelect } from "./EditableSelect";
import NotesModal from "./NotesModal";

type Props = {
  tx: Transaction;
  onUpdate: () => void;
  onDelete: (id: string) => void;
};

export default function TransactionRow({ tx, onUpdate, onDelete }: Props) {
  const [category, setCategory] = useState(tx.category || "");
  const [saving, setSaving] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const updateField = async (changes: Partial<Transaction>) => {
    setSaving(true);
    const { error } = await supabase
      .from("transactions")
      .update(changes)
      .eq("id", tx.id);

    if (!error) {
      onUpdate();
    } else {
      console.error("Update failed:", error);
    }
    setSaving(false);
  };

  return (
    <>
      <tr className="border-b text-sm">
        <td className="px-4 py-2">{new Date(tx.date).toLocaleDateString()}</td>

        <td className="px-4 py-2">
          <EditableCell
            value={tx.amount}
            onSave={(newAmount) => updateField({ amount: newAmount })}
          />
        </td>

        <td className="px-4 py-2">
          <EditableSelect
            value={tx.type}
            options={["income", "expense"]}
            onSave={(newType) => updateField({ type: newType as "income" | "expense" })}
          />
        </td>

        <td className="px-4 py-2">
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onBlur={() => updateField({ category })}
            className="border px-2 py-1 rounded w-full"
          />
        </td>

        <td className="px-4 py-2 flex gap-3 items-center">
          <button onClick={() => setShowNotes(true)} title="Add notes">
            📝
          </button>
          {tx.receipt_url && (
            <a
              href={tx.receipt_url}
              target="_blank"
              rel="noopener noreferrer"
              title="View receipt"
              className="text-indigo-600 hover:underline"
            >
              📎
            </a>
          )}
          <button
            onClick={() => onDelete(tx.id)}
            className="text-red-600 hover:underline"
            disabled={saving}
          >
            Delete
          </button>
        </td>
      </tr>

      {showNotes && (
        <NotesModal
          tx={tx}
          onClose={() => setShowNotes(false)}
          onSave={onUpdate}
        />
      )}
    </>
  );
}
