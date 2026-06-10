import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { ExternalLink } from "@/components/ExternalLink";
import { findBook } from "@/data/books";
import {
  getGameknightReadingOrder,
  seriesCards,
} from "@/data/minecraftBooks";

export const metadata: Metadata = {
  title: {
    absolute:
      "Minecraft Books for Kids | Gameknight999 Reading Guide | Mark Cheverton",
  },
  description:
    "Find Minecraft-inspired books for kids by Mark Cheverton. Start with Gameknight999, see the complete reading order, and discover middle-grade adventure novels for reluctant readers.",
  alternates: {
    canonical: "/minecraft-books",
  },
  openGraph: {
    title: "Minecraft Books for Kids: Gameknight999 Reading Guide",
    description:
      "Start with Invasion of the Overworld and follow the complete Gameknight999 reading order from Mark Cheverton.",
    url: "https://www.markcheverton.com/minecraft-books/",
    type: "website",
  },
};

const DISCLAIMER =
  "These are unofficial Minecraft-inspired novels. Minecraft is a trademark of its owner. These books are not official Minecraft products and are not endorsed by Mojang or Microsoft.";

const faqs: { q: string; a: string }[] = [
  {
    q: "What order should kids read the Gameknight999 books in?",
    a: "Start with Invasion of the Overworld, then read the series in order through the six Gameknight999 arcs (Books 1–18), followed by the Far Lands sequel saga (Books 19–24). The full reading-order table above lists every book in sequence.",
  },
  {
    q: "Are these official Minecraft books?",
    a: "No. These are unofficial, Minecraft-inspired novels. Minecraft is a trademark of its owner, and these books are not official Minecraft products and are not endorsed by Mojang or Microsoft. They are original adventure stories written for kids who love the world of Minecraft.",
  },
  {
    q: "What age are these books for?",
    a: "They are middle-grade adventure novels written mainly for readers roughly 8–13 years old, at about a sixth-grade reading level, and typically 200–250 pages each. Younger and older fans enjoy them too. The familiar Minecraft setting and fast pace make them a great fit for upper-elementary and middle-school readers.",
  },
  {
    q: "Are these good books for reluctant readers?",
    a: "Yes. The familiar Minecraft setting, short chapters, cliffhangers, and constant action make these a popular choice for kids who normally resist reading. Many parents say a Gameknight999 book was the first novel their child finished on their own.",
  },
  {
    q: "Where can I buy the books?",
    a: "Each title in the reading-order table links to its page on Amazon. The books are also available through other booksellers and many libraries.",
  },
];

