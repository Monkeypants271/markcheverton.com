import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Get in touch with Mark.">
        I read and personally respond to every email. If you&apos;re writing
        about books, fan art, school projects, or author visits, this is the
        place.
      </PageHeader>

      <Container className="py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8 text-[var(--color-ink-soft)]">
            <div className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Fastest way to reach Mark
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-primary)]">
                Email is the best option.
              </h2>
              <p className="mt-4 leading-relaxed">
                To reduce spam, the address is written out instead of displayed
                as a clickable link. Please type it exactly as shown below.
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
                Email
              </h2>
              <p className="mt-2 text-lg">
                MarktheMinecraftAuthor
                <span className="text-[var(--color-muted)]"> (at) </span>gmail
                <span className="text-[var(--color-muted)]"> (dot) </span>com
              </p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                I usually reply within a few business days.
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
                Mail (fan art & letters)
              </h2>
              <address className="mt-2 not-italic">
                Gameknight Publishing<br />
                5 Southside Drive, Suite 11 #318<br />
                Clifton Park, NY 12065
              </address>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-8 shadow-sm">
              <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
                For schools and libraries
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-ink-soft)]">
                If you&apos;re asking about an author visit, availability,
                pricing, or program fit, the Author Visits page has the best
                overview.
              </p>
              <Link
                href="/author-visits"
                className="mt-6 inline-flex items-center rounded-full bg-[var(--color-accent)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-accent-soft)]"
              >
                Explore Author Visits
              </Link>
            </div>
            <div className="rounded-2xl border border-[var(--color-rule)] bg-white p-8 shadow-sm">
              <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
                A quick note
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-ink-soft)]">
                I love hearing from readers. Questions, fan art, school
                assignments, favorite characters, and story ideas are always
                welcome.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
