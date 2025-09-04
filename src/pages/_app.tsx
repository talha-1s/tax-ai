// src/pages/_app.tsx
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";

import type { AppProps } from "next/app";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthGuard from "../components/AuthGuard"; // import your AuthGuard

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <AuthGuard>
        <div className="flex min-h-screen flex-col bg-[#f2f4f7] text-[#1d1d1f]">
          <Navbar />
          <main className="flex-1">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </AuthGuard>
    </SessionContextProvider>
  );
}
