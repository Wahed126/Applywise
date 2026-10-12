import type { ReactNode } from "react";
import Header from "../components/layout/Header";

interface AppLayoutProps {
  children: ReactNode;
}
    
export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </main>
    </>
  );
}