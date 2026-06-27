import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { FreeBooksForm, FreeBooksCovers } from "./FreeBooksForm";

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
        title="Two Minecraft stories — free when you join the MVP Club."
      >
        Get <em>The Virus</em> and <em>Elytra Perils</em> delivered through
        BookFunnel. Plus occasional updates from Mark on new releases and
        character-naming contests.
      </PageHeader>

      <Container className="py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <FreeBooksCovers />
          <FreeBooksForm />
        </div>

        <p className="mt-12 text-center text-[var(--color-ink-soft)]">
          Want the full reading order? See the{" "}
          <Link
            href="/minecraft-books"
            className="font-semibold text-[var(--color-accent)] hover:underline"
          >
            complete Minecraft-inspired book guide
          </Link>
          .
        </p>

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
