import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { myrandaStories } from "@/data/myrandaMoss";

export function generateStaticParams() {
  return myrandaStories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = myrandaStories.find((s) => s.slug === slug);
  if (!story) return { title: "Story not found" };
  return { title: `${story.title} · Myranda Moss` };
}

export default async function MyrandaStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = myrandaStories.find((s) => s.slug === slug);
  if (!story) notFound();

  return (
    <>
      <PageHeader eyebrow={`Chapter ${story.chapter}`} title={story.title} />

      <Container className="py-16">
        <article className="mx-auto max-w-3xl">
          <Image
            src={story.image}
            alt={`Illustration for ${story.title}`}
            width={1448}
            height={1086}
            className="mb-10 h-auto w-full rounded-2xl shadow-lg"
            priority
          />

          <div className="space-y-5 text-lg leading-relaxed text-[var(--color-ink-soft)]">
            {story.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </article>

        <div className="mt-12 text-center">
          <Link
            href="/myranda-moss"
            className="inline-flex rounded-full border border-[var(--color-rule)] px-5 py-2 text-sm font-semibold text-[var(--color-ink-soft)] hover:border-[var(--color-accent)]"
          >
            ← Back to Myranda Moss
          </Link>
        </div>
      </Container>
    </>
  );
}
