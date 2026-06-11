type StatusBadgeProps = {
  children: React.ReactNode;
  tone?: "default" | "muted" | "success";
};

const toneClasses: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  default: "border-[var(--border)] bg-white text-[var(--foreground)]",
  muted: "border-[var(--border)] bg-[var(--background)] text-[var(--muted)]",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

export function StatusBadge({ children, tone = "default" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}

