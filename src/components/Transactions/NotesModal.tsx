import { useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Transaction } from "../../lib/types";

type Props = {
  tx: Transaction;
  onClose: () => void;
  onSave: () => void;
};

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function NotesModal({ tx, onClose, onSave }: Props) {
  const [description, setDescription] = useState(tx.description || "");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (f: File) => {
    if (!allowedTypes.includes(f.type)) {
      alert("Unsupported file type. Please upload a PDF, Word doc, or image.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      alert("File must be under 10MB.");
      return;
    }
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFileChange(dropped);
  };

  const handleSave = async () => {
    setUploading(true);
    let fileUrl = tx.receipt_url || null;

    if (file) {
      const { data, error } = await supabase.storage
        .from("receipts")
        .upload(`receipt-${tx.id}`, file, { upsert: true });

      if (error) {
        console.error("Upload error:", error);
        alert("Failed to upload receipt.");
      } else {
        fileUrl = supabase.storage
          .from("receipts")
          .getPublicUrl(data.path).data.publicUrl;
      }
    }

    const { error: updateError } = await supabase
      .from("transactions")
      .update({ description, receipt_url: fileUrl })
      .eq("id", tx.id);

    if (updateError) {
      console.error("Update error:", updateError);
      alert("Failed to save changes.");
    } else {
      alert("Saved successfully ✅");
      onSave();
      onClose();
    }

    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-40 backdrop-blur-sm bg-white/30 flex items-center justify-center px-4">
      <div
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md animate-fade-in"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <button
          onClick={onClose}
          title="Close"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✖
        </button>

        <h3 className="text-lg font-semibold text-[#3f3d56] mb-4">
          Add Notes & Receipt
        </h3>

        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="e.g. Fuel for client meeting"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Receipt Upload
        </label>
        <div
          className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-indigo-400 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <p className="text-sm text-gray-600">
            Drag a receipt here or <span className="text-indigo-600 underline">click to upload</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Accepted: PDF, Word, JPG, PNG, WebP • Max 10MB
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={allowedTypes.join(",")}
          onChange={(e) => {
            const selected = e.target.files?.[0];
            if (selected) handleFileChange(selected);
          }}
        />

        {file && (
          <div className="text-sm text-gray-600 mt-2">
            ✅ <strong>{file.name}</strong> ready to upload with your note.
          </div>
        )}

        {tx.receipt_url && (
          <div className="text-sm text-gray-600 mt-4">
            Existing Receipt:{" "}
            <a
              href={tx.receipt_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline"
            >
              View / Download
            </a>
            {tx.receipt_url.match(/\.(jpg|jpeg|png|webp)$/) && (
              <img
                src={tx.receipt_url}
                alt="Receipt preview"
                className="mt-2 max-h-40 rounded border"
              />
            )}
          </div>
        )}

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="text-gray-500 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={uploading}
            className="text-indigo-600 hover:underline"
          >
            {uploading ? "Uploading receipt…" : "Save note & receipt"}
          </button>
        </div>
      </div>
    </div>
  );
}
