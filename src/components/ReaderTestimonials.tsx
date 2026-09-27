import { Container } from "@/components/Container";

const testimonials = [
  {
    quote: "It felt like I had a book full of friends.",
    attribution: "Ben, longtime reader",
  },
  {
    quote: "I looked back to see where it all started. It was you.",
    attribution: "Kaylee, reader and writer",
  },
  {
    quote: "Your books were a central part of my childhood.",
    attribution: "Forrest, longtime reader",
  },
  {
    quote:
      "Your Gameknight999 series has been a consistent source of happiness and comfort for more than half my life.",
    attribution: "Clare, longtime reader",
  },
  {
    quote:
      "Most children's story writers veer away from darker subjects, but I love how you didn't hesitate to discuss and dissect them.",
    attribution: "Starria, longtime reader",
  },
  {
    quote:
      "You created a story that shows kids the danger and error behind the action without treating them like they can't understand the lesson.",
    attribution: "Matthew, longtime reader",
  },
];

export function ReaderTestimonials() {
  return (
    <section
      aria-labelledby="reader-testimonials-heading"
      className="border-y border-[#bdc8b4] bg-[#d8dfd0] py-14 md:py-16"
      style={{
        backgroundImage:
          "linear-gradient(rgba(99, 118, 84, 0.12) 0 0), linear-gradient(rgba(99, 118, 84, 0.09) 0 0), linear-gradient(rgba(245, 248, 240, 0.34) 0 0), linear-gradient(rgba(125, 142, 108, 0.13) 0 0), linear-gradient(rgba(245, 248, 240, 0.27) 0 0), linear-gradient(rgba(99, 118, 84, 0.1) 0 0), linear-gradient(rgba(125, 142, 108, 0.12) 0 0), linear-gradient(rgba(245, 248, 240, 0.3) 0 0), linear-gradient(rgba(99, 118, 84, 0.11) 0 0), linear-gradient(rgba(245, 248, 240, 0.25) 0 0), linear-gradient(rgba(125, 142, 108, 0.12) 0 0), linear-gradient(rgba(99, 118, 84, 0.08) 0 0)",
        backgroundPosition:
          "4% 12%, 10% 26%, 21% 8%, 27% 18%, 39% 4%, 45% 28%, 57% 14%, 64% 30%, 73% 6%, 80% 21%, 88% 11%, 94% 34%",
        backgroundSize:
          "72px 48px, 38px 70px, 56px 42px, 80px 54px, 44px 76px, 62px 36px, 74px 58px, 40px 64px, 58px 46px, 76px 40px, 48px 72px, 68px 52px",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="reader-testimonials-heading"
            className="font-display text-3xl font-semibold text-[var(--color-primary)] md:text-4xl"
          >
            What Readers Remember
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.attribution}
              className="flex h-full flex-col justify-between rounded-xl border border-white/80 bg-[var(--color-surface)] p-6 shadow-[0_10px_24px_rgba(30,58,95,0.16)]"
            >
              <blockquote className="font-display text-xl leading-relaxed text-[var(--color-primary)]">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-sm font-medium text-[var(--color-ink-soft)]">
                &mdash; {testimonial.attribution}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
