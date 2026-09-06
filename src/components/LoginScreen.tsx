"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/authStore";
import { Logo } from "./Logo";

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
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <div className="flex flex-3 flex-col items-center justify-end gap-3 bg-[#0b2545] px-6 pb-12 pt-[max(6rem,env(safe-area-inset-top))] md:flex-none md:w-1/2 md:justify-center md:gap-4 md:py-0">
        <Logo
          tone="light"
          layout="col"
          gapClassName="gap-3 md:gap-4"
          markClassName="size-16 rounded-2xl md:size-20 md:rounded-3xl"
          iconClassName="size-8 md:size-10"
          textClassName="text-3xl md:text-4xl"
        />
        <p className="text-sm text-white/70 md:text-base">Controle financeiro pessoal</p>
      </div>

      <div className="flex flex-2 items-start justify-center bg-white px-4 pt-8 pb-[max(2.5rem,env(safe-area-inset-bottom))] md:flex-none md:w-1/2 md:items-center md:py-10">
        <div className="w-full max-w-60 md:max-w-sm">
          <h2 className="mb-5 text-center text-base font-semibold text-black md:mb-6 md:text-lg md:text-left">
            Entrar
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 md:gap-3">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-black">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="email"
                className="rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-base text-black outline-none focus:border-[#0b2545] focus:ring-2 focus:ring-[#0b2545]/20 md:py-3"
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
                className="rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-base text-black outline-none focus:border-[#0b2545] focus:ring-2 focus:ring-[#0b2545]/20 md:py-3"
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
              className="mt-2 rounded-xl bg-[#0b2545] px-4 py-2.5 text-base font-medium text-white transition-opacity disabled:opacity-60 md:py-3"
            >
              {submitting ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
