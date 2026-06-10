import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { ExternalLink } from "@/components/ExternalLink";
import { LINKING_FANFIC_TO_READING_URL } from "@/data/minecraftBooks";
import { getAllPosts } from "@/lib/content";
import { FanFicSearch } from "./FanFicSearch";

export async function FanFicIndex({ page }: { page: number }) {
  const posts = await getAllPosts("fanfic");
  const totalPages = Math.max(1, Math.ceil(posts.length / 24));

  if (page > totalPages) notFound();

  return (
    <>
      <PageHeader eyebrow="Fan Fiction" title="Stories from readers around the world.">
        {posts.length > 0
          ? `${posts.length} stories and counting. Have one to share? Send it over and I'll post it.`
          : `Have a story you'd like to share? Send it over and I'll post it. Doesn't have to be Minecraft — any topic works.`}
      </PageHeader>

      <Container className="pt-10">
        <p className="mb-8 max-w-3xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
          Young writers have shared more than 1,000 stories here, many inspired
          by Minecraft,{" "}
          <Link
            href="/minecraft-books"
            className="font-semibold text-[var(--color-accent)] hover:underline"
          >
            Gameknight999
          </Link>
          , and their own imagined worlds. Want to write your own? Try Mark&apos;s{" "}
          <Link
            href="/writing-resources"
            className="font-semibold text-[var(--color-accent)] hover:underline"
          >
            writing resources
          </Link>
          . Please ask a parent before submitting anything online.
        </p>

        <div className="mb-8 rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            For parents &amp; teachers
          </p>
          <p className="mt-2 max-w-3xl leading-relaxed text-[var(--color-ink-soft)]">
            Fan fiction is one of the most powerful on-ramps to reading and
            writing — kids write more, and more eagerly, about worlds they
            love. Mark&apos;s free guide{" "}
            <ExternalLink
              href={LINKING_FANFIC_TO_READING_URL}
              className="font-semibold text-[var(--color-accent)] hover:underline"
            >
              Linking Fan Fiction to Reading
            </ExternalLink>{" "}
            shares 15 strategies for turning that enthusiasm into stronger
            reading and writing skills.
          </p>
        </div>

        <FanFicSearch posts={posts} initialPage={page} />
      </Container>
    </>
  );
}
