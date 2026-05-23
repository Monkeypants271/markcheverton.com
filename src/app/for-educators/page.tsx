import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export const metadata = { title: "For Educators" };

export default function ForEducatorsPage() {
  return (
    <>
      <PageHeader eyebrow="For Educators" title="Creativity that fits the lessons you already teach.">
        Practical, classroom-tested ways to add deeper thinking and creative
        decision-making — without rewriting your curriculum.
      </PageHeader>

      <Container className="py-16">
        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3 space-y-6 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            <p>
              I spent years designing and teaching lessons in real classrooms,
              and another decade and a half as a research engineer. That mix —
              practitioner plus systems-thinker — shapes everything I share
              here. The guidance below comes from what actually worked, not from
              theory.
            </p>
            <p>
              My focus is on the smallest possible instructional shifts that
              create room for thinking and creativity. No new programs, no
              wholesale change to what already works.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6">
              <p className="text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                Featured book
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-[var(--color-primary)]">
                Creativity Reclaimed
              </h3>
              <p className="mt-3 text-[var(--color-ink-soft)]">
                A practical guide for designing creative thinking opportunities
                inside the lessons you already teach.
              </p>
              <Link
                href="/books"
                className="mt-5 inline-flex rounded-full bg-[var(--color-accent)] text-white px-5 py-2 text-sm font-semibold hover:bg-[var(--color-accent-soft)]"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
