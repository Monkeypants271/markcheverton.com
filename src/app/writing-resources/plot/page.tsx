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
        <PlotBuilder />
      </Container>
    </>
  );
}
