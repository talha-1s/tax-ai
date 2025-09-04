// src/pages/login.tsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Invalid login credentials. Please try again.");
    } else {
      router.push("/portal");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f2f4f7] to-[#e0e4ec] px-4">
      <div className="bg-white shadow-xl rounded-xl max-w-md w-full p-10 space-y-6">
        <h1 className="text-3xl font-bold text-[#3f3d56] text-center">Welcome Back</h1>
        <p className="text-sm text-gray-500 text-center">Log in to access your TaxMateAI portal</p>

        {error && (
          <p className="bg-red-100 text-red-600 p-3 rounded text-center text-sm">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <div className="text-right mt-2">
              <Link href="/reset-password" className="text-sm text-[#6C63FF] hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6C63FF] text-white py-3 rounded-lg hover:bg-[#5a53d6] transition"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-[#6C63FF] hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </main>
  );
}
