import { ReactNode } from "react";
import { Container } from "./Container";

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-[var(--color-rule)] bg-[var(--color-surface)]">
      <Container className="py-16 md:py-20">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold text-[var(--color-primary)] max-w-3xl">
          {title}
        </h1>
        {children && (
          <div className="mt-6 text-lg text-[var(--color-ink-soft)] max-w-2xl leading-relaxed">
            {children}
          </div>
        )}
      </Container>
    </section>
  );
}
