import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { series, type Book } from "@/data/books";

export const metadata = { title: "Books" };

export default function BooksPage() {
  return (
    <>
      <PageHeader eyebrow="Books" title="Every book Mark has written.">
        Click linked covers to view books on Amazon. Free content-magnet
        stories are available through the newsletter signup. 27 novels
        published across 31 countries, 27 languages, and 2 million+ copies in
        print.
      </PageHeader>

      <Container className="py-16 space-y-20">
        <section className="rounded-[28px] border border-[var(--color-rule)] bg-[var(--color-surface)] p-8 shadow-sm md:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
              New Readers Start Here
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-primary)] md:text-4xl">
              Not sure which book to try first?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[var(--color-ink-soft)]">
              If your reader loves Minecraft, start with Gameknight999 Book One.
              If you&apos;d rather try before you buy, grab two free books first.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Link
              href="/free-books"
              className="rounded-2xl border border-[var(--color-rule)] bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Free First
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-[var(--color-primary)]">
                Get 2 free Minecraft books
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                Try Elytra Perils and The Virus before committing to a series.
              </p>
            </Link>
            <a
              href="https://www.amazon.com/gp/product/1632207117"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-[var(--color-rule)] bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Most Popular Starting Point
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-[var(--color-primary)]">
                Invasion of the Overworld
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                Begin with the first Gameknight999 adventure and read the series
                in order.
              </p>
            </a>
          </div>
        </section>

        {series.map((s) => (
          <section key={s.name}>
            <header className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--color-primary)]">
                {s.name}
              </h2>
              {s.tag && (
                <p className="mt-2 text-sm uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                  {s.tag}
                </p>
              )}
            </header>

            <div
              className={`mt-10 grid gap-6 ${
                s.books.length === 1
                  ? "grid-cols-1 max-w-xs mx-auto"
                  : s.books.length === 2
                  ? "sm:grid-cols-2 max-w-2xl mx-auto"
                  : s.books.length === 3
                  ? "sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto"
                  : "sm:grid-cols-2 lg:grid-cols-4"
              }`}
            >
              {s.books.map((book) => (
                <BookCard key={book.title} book={book} />
              ))}
            </div>
          </section>
        ))}
      </Container>
    </>
  );
}

function BookCard({ book }: { book: Book }) {
  const content = (
    <div className="group flex flex-col">
      <div className="aspect-[3/4] rounded-lg bg-[var(--color-surface)] border border-[var(--color-rule)] overflow-hidden flex items-center justify-center p-4 group-hover:shadow-xl transition-shadow">
        <Image
          src={book.cover}
          alt={book.title}
          width={320}
          height={420}
          className="max-h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="mt-3 text-center">
        <p className="font-display text-base text-[var(--color-ink)] leading-tight">
          {book.title}
        </p>
        {book.comingSoon && (
          <p className="mt-1 text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
            Coming soon
          </p>
        )}
        {!book.comingSoon && book.note && (
          <p className="mt-1 text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
            {book.note}
          </p>
        )}
      </div>
    </div>
  );

  if (!book.amazon || book.comingSoon) {
    return <div className="opacity-90">{content}</div>;
  }

  return (
    <a
      href={book.amazon}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
      aria-label={`Buy ${book.title} on Amazon`}
    >
      {content}
    </a>
  );
}
