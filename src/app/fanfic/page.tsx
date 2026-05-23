import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export const metadata = { title: "Fan Fiction" };

export default function FanFicPage() {
  return (
    <>
      <PageHeader eyebrow="Fan Fiction" title="Stories from readers around the world.">
        Have a story you&apos;d like to share? Send it over and I&apos;ll post
        it. Doesn&apos;t have to be Minecraft — any topic works.
      </PageHeader>

      <Container className="py-16">
        <p className="text-[var(--color-muted)]">
          Story archive (84 pages of submissions), submission form, and
          moderated comments will arrive in Phases 2, 5, and 6.
        </p>
      </Container>
    </>
  );
}
