"use client";

import Link from "next/link";

export function AuthShell({
  subtitle,
  footer,
  children,
}: {
  subtitle?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="auth-page auth-page-centered">
      <div className="auth-centered-wrap">
        <section className="auth-hero-minimal">
          <p className="auth-brand-kicker">
            Success Coaching • Academic Growth • Wellness
          </p>
          <h1 className="auth-brand-title">The Scholars Edge</h1>
          {subtitle ? <p className="auth-brand-subtitle">{subtitle}</p> : null}
        </section>

        <section className="auth-form-card">
          <div className="auth-form-stack">
            {children}
            {footer ? <div className="auth-footer">{footer}</div> : null}
          </div>
        </section>
      </div>
    </main>
  );
}

export function AuthAltLink({
  text,
  href,
  linkLabel,
}: {
  text: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <p className="auth-alt-link">
      {text}{" "}
      <Link href={href} className="auth-inline-link">
        {linkLabel}
      </Link>
    </p>
  );
}
