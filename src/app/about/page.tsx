import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";

export const metadata = { title: "About Mark" };

const fantasyBooks = [
  {
    title: "Lord of the Rings",
    href: "https://www.amazon.com/Lord-Rings-50th-Anniversary-Vol/dp/0618640150/",
    author: "J.R.R. Tolkien",
    age: "13+",
    note: "Who doesn't love LotR, a classic to which all fantasy books are compared.",
  },
  {
    title: "The Hobbit",
    href: "https://www.amazon.com/Hobbit-J-R-Tolkien/dp/054792822X/",
    author: "J.R.R. Tolkien",
    age: "9+",
    note: "Where LotR started. A fantastic book!",
  },
  {
    title: "The Wheel of Time series",
    href: "https://www.amazon.com/gp/bookseries/B00CKDKV90/",
    author: "Robert Jordan",
    age: "11+",
    note: "This is probably one of my favorite series. Totally worth it.",
  },
  {
    title: "Queen Bee",
    href: "https://www.amazon.com/Queen-Bee-Elizabeth-Weigandt/dp/1460294505/",
    author: "Elizabeth Weigandt",
    age: "7-13",
    note: "From a new author and a friend, you'll love seeing what it's like to be a bee.",
  },
  {
    title: "Sword of Shannara Trilogy",
    href: "https://www.amazon.com/Sword-Shannara-Omnibus/dp/1841492876/",
    author: "Terry Brooks",
    age: "12+",
    note: "One of the first fantasy books I ever read, with rich action and adventure.",
  },
  {
    title: "Watership Down",
    href: "https://www.amazon.com/Watership-Down-Novel-Richard-Adams/dp/B001L9OKZK/",
    author: "Richard Adams",
    age: "11+",
    note: "You'll love Hazel after reading this. I love this book!",
  },
  {
    title: "Sassafrass and the Queen",
    href: "https://www.amazon.com/Sassafras-Queen-Kepler-Books-Book-ebook/dp/B07KWKNGMW/",
    author: "Sandra L. Vasher",
    age: "7-13",
    note: "A world of magic, murder, and intrigue from a new author.",
  },
  {
    title: "The Belgariad",
    href: "https://www.amazon.com/Belgariad-Vol-Books-1-3-Magicians/dp/0345456327/",
    author: "David Eddings",
    age: "12+",
  },
  {
    title: "The Dragon Riders of Pern",
    href: "https://www.amazon.com/Dragonriders-Pern-Dragonflight-Dragonquest-Dragon/dp/0345340248/",
    author: "Anne McCaffrey",
    age: "13+",
  },
];

const scienceFictionBooks = [
  {
    title: "Dune series",
    href: "https://www.amazon.com/Dune-Chronicles-Book-1/dp/0441013597/",
    author: "Frank Herbert",
    age: "14+",
  },
  {
    title: "Ender's Game series",
    href: "https://www.amazon.com/Enders-Ender-Quintet-Orson-Scott/dp/0812550706/",
    author: "Orson Scott Card",
    age: "12+",
  },
  {
    title: "Fahrenheit 451",
    href: "https://www.amazon.com/Fahrenheit-451-Ray-Bradbury/dp/030747531X/",
    author: "Ray Bradbury",
    age: "13+",
  },
  {
    title: "The Martian Chronicles",
    href: "https://www.amazon.com/Martian-Chronicles-Ray-Bradbury/dp/1451678193/",
    author: "Ray Bradbury",
    age: "12+",
  },
  {
    title: "Rendezvous with Rama series",
    href: "https://www.amazon.com/Rendezvous-Rama-Arthur-C-Clarke/dp/0553287893/",
    author: "Arthur C. Clarke",
    age: "12+",
  },
  {
    title: "The Moon Is a Harsh Mistress",
    href: "https://www.amazon.com/Moon-Harsh-Mistress-Robert-Heinlein/dp/0312863551/",
    author: "Robert Heinlein",
    age: "13+",
  },
  {
    title: "All H.G. Wells Novels!!!",
    href: "https://www.amazon.com/Science-Fiction-Novels-Thrift-Editions/dp/048643978X/",
    author: "H.G. Wells",
    age: "12+",
  },
];

