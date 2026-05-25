import Link from "next/link";
import { Container } from "@/components/Container";

export const metadata = { title: "Author Visits" };

const benefits = [
  {
    title: "Resilience Through Failure",
    body: "Students learn that struggle and rejection are not signs of weakness — they're part of every meaningful creative journey.",
  },
  {
    title: "Confidence to Try",
    body: "By seeing real setbacks and honest mistakes, students feel permission to try — even when success isn't guaranteed.",
  },
  {
    title: "A New View of Creativity",
    body: "Writing and creativity stop feeling mysterious or intimidating and start feeling accessible and human when you're not afraid to fail.",
  },
  {
    title: "Hope That Sticks",
    body: "Students leave energized, encouraged, and believing that effort can change outcomes — in writing and beyond.",
  },
];

const testimonials = [
  {
    quote:
      "Our school loved hosting Mark Cheverton for an author visit. His presentation was engaging and laugh-out-loud funny for all students in grades 3-5. We loved that he focused on having a growth mindset and being persistent in his presentation. Staff thought this was one of our best author visits ever! I highly recommend having him visit your school.",
    source: "Rosendale Elementary School Librarian — Schenectady, NY",
  },
  {
    quote:
      "Students loved Mark's author visit in our library! Every eye was on him as he described the hurdles and triumphs of the writing process and his voyage to becoming a bestselling author. He kept students engaged throughout his presentation, asking them questions and making them laugh. Students left the library inspired not only to read and write, but to generally persevere! I highly recommend having Mark speak to your students, too!",
    source: "Maple Ave Middle School Librarian — Saratoga Springs, NY",
  },
  {
    quote:
      "As a librarian of over 20 years, Mark Cheverton was one of the best author visits we've ever had. My 3rd, 4th, and 5th graders were engaged, focused, and captivated by his presentation. I had multiple teachers comment on how wonderful his presentation was and how much they enjoyed it! I would highly recommend having Mark for an author visit!",
    source: "Elementary School Librarian — New York",
  },
];

