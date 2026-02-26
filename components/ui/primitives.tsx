import React from "react";

function cx(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <main className={cx("page-shell", className)}>{children}</main>;
}

export function PageStack({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cx("page-stack", className)}>{children}</div>;
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <header className="page-header">
      <div className="topbar">
        <div className="topbar-brand">
          <div className="topbar-logo">The Scholars Edge</div>
        </div>
        {right ? <div className="topbar-actions">{right}</div> : null}
      </div>

      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
      </div>
    </header>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cx("card-surface card-padding", className)}>{children}</section>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

export function Muted({ children }: { children: React.ReactNode }) {
  return <p className="muted text-sm">{children}</p>;
}

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  const base =
    variant === "primary"
      ? "btn-primary"
      : variant === "secondary"
      ? "btn-secondary"
      : "btn-ghost";

  return (
    <button className={cx(base, className)} {...props}>
      {children}
    </button>
  );
}

export function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx("field", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cx("select-field", props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cx("textarea-field", props.className)} />;
}
