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
      className="border-y border-[var(--color-rule)] bg-[#f4efe7] py-16 md:py-20"
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

        <div className="mt-10 grid gap-4 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.attribution}
              className="flex h-full flex-col justify-between rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 shadow-sm"
            >
              <blockquote className="font-display text-xl leading-relaxed text-[var(--color-primary)]">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-sm font-medium text-[var(--color-ink-soft)]">
                &mdash; {testimonial.attribution}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
