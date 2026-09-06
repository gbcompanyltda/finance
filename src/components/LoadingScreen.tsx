import { Wallet } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-white">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-[#0b2545]">
        <Wallet className="size-8 text-white" aria-hidden />
      </div>
      <p className="text-2xl font-bold tracking-tight text-black">Finan$e</p>
    </div>
  );
}
