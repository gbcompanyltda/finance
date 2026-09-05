"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { useAuthStore } from "@/lib/authStore";

export function LoginScreen() {
  const signIn = useAuthStore((s) => s.signIn);
  const error = useAuthStore((s) => s.error);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await signIn(email.trim(), password);
    setSubmitting(false);
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-4 py-10 pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))]">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#0b2545]">
            <Wallet className="size-7 text-white" aria-hidden />
          </div>
          <h1 className="text-xl font-semibold text-black">Minhas Finanças</h1>
          <p className="mt-1 text-sm text-black/60">
            Entre para acessar seu orçamento pessoal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-black">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
              className="rounded-xl border border-black/15 bg-white px-3.5 py-3 text-base text-black outline-none focus:border-[#0b2545] focus:ring-2 focus:ring-[#0b2545]/20"
              placeholder="voce@email.com"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-black">
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="rounded-xl border border-black/15 bg-white px-3.5 py-3 text-base text-black outline-none focus:border-[#0b2545] focus:ring-2 focus:ring-[#0b2545]/20"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error === "Invalid login credentials"
                ? "Email ou senha incorretos."
                : error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-xl bg-[#0b2545] px-4 py-3 text-base font-medium text-white transition-opacity disabled:opacity-60"
          >
            {submitting ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
