import type { ReactNode } from "react";
import Header from "../components/layout/Header";

interface AppLayoutProps {
  children: ReactNode;
}
    
export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div className="min-h-dvh bg-[#f7f9fb] px-2 py-2 font-sans text-[#101820] sm:px-5 sm:py-3 dark:bg-[#0b1117] dark:text-slate-100">
      <Header currentPath={window.location.pathname} />

      <main className="mx-auto w-full px-8 py-6 sm:px-6 sm:py-8 xl:w-4/5 xl:px-0">
        {children}
      </main>
    </div>
  );
}
