import type { ReactNode } from "react";

type HeroVariant = "default" | "blue" | "violet" | "emerald" | "amber";

export function HeroSection({
  kicker,
  title,
  subtitle,
  right,
  actions,
  variant = "default",
}: {
  kicker?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  actions?: ReactNode;
  variant?: HeroVariant;
}) {
  return (
    <section className={`hero-panel hero-panel-${variant}`}>
      <div className="hero-inner">
        <div className="hero-copy">
          {kicker ? <p className="hero-kicker">{kicker}</p> : null}
          <h1 className="hero-title">{title}</h1>
          {subtitle ? <p className="hero-subtitle">{subtitle}</p> : null}
          {actions ? <div className="hero-actions">{actions}</div> : null}
        </div>

        {right ? <div className="hero-right">{right}</div> : null}
      </div>
    </section>
  );
}
