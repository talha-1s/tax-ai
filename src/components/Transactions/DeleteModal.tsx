import { useEffect, useState } from "react";

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteModal({ onConfirm, onCancel }: Props) {
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Delete Transaction</h3>
        <p className="text-sm text-gray-700 mb-2">
          This action is permanent and cannot be undone.
        </p>
        <p className="text-sm text-gray-600 mb-4">
          To confirm, type <span className="font-semibold text-red-500">delete</span> below:
        </p>

        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Type 'delete'"
          className="w-full border px-3 py-2 rounded mb-4"
        />

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmText !== "delete"}
            className={`px-4 py-2 rounded ${
              confirmText === "delete"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-red-200 text-red-500 cursor-not-allowed"
            }`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
