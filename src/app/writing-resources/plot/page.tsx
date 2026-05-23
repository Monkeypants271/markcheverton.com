import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export const metadata = { title: "Plot Builder" };

export default function PlotBuilderPage() {
  return (
    <>
      <PageHeader eyebrow="Plot Builder" title="Outline your story in 8 steps.">
        Built around Pixar&apos;s Rule #4. Saves automatically as you type —
        come back any time and pick up where you left off.
      </PageHeader>

      <Container className="py-16">
        <div className="rounded-2xl border border-dashed border-[var(--color-rule)] bg-[var(--color-surface)] p-10 text-center text-[var(--color-muted)]">
          <p className="font-display text-xl text-[var(--color-ink-soft)]">
            Interactive Plot Builder coming in Phase 3.
          </p>
          <p className="mt-2 text-sm">
            Will include 8 prompt sections, localStorage autosave, plus
            Show / Copy / Reset buttons — matching the original tool.
          </p>
        </div>
      </Container>
    </>
  );
}
