import { Header } from "@/shared/ui/Header";
import { Sidebar } from "@/shared/ui/Sidebar";

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}

