import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export const metadata = { title: "Writing Resources" };

const tools = [
  {
    title: "Plot Builder",
    href: "/writing-resources/plot",
    body: "An 8-step interactive tool to outline your story from hook to new normal.",
  },
  {
    title: "Writing Tips",
    href: "/writing-resources/tips",
    body: "Short, practical essays to help writers make stronger choices.",
  },
  {
    title: "Sensory Details",
    href: "/writing-resources/sensory-details",
    body: "Ways to use sight, sound, and feeling to bring scenes and emotions to life.",
  },
  {
    title: "Story Prompts",
    href: "/writing-resources/prompts",
    body: "Themed starting points to help you begin without being told what to write.",
  },
];

export default function WritingResourcesPage() {
  return (
    <>
      <PageHeader eyebrow="Writing Resources" title="Tools for young writers.">
        Built from my own writing process and years in the classroom — used by
        teachers and kids in equal measure.
      </PageHeader>

      <Container className="py-16">
        <div className="grid sm:grid-cols-2 gap-6">
          {tools.map((t) => (
            <Link
              key={t.title}
              href={t.href}
              className="group rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-8 hover:border-[var(--color-accent)] hover:shadow-lg transition-all"
            >
              <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
                {t.title}
              </h2>
              <p className="mt-3 text-[var(--color-ink-soft)]">{t.body}</p>
              <p className="mt-6 text-sm font-semibold text-[var(--color-accent)] group-hover:translate-x-1 transition-transform">
                Open →
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
