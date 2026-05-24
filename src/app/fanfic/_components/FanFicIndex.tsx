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
        <FanFicSearch posts={posts} initialPage={page} />
      </Container>
    </>
  );
}
