import Link from "next/link";
import { Container } from "@/components/Container";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-bg)]" />
        <Container className="py-20 md:py-28">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            <div className="md:col-span-3">
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                New York Times Bestselling Author
              </p>
              <h1 className="mt-4 font-display text-5xl md:text-6xl font-semibold leading-[1.05] text-[var(--color-primary)]">
                Stories that help kids
                <br />
                <span className="italic">face the beast within.</span>
              </h1>
              <p className="mt-6 text-lg text-[var(--color-ink-soft)] max-w-xl leading-relaxed">
                Mark Cheverton has written 24 Minecraft-inspired novels published
                in 32 countries and 22 languages — 2 million+ copies in print.
                His work helps young readers tackle bullying, anxiety, and the
                courage it takes to keep trying.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/free-books"
                  className="inline-flex items-center rounded-full bg-[var(--color-accent)] text-white px-6 py-3 font-semibold hover:bg-[var(--color-accent-soft)] transition-colors"
                >
                  Get 2 Free Books
                </Link>
                <Link
                  href="/books"
                  className="inline-flex items-center rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] px-6 py-3 font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                >
                  Browse Books
                </Link>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-soft)] shadow-xl flex items-center justify-center text-white/70 text-sm">
                [Author photo / featured book cover]
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Three audiences */}
      <section className="py-20">
        <Container>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "For Young Readers",
                body: "Free Minecraft stories, fan fiction from kids around the world, and writing prompts to spark your next adventure.",
                href: "/free-books",
                cta: "Start reading",
              },
              {
                title: "For Educators",
                body: "Practical guides for integrating creativity and critical thinking into the lessons you already teach.",
                href: "/for-educators",
                cta: "Classroom resources",
              },
              {
                title: "For Schools",
                body: "Author visits that teach kids how to fail — and keep going. Available in-person and virtually.",
                href: "/author-visits",
                cta: "Request a visit",
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-8 hover:border-[var(--color-accent)] hover:shadow-lg transition-all"
              >
                <h3 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
                  {card.title}
                </h3>
                <p className="mt-3 text-[var(--color-ink-soft)] leading-relaxed">
                  {card.body}
                </p>
                <p className="mt-6 text-sm font-semibold text-[var(--color-accent)] group-hover:translate-x-1 transition-transform">
                  {card.cta} →
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Latest work */}
      <section className="py-20 bg-[var(--color-surface)] border-y border-[var(--color-rule)]">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-[3/4] max-w-sm rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-soft)] shadow-xl flex items-center justify-center text-white/70 text-sm">
              [Facing the Beast Within cover]
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Latest Novel
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-[var(--color-primary)]">
                Facing the Beast Within
              </h2>
              <p className="mt-4 text-lg text-[var(--color-ink-soft)] leading-relaxed">
                Cameron Poole is a sixth grader struggling with anxiety. When a
                demon lord threatens to invade Earth with mythical creatures,
                Cameron has to find the courage hiding inside him — the kind
                that doesn&apos;t mean fear goes away, but that you act anyway.
              </p>
              <Link
                href="/books"
                className="mt-6 inline-flex items-center rounded-full bg-[var(--color-primary)] text-white px-6 py-3 font-semibold hover:bg-[var(--color-primary-soft)] transition-colors"
              >
                See all books
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Writing tools teaser */}
      <section className="py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-4xl font-semibold text-[var(--color-primary)]">
              Free tools for young writers
            </h2>
            <p className="mt-4 text-lg text-[var(--color-ink-soft)]">
              Built from Mark&apos;s own writing process and years in the
              classroom — used by teachers and kids alike.
            </p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Plot Builder", body: "8-step interactive outliner", href: "/writing-resources/plot" },
              { title: "Writing Tips", body: "21 short essays on craft", href: "/writing-resources/tips" },
              { title: "Sensory Details", body: "28 emotions, shown not told", href: "/writing-resources/sensory-details" },
              { title: "Story Prompts", body: "30+ themed starting points", href: "/writing-resources/prompts" },
            ].map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 hover:border-[var(--color-accent)] transition-colors"
              >
                <h3 className="font-display text-xl font-semibold text-[var(--color-primary)]">
                  {tool.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                  {tool.body}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20">
        <Container>
          <div className="rounded-3xl bg-[var(--color-primary)] text-white p-12 md:p-16 text-center">
            <h2 className="font-display text-4xl font-semibold">
              Join the email community
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Get two free Minecraft stories — <em>Elytra Peril</em> and{" "}
              <em>The Virus</em> — and occasional updates from Mark.
            </p>
            <Link
              href="/free-books"
              className="mt-8 inline-flex items-center rounded-full bg-[var(--color-accent)] text-white px-8 py-4 text-lg font-semibold hover:bg-[var(--color-accent-soft)] transition-colors"
            >
              Get my free books
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