function BookList({
  title,
  books,
}: {
  title: string;
  books: {
    title: string;
    href: string;
    author: string;
    age: string;
    note?: string;
  }[];
}) {
  return (
    <section className="mt-10">
      <h3 className="font-display text-3xl font-semibold italic text-[var(--color-primary)]">
        {title}
      </h3>
      <div className="mt-5 space-y-4 text-[1.03rem] leading-8 text-[var(--color-ink-soft)]">
        {books.map((book) => (
          <p key={book.title} className="pl-6 md:pl-10">
            <Link
              href={book.href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[var(--color-primary)] underline decoration-1 underline-offset-4"
            >
              <em>{book.title}</em>
            </Link>{" "}
            by {book.author} (age {book.age})
            {book.note ? ` - ${book.note}` : ""}
          </p>
        ))}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <section className="bg-white py-16 md:py-20">
      <Container>
        <div className="mx-auto max-w-5xl">
          <header className="text-center">
            <h1 className="font-display text-4xl font-semibold text-[var(--color-primary)] md:text-5xl">
              About me
            </h1>
            <h2 className="mt-8 text-2xl font-bold text-black md:text-3xl">
              Why I started writing Minecraft Novels
            </h2>
          </header>

          <div className="mt-10 space-y-6 text-[1.05rem] leading-8 text-black/85 md:text-[1.12rem]">
            <div className="md:float-right md:ml-8 md:mb-4 md:w-[210px]">
              <Image
                src="/images/about/book-1-3d-small.png"
                alt="Invasion of the Overworld 3D cover"
                width={396}
                height={542}
                className="h-auto w-full"
              />
            </div>
            <p>
              I&apos;ve come to love playing{" "}
              <Link href="/" className="font-semibold text-[var(--color-primary)]">
                Minecraft
              </Link>{" "}
              with my son. I didn&apos;t get here easily though; in fact, my son
              had to drag me there kicking and screaming. But now... I love it.
              He saw a video about Minecraft on YouTube and, of course, said he
              had to have it. I looked at the video and said, &quot;you don&apos;t
              want that game.&quot; Well, he did want it and was persistent in
              reminding my wife and I that Minecraft was great.
            </p>
            <p>
              So finally, we caved. We bought Minecraft, and soon we had a
              server running for my son and his friends. Well, one sad day, a
              couple of kids came onto the server and destroyed everything. They
              made a video of their destruction and said terrible, disgusting
              things about my son. When they finished flattening the world with
              TNT and lava, they sent my son a video link to YouTube. Wasn&apos;t
              that thoughtful.
            </p>
            <p>
              My son rebuilt everything... and they came back again and again
              and again. They changed their user names and used a VPN to get
              onto the server and continue with their reign of destruction. We
              finally just shut down the server.
            </p>
            <div className="md:float-right md:ml-8 md:mb-4 md:w-[420px]">
              <Image
                src="/images/about/gameknight-around-the-world.jpg"
                alt="Map showing where Gameknight999 books are published"
                width={605}
                height={301}
                className="h-auto w-full rounded-sm"
              />
            </div>
            <p>
              This was the ultimate teachable moment, a chance to talk about
              cyber-bullying. I tried to answer my son&apos;s questions about why
              someone would do this, and what kind of person would take pride in
              destroying someone else&apos;s creation, but my answers just fell
              flat. That was when I came up with the idea of teaching my son
              through his favorite thing: Minecraft. I wrote the first book,
              <em> Invasion of the Overworld</em>, and it taught kids about
              cyber-bullying and how it affects others, while hammering away at
              the importance of friendship, using Minecraft as the tapestry on
              which the lesson was written. I&apos;ve had great responses to
              this, hearing from kids that loved the book and parents that loved
              the message. It&apos;s been very rewarding.
            </p>
            <p>
              My success with <em>Invasion of the Overworld</em> led to the
              publishing of 24 novels with Skyhorse Publishing. They can now be
              found in 32 countries, published in 22 languages, with over 2
              million copies in print. The map to the right shows where my
              Minecraft novels can be found around the world.
            </p>
          </div>

          <hr className="my-12 border-[var(--color-rule)]" />

          <div className="space-y-6 text-[1.05rem] leading-8 text-black/85 md:text-[1.12rem]">
            <div className="md:float-left md:mr-8 md:mb-4 md:w-[220px]">
              <Image
                src="/images/about/facing-the-beast-within-award.png"
                alt="Facing the Beast Within 3D cover"
                width={696}
                height={1024}
                className="h-auto w-full"
              />
            </div>
            <p>
              I have a newer book called <em>FACING THE BEAST WITHIN</em>. This
              book has nothing to do with Minecraft, but it has all the action
              and suspense you&apos;ve come to expect in my novels.
            </p>
            <p>
              What would you do if demons, gargoyles, gremlins, and all the
              mythical creatures you&apos;ve heard about in fairy tales suddenly
              invaded your town? Cameron Poole, a bully magnet and the smallest
              sixth grader at Campchartrain, must answer that question. He is
              the only person who can stop Malphas, the Demon Lord of Agartha,
              from bringing his monster army to Earth and destroying
              everything.
            </p>
            <p>
              You&apos;ll see magic, monsters, and an epic battle in{" "}
              <em>FACING THE BEAST WITHIN</em>. Buckle up and get ready for a
              thrilling ride.
            </p>
          </div>

          <div className="clear-both" />

          <hr className="my-12 border-[var(--color-rule)]" />

          <section>
            <h2 className="text-center font-display text-4xl font-semibold text-[var(--color-primary)]">
              My Background
            </h2>
            <div className="mt-8 space-y-6 text-[1.05rem] leading-8 text-black/85 md:text-[1.12rem]">
              <p>
                I was born and grew up in Southern California, about 15 minutes
                from Disneyland. I attended California State University at
                Fullerton after high school, earning a Bachelor&apos;s degree in
                Physics. After college, I started teaching Physics and Math at
                Cerritos High School in Southern California. While teaching, I
                attended California State University at Long Beach, where I
                earned a Master&apos;s degree in Physics.
              </p>
              <p>
                After teaching for 10 years in Southern California, I moved to
                the East Coast and taught for another 5 years in New York.
                Eventually I left teaching and went into industry. I worked as a
                Research Physicist for General Electric for almost 15 years,
                conducting research in Machine Vision, Laser Welding, System
                Automation and Control, Advanced Sensors, and Holography. In
                fact, you can see a hologram I made of myself below.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-sm border border-black/10 bg-black shadow-[0_14px_36px_rgba(15,23,42,0.18)]">
              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/vtf_-i9CXEo"
                  title="Mark Cheverton hologram"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>

            <p className="mt-8 text-[1.05rem] leading-8 text-black/85 md:text-[1.12rem]">
              There&apos;s also another hologram of me on YouTube, though I think
              I was a little sick that day because I look funny for some
              reason.
            </p>

            <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-sm border border-black/10 bg-black shadow-[0_14px_36px_rgba(15,23,42,0.18)]">
              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/GmvGX0jeAxM"
                  title="Another Mark Cheverton hologram"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="mt-8 space-y-6 text-[1.05rem] leading-8 text-black/85 md:text-[1.12rem]">
              <p>
                These holograms were recorded into a solid piece of plastic.
                What you&apos;re seeing is the image as I&apos;m turning the plastic
                back and forth.
              </p>
              <p>
                Now I write full-time. I probably write 8-10 hours a day during
                the week and more on weekends.
              </p>
              <p>
                I also help education companies tell better stories through my
                copywriting business. Learn more at{" "}
                <Link
                  href="https://chevertoncopywriting.com"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[var(--color-primary)] underline decoration-1 underline-offset-4"
                >
                  ChevertonCopywriting.com
                </Link>
                .
              </p>
            </div>
          </section>

          <hr className="my-12 border-[var(--color-rule)]" />

          <section>
            <h2 className="text-center font-display text-4xl font-semibold text-[var(--color-primary)]">
              Favorite Books
            </h2>
            <div className="mt-8 space-y-5 text-[1.05rem] leading-8 text-black/85 md:text-[1.12rem]">
              <p>
                Here&apos;s a list of some of my{" "}
                <Link href="/books" className="font-semibold text-[var(--color-primary)]">
                  favorite books
                </Link>{" "}
                I&apos;ve read over the years. I can remember reading many of
                them under the covers late at night with a flashlight after
                bedtime when I was your age.
              </p>
              <p>
                Read the descriptions online and be sure to look at the age
                range to make sure it is appropriate for you. I hope some of
                you try them on for size. Nothing beats a great book that makes
                you want to read it again and again.
              </p>
              <p className="font-semibold">
                &quot;Reading a good book is like hanging out with an old
                friend. You&apos;re sad to see them leave on the last page, but
                you can&apos;t wait for the next friend to stop by for a
                visit.&quot; <em>- Monkeypants_271</em>
              </p>
              <p className="font-semibold">
                Here are some of my old friends, and a few new ones...
              </p>
            </div>

            <hr className="my-8 border-[var(--color-rule)]" />

            <BookList title="Fantasy" books={fantasyBooks} />
            <BookList title="Science Fiction" books={scienceFictionBooks} />
          </section>

          <hr className="my-12 border-[var(--color-rule)]" />

          <section className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-8 text-center shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
            <p className="text-xl font-semibold uppercase tracking-wide text-[var(--color-primary)]">
              Send me an email and let me know what your favorite book is or
              what you&apos;re reading!
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-95"
              >
                Contact Mark
              </Link>
              <Link
                href="/books"
                className="rounded-full border border-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white"
              >
                Browse Books
              </Link>
            </div>
          </section>
        </div>
      </Container>
    </section>
  );
}
