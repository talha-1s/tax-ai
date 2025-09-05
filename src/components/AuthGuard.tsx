// src/components/AuthGuard.tsx
import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any;
  setProfile: (profile: any) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthGuard");
  return context;
};

export default function AuthGuard({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data, error } = await supabase.auth.getSession();
      const s = data?.session;

      if (!s) {
        router.replace("/login");
        return;
      }

      if (!mounted) return;
      setSession(s);

      // fetch user profile from "profiles" table
      const { data: prof, error: profError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", s.user.id)
        .single();

      if (profError) {
        console.warn("Profile fetch error:", profError.message);
      }

      if (!mounted) return;
      setProfile(prof || null);
      setLoading(false);
    }

    load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) router.replace("/login");
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading your portal…
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, profile, setProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