export default function MinecraftBooksPage() {
  const readingOrder = getGameknightReadingOrder();
  const startBook = findBook("Invasion of the Overworld");

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mark Cheverton",
    url: "https://www.markcheverton.com/",
    jobTitle: "Author",
    description:
      "New York Times bestselling author of Minecraft-inspired novels and books for young readers.",
  };

  const bookJsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "Invasion of the Overworld",
    author: { "@type": "Person", name: "Mark Cheverton" },
    genre: "Middle-grade adventure",
    inLanguage: "en",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="border-b border-[var(--color-rule)] bg-[var(--color-surface)]">
        <Container className="py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            Minecraft-Inspired Books
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold text-[var(--color-primary)] md:text-5xl">
            Minecraft Books for Kids: The Complete Gameknight999 Reading Guide
          </h1>
          <div className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            <p>
              If your reader loves Minecraft, adventure, danger, monsters,
              teamwork, and fast-paced stories, this is the best place to start.
              Mark Cheverton&apos;s Minecraft-inspired novels have helped
              millions of young readers discover the fun of reading. Start with{" "}
              <em>Invasion of the Overworld</em>, then follow Gameknight999
              through the series in order.
            </p>
            <p className="mt-4 text-base text-[var(--color-muted)]">
              Written for parents, teachers, librarians, and any kid looking for
              their next great read.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {startBook?.amazon && (
              <ExternalLink
                href={startBook.amazon}
                ariaLabel="Buy Invasion of the Overworld on Amazon"
                className="inline-flex items-center rounded-full bg-[var(--color-accent)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-accent-soft)]"
              >
                Start with Invasion of the Overworld
              </ExternalLink>
            )}
            <a
              href="#reading-order"
              className="inline-flex items-center rounded-full border border-[var(--color-rule)] px-6 py-3 font-semibold text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-accent)]"
            >
              Jump to the reading order
            </a>
          </div>
        </Container>
      </section>

      <Container className="space-y-20 py-16">
        {/* Disclaimer */}
        <p className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-5 text-sm leading-relaxed text-[var(--color-muted)]">
          {DISCLAIMER}
        </p>

        {/* Start Here */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            Start Here
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-primary)] md:text-4xl">
            New readers start with <em>Invasion of the Overworld</em>
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            It&apos;s the very first Gameknight999 adventure and the best entry
            point into the whole Minecraft-inspired universe. A gamer named
            Gameknight999 is pulled inside his favorite game — where the
            monsters are real, the danger is real, and the only way home is to
            survive.
          </p>
          {startBook?.amazon && (
            <ExternalLink
              href={startBook.amazon}
              ariaLabel="Buy Invasion of the Overworld on Amazon"
              className="mt-6 inline-flex items-center rounded-full bg-[var(--color-accent)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-accent-soft)]"
            >
              Get Book One on Amazon
            </ExternalLink>
          )}
        </section>

        {/* Reading Order */}
        <section id="reading-order" className="scroll-mt-24">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            Reading Order
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-primary)] md:text-4xl">
            Gameknight999 books in order
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            The complete Minecraft-inspired saga in reading order — the six
            original Gameknight999 arcs followed by the Far Lands sequel saga.
            Every book is a fast adventure with a positive theme parents can feel
            good about, listed below.
          </p>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--color-rule)]">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[var(--color-surface)] text-[var(--color-primary)]">
                  <th scope="col" className="px-4 py-3 font-semibold">
                    #
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Book Title
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Series / Arc
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Theme / Message
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Buy / Learn More
                  </th>
                </tr>
              </thead>
              <tbody>
                {readingOrder.map((entry) => (
                  <tr
                    key={entry.order}
                    className="border-t border-[var(--color-rule)] align-top"
                  >
                    <td className="px-4 py-3 font-semibold text-[var(--color-accent)]">
                      {entry.order}
                    </td>
                    <td className="px-4 py-3 font-medium text-[var(--color-ink)]">
                      {entry.title}
                      {entry.order === 1 && (
                        <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                          ★ Start here
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-ink-soft)]">
                      <span className="block">{entry.arc}</span>
                      <span className="text-xs text-[var(--color-muted)]">
                        {entry.saga}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-ink-soft)]">
                      {entry.theme ?? entry.bestFor}
                    </td>
                    <td className="px-4 py-3">
                      {entry.amazon ? (
                        <ExternalLink
                          href={entry.amazon}
                          ariaLabel={`Buy ${entry.title} on Amazon`}
                          className="font-semibold text-[var(--color-accent)] hover:underline"
                        >
                          Amazon →
                        </ExternalLink>
                      ) : (
                        <Link
                          href="/books"
                          className="font-semibold text-[var(--color-accent)] hover:underline"
                        >
                          Details →
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            Looking for every series Mark has written?{" "}
            <Link
              href="/books"
              className="font-semibold text-[var(--color-accent)] hover:underline"
            >
              Browse all books
            </Link>
            .
          </p>
        </section>

        {/* Series Overview */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            Series Overview
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-primary)] md:text-4xl">
            The Minecraft-inspired arcs
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {seriesCards.map((card) => {
              const start = findBook(card.startsWith);
              return (
                <div
                  key={card.arc}
                  className="flex flex-col rounded-2xl border border-[var(--color-rule)] bg-white p-6 shadow-sm"
                >
                  <h3 className="font-display text-xl font-semibold text-[var(--color-primary)]">
                    {card.arc}
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                    {card.saga}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                    {card.description}
                  </p>
                  <p className="mt-4 text-sm text-[var(--color-ink)]">
                    <span className="font-semibold">Starts with:</span>{" "}
                    {start?.amazon ? (
                      <ExternalLink
                        href={start.amazon}
                        ariaLabel={`Buy ${card.startsWith} on Amazon`}
                        className="text-[var(--color-accent)] hover:underline"
                      >
                        {card.startsWith}
                      </ExternalLink>
                    ) : (
                      card.startsWith
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Reluctant Readers */}
        <section className="rounded-3xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            For Parents
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-primary)] md:text-4xl">
            Why Minecraft-inspired books work for reluctant readers
          </h2>
          <div className="mt-4 max-w-3xl space-y-4 text-lg leading-relaxed text-[var(--color-ink-soft)]">
            <p>
              Kids who resist reading often aren&apos;t &ldquo;bad
              readers&rdquo; — they just haven&apos;t found a book that feels
              like it was made for them. When a story is set in a world they
              already love, the hardest part of reading, getting started,
              disappears. They already know the Overworld, the mobs, and the
              rules, so they can pour all their energy into the story.
            </p>
            <p>
              Short chapters, cliffhangers, and nonstop action keep the pages
              turning. Many parents say a Gameknight999 book was the first novel
              their child finished entirely on their own.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/blog/minecraft-books-for-reluctant-readers"
              className="inline-flex items-center rounded-full border border-[var(--color-rule)] px-5 py-2 text-sm font-semibold text-[var(--color-ink-soft)] hover:border-[var(--color-accent)]"
            >
              Read more on reluctant readers
            </Link>
            <Link
              href="/free-books"
              className="inline-flex items-center rounded-full border border-[var(--color-rule)] px-5 py-2 text-sm font-semibold text-[var(--color-ink-soft)] hover:border-[var(--color-accent)]"
            >
              Try free stories first
            </Link>
          </div>
        </section>

        {/* Teachers / Librarians */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            For Teachers &amp; Librarians
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-primary)] md:text-4xl">
            High-interest reading that supports literacy
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            These middle-grade adventure novels are a natural fit for classrooms
            and libraries: high-interest hooks for striving readers, clear story
            structure for teaching plot and character, and a built-in bridge
            from a game kids love to the books they read. Mark is a former
            teacher, and many students first discover him through Gameknight999.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/author-visits"
              className="inline-flex items-center rounded-full border border-[var(--color-rule)] px-5 py-2 text-sm font-semibold text-[var(--color-ink-soft)] hover:border-[var(--color-accent)]"
            >
              Author visits
            </Link>
            <Link
              href="/writing-resources"
              className="inline-flex items-center rounded-full border border-[var(--color-rule)] px-5 py-2 text-sm font-semibold text-[var(--color-ink-soft)] hover:border-[var(--color-accent)]"
            >
              Writing resources
            </Link>
          </div>
        </section>

        {/* More for fans */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            More for Minecraft Fans
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-primary)] md:text-4xl">
            Keep exploring
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Link
              href="/fanfic"
              className="rounded-2xl border border-[var(--color-rule)] bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <h3 className="font-display text-xl font-semibold text-[var(--color-primary)]">
                Fan Fiction
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                Read Minecraft-inspired stories written by other young readers —
                or share your own.
              </p>
            </Link>
            <Link
              href="/writing-resources"
              className="rounded-2xl border border-[var(--color-rule)] bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <h3 className="font-display text-xl font-semibold text-[var(--color-primary)]">
                Writing Resources
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                Free prompts and tools to help a Minecraft-loving kid write
                their own adventure.
              </p>
            </Link>
            <Link
              href="/about"
              className="rounded-2xl border border-[var(--color-rule)] bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <h3 className="font-display text-xl font-semibold text-[var(--color-primary)]">
                About Mark
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                How a physics teacher and his son turned a game into a
                bestselling series.
              </p>
            </Link>
          </div>
        </section>

        {/* Free Stories */}
        <section className="rounded-3xl bg-[var(--color-primary)] p-8 text-white md:p-10">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            Try free Minecraft-inspired stories
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">
            Not ready to commit to a series? Start with a couple of free
            Minecraft-inspired short stories and see why kids keep reading.
          </p>
          <Link
            href="/free-books"
            className="mt-6 inline-flex items-center rounded-full bg-[var(--color-accent)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-accent-soft)]"
          >
            Get free stories
          </Link>
        </section>

        {/* FAQ */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            FAQ
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-primary)] md:text-4xl">
            Common questions
          </h2>
          <dl className="mt-8 divide-y divide-[var(--color-rule)] border-t border-[var(--color-rule)]">
            {faqs.map((f) => (
              <div key={f.q} className="py-6">
                <dt className="font-display text-xl font-semibold text-[var(--color-primary)]">
                  {f.q}
                </dt>
                <dd className="mt-2 leading-relaxed text-[var(--color-ink-soft)]">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-5 text-sm leading-relaxed text-[var(--color-muted)]">
            {DISCLAIMER}
          </p>
        </section>
      </Container>
    </>
  );
}
