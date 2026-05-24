import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";

export const metadata = { title: "Writing Resources" };

const tools = [
  {
    title: "Plot Builder Tool",
    href: "/writing-resources/plot",
    body: "A tool to help writers organize their story ideas and create an outline from start to finish.",
    image: "/images/writing-resources/plot-builder.webp",
  },
  {
    title: "Writing Tips",
    href: "/writing-resources/tips",
    body: "Short, practical ideas to help writers make stronger choices in their stories.",
    image: "/images/writing-resources/writing-tips.webp",
  },
  {
    title: "Sensory Details",
    href: "/writing-resources/sensory-details",
    body: "Ways to use sight, sound, and feeling to bring scenes and emotions to life.",
    image: "/images/writing-resources/sensory-details.webp",
  },
  {
    title: "Story Prompts",
    href: "/writing-resources/prompts",
    body: "Simple starting points to help writers begin without being told what to write.",
    image: "/images/writing-resources/story-prompts.webp",
  },
];

export default function WritingResourcesPage() {
  return (
    <section className="bg-[#fbf6df] py-16 md:py-20">
      <Container>
        <div className="mx-auto max-w-6xl">
          <header className="mx-auto max-w-5xl text-center">
            <h1 className="text-4xl font-black uppercase tracking-wide text-black md:text-5xl">
              Writing Resources
            </h1>
            <div className="mx-auto mt-10 max-w-5xl space-y-6 text-left text-[1.05rem] leading-8 text-black/85 md:text-[1.15rem]">
              <p>
                Every writer starts somewhere, and these writing tools and tips are a good place to begin.
                These resources are built from the same tools I use when writing my own books, along with
                strategies many professional authors rely on to develop stories. Over the years, teachers
                have used them in classrooms, and fans of my books have used them to write their own short
                stories and even full novels.
              </p>
              <p>
                Whether you&apos;re looking for a place to start or a way to keep going, you&apos;ll find tools
                here that help you think, try ideas, and make stories your own.
              </p>
              <p>
                Watch the video below to learn a little more about these writing resources, then choose a
                resource below to get started.
              </p>
            </div>
          </header>

          <div className="mx-auto mt-10 max-w-5xl overflow-hidden border-4 border-black bg-black shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/doSTGy3h8oI"
                title="Writing Resources"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {tools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="rounded-[22px] border border-[#e8ddb2] bg-[#fff7c7] p-7 text-center shadow-[0_14px_30px_rgba(103,87,39,0.22)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(103,87,39,0.28)]"
              >
                <h2 className="font-sans text-[2rem] font-black leading-tight text-black md:text-[2.2rem]">
                  {"— "}
                  {tool.title}
                  {" —"}
                </h2>
                <div className="mt-7 overflow-hidden bg-[#f0e7b2]">
                  <Image
                    src={tool.image}
                    alt={tool.title}
                    width={1200}
                    height={900}
                    className="h-auto w-full object-cover"
                  />
                </div>
                <p className="mt-7 text-[1.05rem] leading-8 text-black/90 md:text-[1.15rem]">
                  {tool.body}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
