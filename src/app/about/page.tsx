import Link from "next/link";
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
            happened — and what to do about it — I self-published{" "}
            <em>Invasion of the Overworld</em> in 2013. I didn&apos;t expect
            much. But when it reached <strong>#29 on Amazon&apos;s Top 100</strong>{" "}
            and the publishers started calling, I knew I&apos;d hit a nerve with
            kids. Ten years and <strong>27 novels</strong> later — published in{" "}
            <strong>31 countries</strong>, translated into{" "}
            <strong>27 languages</strong>, with over <strong>2 million copies</strong>{" "}
            sold worldwide — I&apos;m still doing it. That story became{" "}
            <em>Invasion of the Overworld</em>, the first book in the
            Gameknight999 series. See the{" "}
            <Link
              href="/minecraft-books"
              className="font-semibold text-[var(--color-accent)] hover:underline"
            >
              complete Minecraft-inspired reading guide
            </Link>
            .
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
