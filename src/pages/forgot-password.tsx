// pages/reset-password.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setLoading(false);

    if (error) {
      setError("Failed to update password. Try again.");
    } else {
      setMessage("Password updated successfully!");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f2f4f7] px-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8 space-y-6">
        <h1 className="text-2xl font-bold text-[#3f3d56] text-center">Set New Password</h1>
        <p className="text-sm text-gray-600 text-center">
          Enter your new password twice to confirm.
        </p>

        {error && (
          <p className="text-center text-sm text-red-600 bg-red-100 p-2 rounded">{error}</p>
        )}
        {message && (
          <p className="text-center text-sm text-[#6C63FF] bg-[#eef0ff] p-2 rounded">{message}</p>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-4 py-3"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-4 py-3"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6C63FF] text-white py-2 rounded-md hover:bg-[#5a53d6] transition"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