export default function AuthorVisitsPage() {
  return (
    <section className="bg-white">
      <section
        className="relative overflow-hidden bg-slate-900 bg-cover bg-center bg-no-repeat py-24 text-white md:bg-fixed md:py-32"
        style={{
          backgroundImage:
            "url('/images/author-visits/minecraft-background.webp')",
        }}
      >
        <div className="absolute inset-0 bg-[rgba(17,29,51,0.68)]" />
        <Container className="relative">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-display text-4xl font-semibold leading-tight md:text-6xl">
              An Author Visit That Teaches Kids How to Fail — and Keep Going
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/90 md:text-[1.2rem]">
              A high-energy, story-driven Growth Mindset talk that shows
              students how creativity, confidence, and resilience are built
              through real struggle and perseverance.
            </p>
            <Link
              href="/contact"
              className="mt-10 inline-flex rounded-full bg-[var(--color-accent)] px-7 py-3 text-sm font-semibold text-white transition hover:brightness-95"
            >
              Request Availability & Pricing
            </Link>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-white/90">
              <strong>Presented by Mark Cheverton</strong> — internationally
              published <em>New York Times</em> bestselling author and former
              classroom teacher.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-5xl">
            <header className="text-center">
              <h2 className="font-display text-4xl font-semibold text-[var(--color-primary)]">
                What Students Gain From This Visit
              </h2>
              <p className="mt-3 text-lg text-[var(--color-ink-soft)]">
                More than motivation — a message students carry with them.
              </p>
            </header>

            <div className="mt-12 grid gap-x-14 gap-y-10 md:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit.title}>
                  <h3 className="text-center font-display text-2xl font-semibold text-[var(--color-primary)]">
                    {benefit.title}
                  </h3>
                  <p className="mt-4 text-left text-[1.03rem] leading-8 text-[var(--color-ink-soft)]">
                    {benefit.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-8 md:py-12">
        <Container>
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-3xl font-semibold text-[var(--color-primary)] md:text-4xl">
              What Teachers & Librarians Are Saying About Mark&apos;s Author
              Visits...
            </h2>

            <div className="mt-8 space-y-8">
              {testimonials.map((testimonial) => (
                <blockquote
                  key={testimonial.source}
                  className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-8 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                >
                  <p className="text-[1.03rem] leading-8 text-[var(--color-ink-soft)]">
                    {testimonial.quote}
                  </p>
                  <footer className="mt-4 text-right text-sm font-medium text-[var(--color-primary)]">
                    {testimonial.source}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat py-20 md:bg-fixed md:py-24"
        style={{
          backgroundImage: "url('/images/author-visits/author-visit.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[rgba(255,255,255,0.34)]" />
        <Container className="relative">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-start gap-8 lg:grid-cols-[1.08fr_1.12fr]">
              <div className="bg-white/92 p-10 shadow-[0_18px_44px_rgba(15,23,42,0.18)] md:p-12">
                <h2 className="font-display text-4xl font-semibold leading-tight text-[var(--color-primary)] md:text-6xl">
                  Why I Share This Story
                </h2>
                <div className="mt-8 space-y-6 text-[1.05rem] leading-8 text-[var(--color-ink-soft)] md:text-[1.12rem]">
                  <p>
                    For a long time, I didn&apos;t think I was very good at
                    writing.
                  </p>
                  <p>
                    My first four novels failed completely. They were rejected
                    again and again, and for a while, I was ready to quit.
                    I didn&apos;t know how to write a novel yet — but after each
                    failure, I tried to learn more and keep going.
                  </p>
                </div>
              </div>

              <div className="lg:pt-[26rem]" />
            </div>

            <div className="mt-8 lg:mt-[-4rem] lg:flex lg:justify-end">
              <div className="max-w-5xl bg-[linear-gradient(135deg,#7058ff,#8f62ff)] p-8 text-white shadow-[0_18px_44px_rgba(73,58,155,0.24)] md:p-10 lg:w-[62%]">
                <div className="space-y-6 text-[1.05rem] leading-8 md:text-[1.12rem]">
                  <p>
                    Everything changed when my son was bullied while playing
                    Minecraft. Instead of giving advice, I wrote a story just
                    for him. We read it together at bedtime, and as we talked
                    about it, he began to see that hurtful behavior often comes
                    from people dealing with their own struggles. That moment
                    reminded me why stories matter.
                  </p>
                  <p>
                    I share this story with students because I know what it
                    feels like to doubt yourself. I want kids to see that
                    failure doesn&apos;t mean you should stop trying — it just
                    means you haven&apos;t found the right path yet. And
                    learning, even when it&apos;s hard, is where growth begins.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat py-20 text-white md:bg-fixed md:py-24"
        style={{
          backgroundImage: "url('/images/author-visits/kids-reading.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[rgba(19,33,50,0.66)]" />
        <Container className="relative">
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-2xl bg-white/88 p-10 text-left shadow-[0_20px_48px_rgba(15,23,42,0.2)] md:p-14">
              <h2 className="font-display text-4xl font-semibold leading-tight text-black md:text-5xl">
                Ready to Bring This Message to Your School?
              </h2>
              <p className="mt-8 text-xl leading-9 text-black/85">
                I&apos;d love to help your students see failure, creativity, and
                confidence in a new way.
              </p>
              <Link
                href="/contact"
                className="mt-10 inline-flex rounded-none bg-[linear-gradient(135deg,#6f57ff,#955fff)] px-7 py-4 text-base font-semibold text-white shadow-[0_12px_28px_rgba(111,87,255,0.3)] transition hover:brightness-95"
              >
                Request Availability & Pricing
              </Link>
              <p className="mt-10 text-2xl leading-10 text-black">
                In-Person and virtual visits available.
                <br />
                Responds within 1-2 days.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </section>
  );
}
