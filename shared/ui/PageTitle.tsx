type PageTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageTitle({ eyebrow, title, description }: PageTitleProps) {
  return (
    <div>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
      {description ? (
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

