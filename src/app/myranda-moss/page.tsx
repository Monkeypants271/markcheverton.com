import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { myrandaStories } from "@/data/myrandaMoss";

export const metadata = {
  title: "Myranda Moss",
  description:
    "Free short stories following Myranda Moss — a young elf who learns that good enough can be more than good enough.",
};

export default function MyrandaMossPage() {
  return (
    <>
      <PageHeader eyebrow="Short Stories" title="Myranda Moss">
        Four short stories following Mossy — a young elf inventor who discovers
        that the cracks and quirks she worries about are exactly what make her
        strong. Click a story to start reading.
      </PageHeader>

      <Container className="py-16">
        <div className="grid gap-10 sm:grid-cols-2">
          {myrandaStories.map((story) => (
            <article key={story.slug} className="flex flex-col">
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Chapter {story.chapter}
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-[var(--color-primary)]">
                {story.title}
              </h2>

              <Link
                href={`/myranda-moss/${story.slug}`}
                className="group mt-4 block overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                aria-label={`Read ${story.title}`}
              >
                <Image
                  src={story.image}
                  alt={`Illustration for ${story.title}`}
                  width={1448}
                  height={1086}
                  className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}
