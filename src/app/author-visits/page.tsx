import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export const metadata = { title: "Author Visits" };

const benefits = [
  {
    title: "Resilience through failure",
    body: "Students learn that struggle isn't weakness — it's part of how creative work actually happens.",
  },
  {
    title: "A new view of creativity",
    body: "Writing stops feeling mysterious and starts feeling like a set of choices anyone can make.",
  },
  {
    title: "Confidence to try",
    body: "Permission to attempt something without the guarantee of success — the foundation of every great writer.",
  },
  {
    title: "Hope that sticks",
    body: "Motivation that outlasts the visit and shows up the next time they sit down to write.",
  },
];

const testimonials = [
  {
    quote: "One of the best author visits we've ever had.",
    source: "Librarian, Rosendale Elementary",
  },
  {
    quote: "Engaging, hilarious, and grounded in a real growth-mindset message.",
    source: "Librarian, Maple Ave Middle",
  },
  {
    quote: "The kids were still talking about it weeks later.",
    source: "Librarian, Craig Elementary",
  },
];

export default function AuthorVisitsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Author Visits"
        title="A visit that teaches kids how to fail — and keep going."
      >
        A growth-mindset presentation from a New York Times bestselling author
        and former teacher. In-person or virtual; 1–2 day response time.
      </PageHeader>

      <Container className="py-12">
        <Link
          href="/contact"
          className="inline-flex rounded-full bg-[var(--color-accent)] text-white px-6 py-3 font-semibold hover:bg-[var(--color-accent-soft)]"
        >
          Request availability & pricing
        </Link>
      </Container>

      <Container className="py-12">
        <h2 className="font-display text-3xl font-semibold text-[var(--color-primary)]">
          What students take away
        </h2>
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6"
            >
              <h3 className="font-display text-xl font-semibold text-[var(--color-primary)]">
                {b.title}
              </h3>
              <p className="mt-2 text-[var(--color-ink-soft)]">{b.body}</p>
            </div>
          ))}
        </div>
      </Container>

      <Container className="py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <blockquote
              key={t.source}
              className="rounded-xl bg-[var(--color-primary)] text-white p-6"
            >
              <p className="font-display text-lg italic leading-snug">
                “{t.quote}”
              </p>
              <footer className="mt-4 text-sm text-white/70">— {t.source}</footer>
            </blockquote>
          ))}
        </div>
      </Container>

      <Container className="py-16">
        <div className="rounded-3xl bg-[var(--color-surface)] border border-[var(--color-rule)] p-10 text-center">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-primary)]">
            Ready to bring this message to your school?
          </h2>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-[var(--color-accent)] text-white px-6 py-3 font-semibold hover:bg-[var(--color-accent-soft)]"
          >
            Request availability & pricing
          </Link>
        </div>
      </Container>
    </>
  );
}
