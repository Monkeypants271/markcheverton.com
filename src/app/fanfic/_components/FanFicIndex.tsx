import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
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
        <FanFicSearch posts={posts} initialPage={page} />
      </Container>
    </>
  );
}
