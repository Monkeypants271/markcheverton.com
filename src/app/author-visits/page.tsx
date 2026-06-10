import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Author Visits — In-Person & Virtual School Visits",
  description:
    "Book an in-person or virtual school author visit with New York Times bestselling Minecraft author Mark Cheverton. A growth-mindset presentation that turns Gameknight999 fans and reluctant readers into motivated writers — for elementary and middle schools and libraries.",
  alternates: { canonical: "/author-visits" },
  openGraph: {
    title: "Author Visits with Mark Cheverton — In-Person & Virtual",
    description:
      "A growth-mindset author visit from a NYT bestselling Minecraft author and former teacher. In-person or virtual, for schools and libraries.",
    url: "https://www.markcheverton.com/author-visits/",
    type: "website",
  },
};

const formats = [
  {
    title: "In-person assemblies & classroom visits",
    body: "A high-energy, growth-mindset presentation for a whole grade level or a single class.",
  },
  {
    title: "Virtual author visits",
    body: "Can't host in person? Mark presents the same engaging session live over video — for any school, anywhere.",
  },
  {
    title: "Libraries & literacy programs",
    body: "A natural fit for summer reading, book clubs, and literacy nights built around high-interest reading.",
  },
];

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
        <p className="max-w-3xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
          Many students first discover Mark through the{" "}
          <Link
            href="/minecraft-books"
            className="font-semibold text-[var(--color-accent)] hover:underline"
          >
            Gameknight999 Minecraft-inspired novels
          </Link>
          . His author visits use that excitement to help students understand
          story, revision, resilience, and the courage to keep writing.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-flex rounded-full bg-[var(--color-accent)] text-white px-6 py-3 font-semibold hover:bg-[var(--color-accent-soft)]"
        >
          Request availability & pricing
        </Link>
      </Container>

      <Container className="py-12">
        <h2 className="font-display text-3xl font-semibold text-[var(--color-primary)]">
          In-person and virtual author visits for schools and libraries
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
          Mark&apos;s visits are especially powerful for reluctant readers and
          the Minecraft fans in your building — kids who light up when the author
          of their favorite books walks in (or appears on screen). Sessions work
          for elementary and middle school students.
        </p>
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {formats.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6"
            >
              <h3 className="font-display text-xl font-semibold text-[var(--color-primary)]">
                {f.title}
              </h3>
              <p className="mt-2 text-[var(--color-ink-soft)]">{f.body}</p>
            </div>
          ))}
        </div>
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
