import Link from "next/link";
import { navigationItems } from "@/shared/config/navigation";

export function Sidebar() {
  return (
    <aside className="hidden border-r border-[var(--border)] bg-[var(--surface)] lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="border-b border-[var(--border)] px-6 py-5">
        <p className="text-base font-semibold">VLM</p>
        <p className="text-sm text-[var(--muted)]">Content Studio</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigationItems.map((item) =>
          item.enabled ? (
            <Link
              className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-[var(--background)]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className="block rounded-md px-3 py-2 text-sm text-[var(--muted)]"
              key={item.href}
            >
              {item.label} · à venir
            </span>
          ),
        )}
      </nav>
    </aside>
  );
}

