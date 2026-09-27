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
      className="relative isolate overflow-hidden border-y border-[#94a286] bg-[#aebca3] py-14 md:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 origin-[center_72%] scale-[1.75] bg-cover bg-[url('/images/csar-fotografie-minecraft-1006433_1920.jpg')] bg-[position:center_72%] bg-no-repeat md:origin-[center_68%] md:scale-[1.35] md:bg-[position:center_62%]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#aebca3]/70"
      />

      <Container className="relative z-10">
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
