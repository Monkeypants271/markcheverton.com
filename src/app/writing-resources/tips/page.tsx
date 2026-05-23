import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export const metadata = { title: "Writing Tips" };

export default function WritingTipsPage() {
  return (
    <>
      <PageHeader eyebrow="Writing Tips" title="Writing isn't about following rules. It's about making choices.">
        21 short essays on craft — from openings and dialogue to battle scenes
        and the dark night of the soul.
      </PageHeader>

      <Container className="py-16">
        <p className="text-[var(--color-muted)]">
          Article index will be populated during content migration (Phase 2).
        </p>
      </Container>
    </>
  );
}
