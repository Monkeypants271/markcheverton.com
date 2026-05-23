import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export const metadata = { title: "About Mark" };

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title="Why I write">
        Physics teacher turned research scientist turned bestselling author —
        the path was anything but planned.
      </PageHeader>

      <Container className="py-16">
        <div className="max-w-3xl space-y-6 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          <p>
            My son introduced me to Minecraft. We played together on a server
            until cyber-bullying tore it apart. To help him understand what had
            happened — and what to do about it — I wrote{" "}
            <em>Invasion of the Overworld</em>. That book launched a series:
            24 novels with Skyhorse Publishing, sold in 32 countries and 22
            languages, more than 2 million copies in print.
          </p>
          <p>
            Before writing full-time I spent ten years teaching Physics and
            Math at Cerritos High School, then another five teaching in New
            York. After that I spent fifteen years as a research physicist at
            General Electric working on machine vision, laser welding, sensors,
            and holography. I have a Bachelor&apos;s in Physics from CSU
            Fullerton and a Master&apos;s from CSU Long Beach.
          </p>
          <p>
            These days I write 8–10 hours a day. My latest novel{" "}
            <em>Facing the Beast Within</em> is about a sixth grader named
            Cameron Poole who has to stop a demon lord from invading Earth —
            and find a way through his own anxiety in the process.
          </p>
        </div>
      </Container>
    </>
  );
}
