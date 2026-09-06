import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const basePath = isGithubActions && repoName ? `/${repoName}` : "";

export const metadata: Metadata = {
  title: "Finance",
  description: "Controle financeiro pessoal",
  manifest: `${basePath}/manifest.webmanifest`,
  icons: {
    icon: `${basePath}/icon.png`,
    apple: `${basePath}/apple-touch-icon.png`,
  },
  appleWebApp: {
    capable: true,
    title: "Finance",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b2545",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} h-full`}>
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
