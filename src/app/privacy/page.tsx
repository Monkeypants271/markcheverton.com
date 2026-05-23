import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <Container className="py-16">
        <p className="text-[var(--color-muted)]">
          Privacy policy content will be ported from the existing WordPress
          page during content migration (Phase 2).
        </p>
      </Container>
    </>
  );
}
