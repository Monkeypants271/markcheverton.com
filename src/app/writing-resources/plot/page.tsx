import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { PlotBuilder } from "./PlotBuilder";

export const metadata = { title: "Plot Builder" };

export default function PlotBuilderPage() {
  return (
    <>
      <PageHeader eyebrow="Plot Builder" title="Plot — What Happens in Your Story">
        Plan your story from beginning to end. This page saves your work on
        this device automatically, so you can come back any time.
      </PageHeader>
      <Container className="py-16">
        <div className="mx-auto max-w-3xl mb-12">
          <p className="text-[var(--color-ink-soft)] mb-4">
            Watch this short video to see how to use the Plot Builder:
          </p>
          <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-lg bg-black">
            <iframe
              className="h-full w-full"
              src="https://www.youtube-nocookie.com/embed/XlZ9Og_dDvo"
              title="How to use the Plot Builder"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
        <PlotBuilder />
      </Container>
    </>
  );
}
