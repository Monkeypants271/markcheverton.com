import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { series, type Book } from "@/data/books";

export const metadata = { title: "Books" };

export default function BooksPage() {
  return (
    <>
      <PageHeader eyebrow="Books" title="Every book Mark has written.">
        Click any cover to view that book on Amazon. 27 novels published across
        31 countries, 27 languages, and 2 million+ copies in print.
      </PageHeader>

      <Container className="py-16 space-y-20">
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
          unoptimized
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
