

// pages/forgot-password.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email !== confirmEmail) {
      setError("Emails do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError("Something went wrong. Please try again.");
    } else {
      router.push("/check-email");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f2f4f7] px-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8 space-y-6">
        <h1 className="text-2xl font-bold text-[#3f3d56] text-center">Forgot Password</h1>
        <p className="text-sm text-gray-600 text-center">
          Enter your email twice to receive a reset link.
        </p>

        {error && (
          <p className="text-center text-sm text-red-600 bg-red-100 p-2 rounded">{error}</p>
        )}

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <input
            type="email"
            className="w-full border border-gray-300 rounded px-4 py-3"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="email"
            className="w-full border border-gray-300 rounded px-4 py-3"
            placeholder="Confirm your email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6C63FF] text-white py-2 rounded-md hover:bg-[#5a53d6] transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </main>
  );
}
