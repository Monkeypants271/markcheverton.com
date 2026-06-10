import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export const metadata = { title: "Writing Resources" };

const tools = [
  {
    title: "Plot Builder",
    href: "/writing-resources/plot",
    body: "An 8-step interactive tool to outline your story from hook to new normal.",
    image: "/images/writing/plot-builder.webp",
  },
  {
    title: "Writing Tips",
    href: "/writing-resources/tips",
    body: "Short, practical essays to help writers make stronger choices.",
    image: "/images/writing/writing-tips.webp",
  },
  {
    title: "Sensory Details",
    href: "/writing-resources/sensory-details",
    body: "Ways to use sight, sound, and feeling to bring scenes and emotions to life.",
    image: "/images/writing/sensory-details.webp",
  },
  {
    title: "Story Prompts",
    href: "/writing-resources/prompts",
    body: "Themed starting points to help you begin without being told what to write.",
    image: "/images/writing/story-prompts.webp",
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
        <div className="mb-10 rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6">
          <p className="text-lg leading-relaxed text-[var(--color-ink-soft)]">
            Have a Minecraft-loving writer at home or in your classroom? Start
            with{" "}
            <Link
              href="/writing-resources/prompts"
              className="font-semibold text-[var(--color-accent)] hover:underline"
            >
              Minecraft-inspired story prompts
            </Link>
            , then use the{" "}
            <Link
              href="/writing-resources/plot"
              className="font-semibold text-[var(--color-accent)] hover:underline"
            >
              Plot Builder
            </Link>{" "}
            to turn that idea into a real story. New here through the books? See
            the{" "}
            <Link
              href="/minecraft-books"
              className="font-semibold text-[var(--color-accent)] hover:underline"
            >
              Minecraft books for kids guide
            </Link>
            . Teachers and homeschoolers can also grab{" "}
            <Link
              href="/for-educators"
              className="font-semibold text-[var(--color-accent)] hover:underline"
            >
              free ELA companion guides and teaching resources
            </Link>
            .
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {tools.map((t) => (
            <Link
              key={t.title}
              href={t.href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] hover:border-[var(--color-accent)] hover:shadow-lg transition-all"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-rule)]">
                <Image
                  src={t.image}
                  alt={`${t.title} — a free writing resource from Mark Cheverton`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-8">
                <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
                  {t.title}
                </h2>
                <p className="mt-3 flex-1 text-[var(--color-ink-soft)]">
                  {t.body}
                </p>
                <p className="mt-6 text-sm font-semibold text-[var(--color-accent)] group-hover:translate-x-1 transition-transform">
                  Open →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
