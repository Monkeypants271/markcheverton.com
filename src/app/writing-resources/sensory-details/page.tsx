import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export const metadata = { title: "Sensory Details" };

export default function SensoryDetailsPage() {
  return (
    <>
      <PageHeader eyebrow="Sensory Details" title="Don't just tell readers what's happening — help them feel it.">
        28 emotion-by-emotion guides for showing rather than telling. From
        anger to wonder to the small, specific kinds of dread.
      </PageHeader>

      <Container className="py-16">
        <p className="text-[var(--color-muted)]">
          Emotion library will be populated during content migration (Phase 2).
        </p>
      </Container>
    </>
  );
}
