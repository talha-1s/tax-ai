import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthGuard";
import TaxMateAssistant from "./TaxMateAssistant";

export default function Layout({ children }) {
  const router = useRouter();
  const auth = useAuth ? useAuth() : null;
  const user = auth?.user;
  const profile = auth?.profile;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Portal Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/portal" className="text-xl font-semibold text-[#3f3d56] hover:text-[#3f3d56] transition">
            TaxMate<span className="text-[#6C63FF]">AI</span> Portal
          </Link>

          {/* Portal Links */}
          <div className="space-x-6 text-sm font-medium hidden md:flex">
            <Link href="/portal" className="text-black hover:text-[#6C63FF] transition">Home</Link>
            <Link href="/portal/new-filing" className="text-black hover:text-[#6C63FF] transition">New Filing</Link>
            <Link href="/portal/continue-filing" className="text-black hover:text-[#6C63FF] transition">Continue Filing</Link>
            <Link href="/portal/monthly-summary" className="text-black hover:text-[#6C63FF] transition">Monthly Summary</Link>
            <Link href="/portal/tax-summary" className="text-black hover:text-[#6C63FF] transition">Tax Summary</Link>
          </div>

          {/* User Info + Logout */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3 bg-[#F3F2FF] px-4 py-2 rounded-full">
                <div className="w-9 h-9 rounded-full bg-[#6C63FF] text-white flex items-center justify-center font-bold">
                  {(profile?.full_name || user.email || "?").slice(0, 1).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold text-[#3f3d56]">
                    {profile?.full_name || "Your Account"}
                  </div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-white bg-[#FF6B6B] px-5 py-2 rounded hover:bg-[#e85e5e] transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-grow w-full max-w-screen-xl mx-auto px-8 py-12">
        {children}

        {/* AI Assistant Banner */}
        <div className="bg-indigo-100 text-[#3f3d56] text-sm px-6 py-3 text-center shadow-sm hover:bg-indigo-200 transition cursor-pointer">
          💬 Need help? Click your personal AI assistant in the bottom-right corner.
        </div>
      </main>

      {/* AI Chatbot Assistant */}
      <TaxMateAssistant />
    </div>
  );
}
