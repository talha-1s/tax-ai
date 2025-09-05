// src/pages/_app.tsx
import type { AppProps } from "next/app";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthGuard from "../components/AuthGuard";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";

export default function MyApp({ Component, pageProps }: AppProps) {
  const AnyComponent = Component as any;

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
      <div className="flex min-h-screen flex-col bg-[#f2f4f7] text-[#1d1d1f]">
        <Navbar />
        <main className="flex-1">
          {AnyComponent.requiresAuth ? (
            <AuthGuard>
              <AnyComponent {...pageProps} />
            </AuthGuard>
          ) : (
            <AnyComponent {...pageProps} />
          )}
        </main>
        <Footer />
      </div>
    </SessionContextProvider>
  );
}
