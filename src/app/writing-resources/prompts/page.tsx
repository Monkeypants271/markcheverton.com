import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export const metadata = { title: "Story Prompts" };

export default function StoryPromptsPage() {
  return (
    <>
      <PageHeader eyebrow="Story Prompts" title="Every story starts with an idea. Sometimes you just need a nudge.">
        30+ themed collections — from dragons and aliens to time travel and
        Minecraft. Change them, twist them, ignore them. Just start.
      </PageHeader>

      <Container className="py-16">
        <p className="text-[var(--color-muted)]">
          Prompt library will be populated during content migration (Phase 2).
        </p>
      </Container>
    </>
  );
}
