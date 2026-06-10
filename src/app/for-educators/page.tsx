import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { ExternalLink } from "@/components/ExternalLink";
import { findBook } from "@/data/books";
import {
  bookCompanionGuides,
  elaResources,
  ELA_RESOURCES_URL,
} from "@/data/minecraftBooks";

export const metadata: Metadata = {
  title: "For Educators",
  description:
    "Free ELA companion guides, writing prompts, and teaching resources from NYT bestselling author Mark Cheverton — use the Gameknight999 Minecraft-inspired books to teach grammar, vocabulary, and writing.",
  alternates: { canonical: "/for-educators" },
};

export default function ForEducatorsPage() {
  return (
    <>
      <PageHeader eyebrow="For Educators" title="Creativity that fits the lessons you already teach.">
        Practical, classroom-tested ways to add deeper thinking and creative
        decision-making — without rewriting your curriculum.
      </PageHeader>

      <Container className="py-16">
        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3 space-y-6 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            <p>
              I spent years designing and teaching lessons in real classrooms,
              and another decade and a half as a research engineer. That mix —
              practitioner plus systems-thinker — shapes everything I share
              here. The guidance below comes from what actually worked, not from
              theory.
            </p>
            <p>
              My focus is on the smallest possible instructional shifts that
              create room for thinking and creativity. No new programs, no
              wholesale change to what already works.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6">
              <p className="text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                Featured book
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-[var(--color-primary)]">
                Creativity Reclaimed
              </h3>
              <p className="mt-3 text-[var(--color-ink-soft)]">
                A practical guide for designing creative thinking opportunities
                inside the lessons you already teach.
              </p>
              <ExternalLink
                href="https://www.amazon.com/Creativity-Reclaimed-Creative-Thinking-Lessons-ebook/dp/B0GJN5DSW3"
                className="mt-5 inline-flex rounded-full bg-[var(--color-accent)] text-white px-5 py-2 text-sm font-semibold hover:bg-[var(--color-accent-soft)]"
              >
                Learn more
              </ExternalLink>
            </div>
          </div>
        </div>
      </Container>

      {/* ELA companion guides for the Gameknight999 books */}
      <section className="border-y border-[var(--color-rule)] bg-[var(--color-surface)]">
        <Container className="py-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            Free Teaching &amp; ELA Resources
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold text-[var(--color-primary)] md:text-4xl">
            Teach grammar, vocabulary, and writing with the Gameknight999 books
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            Each ELA companion guide turns a Minecraft-inspired novel kids
            already love into lesson-ready English Language Arts activities —
            grammar, vocabulary, comprehension, and writing. They&apos;re free,
            and they work in classrooms and homeschools alike. (Delivered as
            free downloads through BookFunnel.)
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookCompanionGuides.map((guide, i) => {
              const book = findBook(guide.title);
              return (
                <div
                  key={guide.title}
                  className="flex flex-col rounded-2xl border border-[var(--color-rule)] bg-white p-6 shadow-sm"
                >
                  {book?.cover && (
                    <div className="mb-4 flex h-44 items-center justify-center">
                      <Image
                        src={book.cover}
                        alt={`Cover of ${guide.title} by Mark Cheverton`}
                        width={200}
                        height={260}
                        className="max-h-full w-auto object-contain"
                      />
                    </div>
                  )}
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                    Book {i + 1} · ELA Companion Guide
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-[var(--color-primary)]">
                    {guide.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                    {guide.blurb}
                  </p>
                  <ExternalLink
                    href={guide.href}
                    ariaLabel={`Get the free ELA companion guide for ${guide.title}`}
                    className="mt-5 inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-soft)]"
                  >
                    Get the free guide
                  </ExternalLink>
                </div>
              );
            })}
          </div>

          <h3 className="mt-14 font-display text-2xl font-semibold text-[var(--color-primary)]">
            More free writing &amp; homeschool resources
          </h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {elaResources.map((r) => (
              <li key={r.title}>
                <ExternalLink
                  href={r.href}
                  className="flex h-full flex-col rounded-2xl border border-[var(--color-rule)] bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:shadow-lg"
                >
                  <span className="font-display text-lg font-semibold text-[var(--color-primary)]">
                    {r.title}
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                    {r.description}
                  </span>
                  <span className="mt-4 text-sm font-semibold text-[var(--color-accent)]">
                    Get it free →
                  </span>
                </ExternalLink>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <ExternalLink
              href={ELA_RESOURCES_URL}
              className="inline-flex items-center rounded-full bg-[var(--color-primary)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-primary-soft)]"
            >
              Browse all ELA resources
            </ExternalLink>
            <Link
              href="/minecraft-books"
              className="inline-flex items-center rounded-full border border-[var(--color-rule)] px-6 py-3 font-semibold text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-accent)]"
            >
              See the Gameknight999 reading guide
            </Link>
            <Link
              href="/writing-resources"
              className="inline-flex items-center rounded-full border border-[var(--color-rule)] px-6 py-3 font-semibold text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-accent)]"
            >
              Free writing tools
            </Link>
          </div>
        </Container>
      </section>

      {/* Author visit funnel — turn educator interest into a booked visit */}
      <Container className="py-16">
        <div className="rounded-3xl bg-[var(--color-primary)] p-8 text-white md:p-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent-soft)]">
            Bring Mark to your school
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold md:text-4xl">
            Want the author behind these books in your building?
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">
            Many teachers and librarians first meet Mark through these free
            resources, then bring him in for an author visit. As a New York Times
            bestselling Minecraft author and former teacher, Mark delivers a
            growth-mindset presentation — in person or virtual — that turns
            reluctant readers and Gameknight999 fans into motivated writers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/author-visits"
              className="inline-flex items-center rounded-full bg-[var(--color-accent)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-accent-soft)]"
            >
              Explore author visits
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 font-semibold transition-colors hover:bg-white/10"
            >
              Request availability &amp; pricing
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
