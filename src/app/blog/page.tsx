import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export const metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <>
      <PageHeader eyebrow="Blog" title="On writing and teaching.">
        Short essays about creativity, classroom practice, and the long road
        from rejection to becoming a New York Times bestselling author.
      </PageHeader>

      <Container className="py-16">
        <p className="text-[var(--color-muted)]">
          Post archive will be populated during content migration (Phase 2).
        </p>
      </Container>
    </>
  );
}
