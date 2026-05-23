import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export const metadata = { title: "Free Books" };

const reviews = [
  {
    body: "My son couldn't put them down. He's normally a reluctant reader, but the Minecraft hook got him in.",
    source: "5★ Amazon Review",
  },
  {
    body: "Great moral lessons woven into a story that feels like an adventure, not a lecture.",
    source: "5★ Amazon Review",
  },
  {
    body: "Both my kids fight over who gets to read next.",
    source: "5★ Amazon Review",
  },
];

export default function FreeBooksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Free Books"
        title="Two Minecraft stories — free when you join my email community."
      >
        Get <em>Elytra Peril</em> and <em>The Virus</em> delivered through
        BookFunnel. Plus occasional updates on new releases.
      </PageHeader>

      <Container className="py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-soft)] shadow-xl flex items-center justify-center text-white/70 text-sm">
            [Elytra Peril + The Virus covers]
          </div>

          <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-rule)] p-8">
            <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
              Sign up
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              [Brevo signup form + BookFunnel redirect will be wired up in
              Phase 4. For now this is a visual placeholder.]
            </p>
            <p className="mt-6 text-xs text-[var(--color-muted)]">
              Kids: please ask a parent before sharing any information online.
            </p>
          </div>
        </div>

        <h2 className="mt-20 font-display text-3xl font-semibold text-[var(--color-primary)] text-center">
          What kids and parents are saying
        </h2>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <blockquote
              key={r.body}
              className="rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6"
            >
              <p className="text-[var(--color-ink-soft)]">“{r.body}”</p>
              <footer className="mt-3 text-xs font-semibold text-[var(--color-accent)]">
                {r.source}
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </>
  );
}
