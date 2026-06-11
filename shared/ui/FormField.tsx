type FormFieldProps = {
  children: React.ReactNode;
  helpText?: string;
  label: string;
};

export function FormField({ children, helpText, label }: FormFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-2">{children}</div>
      {helpText ? (
        <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{helpText}</p>
      ) : null}
    </label>
  );
}

