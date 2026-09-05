"use client";

import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

interface AuthState {
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  supabase.auth.getSession().then(({ data }) => {
    set({ session: data.session, loading: false });
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    set({ session, loading: false });
  });

  return {
    session: null,
    loading: true,
    error: null,
    signIn: async (email, password) => {
      set({ error: null });
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) set({ error: error.message });
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };
});
