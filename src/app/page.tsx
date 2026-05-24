import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { findBook } from "@/data/books";

export default function Home() {
  return (
    <>
      {/* Hero — free Minecraft books offer */}
      <section
        className="relative overflow-hidden bg-[var(--color-primary)] bg-cover bg-center bg-scroll text-white md:bg-fixed"
        style={{ backgroundImage: "url('/images/home/homepage-header.webp')" }}
      >
        <div className="absolute inset-0 bg-[var(--color-primary)]/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/65 via-[var(--color-primary)]/55 to-[var(--color-primary)]/45" />
        <Container className="relative z-10 py-20 md:py-28">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            <div className="md:col-span-3">
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent-soft)]">
                New York Times Bestselling Author
              </p>
              <h1 className="mt-4 font-display text-5xl md:text-6xl font-semibold leading-[1.05]">
                Get 2 free
                <br />
                Minecraft eBooks
                <span className="text-[var(--color-accent-soft)]">.</span>
              </h1>
              <p className="mt-6 text-lg text-white/80 max-w-xl leading-relaxed">
                Join the MVP Club and I&apos;ll send you <em>Elytra Perils</em>{" "}
                and <em>The Virus</em> — two Minecraft-inspired stories — plus
                first looks at upcoming novels and contests to name characters
                in my next book.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/free-books"
                  className="inline-flex items-center rounded-full bg-[var(--color-accent)] text-white px-7 py-4 text-lg font-semibold hover:bg-[var(--color-accent-soft)] transition-colors"
                >
                  I want some books!
                </Link>
                <Link
                  href="/books"
                  className="inline-flex items-center rounded-full border border-white/40 px-6 py-4 font-semibold hover:bg-white/10 transition-colors"
                >
                  Browse all books
                </Link>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="relative aspect-[4/5]">
                <div className="absolute inset-x-8 bottom-12 top-12 rounded-[32px] bg-black/25 blur-3xl" />
                <Image
                  src="/images/home/free-book-covers.png"
                  alt="Elytra Perils and The Virus free Minecraft eBook covers"
                  width={614}
                  height={441}
                  priority
                  className="absolute left-1/2 top-1/2 w-[116%] max-w-none -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured series — Gameknight999 */}
      <section
        className="relative overflow-hidden bg-[#243515] bg-cover bg-center bg-scroll py-20 text-white md:bg-fixed md:py-28"
        style={{ backgroundImage: "url('/images/home/minecraft-lobby.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#273814]/68" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#4b3517]/58 via-[#273814]/68 to-[#17220d]/78" />
        <Container className="relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
              Featured Series
            </p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold text-white">
              The Gameknight999 Series
            </h2>
            <p className="mt-3 text-xl text-white/80 italic">
              The 1st Minecraft series ever published.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: "Invasion of the Overworld",
                number: "Book One",
                cover: "/images/home/invasion-overworld.png",
                href: "https://www.amazon.com/gp/product/1632207117",
              },
              {
                title: "Battle for the Nether",
                number: "Book Two",
                cover: "/images/home/battle-nether.png",
                href: "https://www.amazon.com/gp/product/1632207125",
              },
              {
                title: "Confronting the Dragon",
                number: "Book Three",
                cover: "/images/home/confronting-dragon.png",
                href: "https://www.amazon.com/gp/product/1634500466",
              },
            ].map((book) => (
              <div key={book.title} className="text-center">
                <a
                  href={book.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Buy ${book.title} paperback on Amazon`}
                  className="group block"
                >
                  <Image
                    src={book.cover}
                    alt={`${book.title} paperback cover`}
                    width={396}
                    height={540}
                    className="mx-auto h-auto w-full max-w-[260px] drop-shadow-xl transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-[1.02]"
                  />
                </a>
                <p className="mt-4 text-xs uppercase tracking-wider text-white/65 font-semibold">
                  {book.number}
                </p>
                <p className="mt-1 font-display text-lg text-white">
                  {book.title}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center text-lg text-white/80 max-w-2xl mx-auto">
            Perfect for kids who love Minecraft, adventure, teamwork, and
            fast-paced action.
          </p>

          <div className="mt-8 text-center">
            <Link
              href="/books"
              className="inline-flex items-center rounded-full bg-[var(--color-accent)] text-white px-6 py-3 font-semibold hover:bg-[var(--color-accent-soft)] transition-colors"
            >
              See all my novels
            </Link>
          </div>
        </Container>
      </section>

      {/* Mini bio */}
      <section className="py-20">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <Image
              src="/images/home/mark-cheverton.png"
              alt="Mark Cheverton"
              width={338}
              height={325}
              className="mx-auto h-28 w-28 rounded-full object-cover object-top shadow-lg"
            />
            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)] italic">
              New York Times Best Selling Author
            </p>
            <h2 className="mt-3 font-display text-5xl font-semibold text-[var(--color-primary)]">
              Mark Cheverton
            </h2>
            <p className="mt-8 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              When Mark self-published his first Minecraft-inspired novel,{" "}
              <em>Invasion of the Overworld</em>, in 2013, he didn&apos;t
              really expect the book to be significant. But when it reached{" "}
              <strong>#29 on Amazon&apos;s Top 100</strong> and the publishers
              started calling, Mark knew he&apos;d struck a nerve with kids.
              After 10 years, Mark has written <strong>27 novels</strong> that
              have appeared in the New York Times, USA Today, and
              Publisher&apos;s Weekly bestsellers lists. They&apos;ve been
              published in <strong>31 countries</strong>, translated into{" "}
              <strong>27 languages</strong>, and over{" "}
              <strong>2 million copies</strong> have been sold worldwide.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-primary)]"
            >
              More about Mark →
            </Link>
          </div>
        </Container>
      </section>

      {/* Other books */}
      <section
        className="relative overflow-hidden bg-[var(--color-primary)] bg-cover bg-center bg-scroll py-20 text-white md:bg-fixed"
        style={{ backgroundImage: "url('/images/home/dark-bookshelf.jpg')" }}
      >
        <div className="absolute inset-0 bg-[var(--color-primary)]/42" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-white/18" />
        <Container className="relative z-10">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-center">
            Other Books
          </h2>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Trouble in Zombie-town",
                cover: "/images/home/trouble-zombie-town.jpg",
                blurb:
                  "Gameknight's sister is trapped inside Minecraft and transformed into a zombie. To save her, Gameknight must enter Zombie-town and survive a game that's no longer just a game.",
              },
              {
                title: "Saving Crafter",
                cover: "/images/home/saving-crafter.jpg",
                blurb:
                  "Herobrine's revenge isn't aimed at Gameknight. It's aimed at his friends. As the fabric of Minecraft itself turns deadly, Gameknight must save Crafter before the world they know comes apart forever.",
              },
              {
                title: "The Phantom Virus",
                cover: "/images/home/phantom-virus.jpg",
                blurb:
                  "After defeating Herobrine, Gameknight thought the war was over — until deadly devices, built by Herobrine, started destroying villages and NPCs. Gameknight must dismantle the traps before chaos consumes the world.",
              },
              {
                title: "Facing the Beast Within",
                cover: "/images/home/facing-beast-within.jpg",
                blurb:
                  "Cameron Poole struggles with anxiety, and it follows him everywhere — even to summer camp. When the demon Malphas tries to open a gateway between worlds, Cameron and his friends must stop him before disaster befalls them all.",
              },
            ].map((entry) => {
              const book = findBook(entry.title);
              return (
                <article
                  key={entry.title}
                  className="rounded-2xl bg-white/8 border border-white/15 p-5 flex flex-col shadow-xl backdrop-blur-[2px]"
                >
                  <Image
                    src={entry.cover}
                    alt={`${entry.title} book cover`}
                    width={360}
                    height={540}
                    className="mb-4 aspect-[2/3] w-full rounded-lg object-cover shadow-lg"
                  />
                  <h3 className="font-display text-xl font-semibold leading-tight">
                    {entry.title}
                  </h3>
                  <p className="mt-3 text-sm text-white/70 leading-relaxed flex-1">
                    {entry.blurb}
                  </p>
                  {book?.amazon ? (
                    <a
                      href={book.amazon}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex justify-center rounded-full border border-white/40 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
                    >
                      Read more on Amazon
                    </a>
                  ) : (
                    <Link
                      href="/books"
                      className="mt-5 inline-flex justify-center rounded-full border border-white/40 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
                    >
                      Read more
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Free books reinforcement */}
      <section className="py-20">
        <Container>
          <div className="grid gap-10 md:grid-cols-5 md:items-center">
            <div className="md:col-span-2">
              <Image
                src="/images/home/free-book-covers.png"
                alt="Elytra Perils and The Virus free Minecraft eBook covers"
                width={614}
                height={441}
                className="mx-auto w-full max-w-md drop-shadow-2xl"
              />
            </div>
            <div className="md:col-span-3">
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--color-primary)]">
                Afraid to take a risk on a new author?
              </h2>
              <p className="mt-3 text-lg text-[var(--color-ink-soft)]">
                I get it — trying a new author is always a little scary.
              </p>
              <p className="mt-6 text-[var(--color-ink-soft)] leading-relaxed">
                You can download <strong>two</strong> Minecraft-inspired books for{" "}
                <strong>FREE</strong>. All you have to do is sign up for my
                newsletter — you can unsubscribe at any time. I use this
                newsletter to notify fans about upcoming novels. You&apos;ll get
                sneak peeks at new graphics, excerpts, and the chance to
                participate in contests to name characters in whatever novel
                I&apos;m currently writing. No spam. Your email is kept secure and
                never shared.
              </p>
              <div className="mt-8">
                <Link
                  href="/free-books"
                  className="inline-flex items-center rounded-full bg-[var(--color-accent)] text-white px-7 py-4 text-lg font-semibold hover:bg-[var(--color-accent-soft)] transition-colors"
                >
                  I want some books!
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Writing tools teaser */}
      <section className="py-20 bg-[var(--color-surface)] border-y border-[var(--color-rule)]">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
              For Young Writers
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-[var(--color-primary)]">
              Free tools to help you write your own story
            </h2>
            <p className="mt-4 text-lg text-[var(--color-ink-soft)]">
              Built from my own writing process and years in the classroom.
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
                className="rounded-xl border border-[var(--color-rule)] bg-white p-6 hover:border-[var(--color-accent)] transition-colors"
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

      {/* Contact / Meet Mark */}
      <section
        className="relative overflow-hidden bg-[#173d2e] bg-cover bg-center bg-scroll py-20 text-white md:bg-fixed md:py-28"
        style={{ backgroundImage: "url('/images/home/contact-cavern-dog.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <Container className="relative z-10">
          <div className="max-w-md rounded-2xl bg-black/35 p-8 shadow-2xl backdrop-blur-[2px]">
            <Image
              src="/images/home/mark-cheverton.png"
              alt="Mark Cheverton"
              width={338}
              height={325}
              className="mb-6 h-32 w-32 rounded-full object-cover object-top shadow-xl"
            />
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent-soft)]">
              Meet Mark
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              Want to say hi?
            </h2>
            <p className="mt-4 text-white/85 leading-relaxed">
              I read and personally respond to every email — questions, story
              ideas, fan art, school assignments. Send it all.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center rounded-full bg-[var(--color-accent)] text-white px-7 py-3 font-semibold hover:bg-[var(--color-accent-soft)] transition-colors"
            >
              Contact Me
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
