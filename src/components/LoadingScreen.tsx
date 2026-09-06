import { Logo } from "./Logo";

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <Logo layout="col" gapClassName="gap-4" markSize={56} textClassName="text-2xl" />
    </div>
  );
}
