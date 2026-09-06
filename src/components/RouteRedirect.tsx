"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Stub client-side para rotas antigas substituídas pela IA nova. */
export function RouteRedirect({ to }: { to: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(to);
  }, [router, to]);
  return null;
}
