import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { getAllPosts } from "@/lib/content";

export const metadata = { title: "Story Prompts" };

const PROMPT_ORDER = [
  "mythical-creature-prompts",
  "aliens-prompts",
  "lost-worlds-prompts",
  "secret-society-prompts",
  "robots-prompts",
  "survival-prompts",
  "magic-prompts",
  "time-travel-prompts",
  "space-prompts",
  "superheroes-prompts",
  "adventure-prompts",
  "friendship-prompts",
  "future-dystopia-prompts",
  "dream-prompts",
  "wilderness-prompts",
  "pirate-prompts",
  "sports-prompts",
  "ghost-prompts",
];

export default async function StoryPromptsPage() {
  const posts = await getAllPosts("prompts");
  const order = new Map(PROMPT_ORDER.map((slug, index) => [slug, index]));
  const sortedPosts = [...posts].sort((a, b) => {
    const aIndex = order.get(a.slug);
    const bIndex = order.get(b.slug);
    if (aIndex != null && bIndex != null) return aIndex - bIndex;
    if (aIndex != null) return -1;
    if (bIndex != null) return 1;
    return a.title.localeCompare(b.title);
  });

  return (
    <section className="bg-[#fbf6df] py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-sm border border-black/10">
            <Image
              src="/images/prompts/header.webp"
              alt="Writing Prompts header artwork"
              width={1024}
              height={615}
              className="h-auto w-full"
              priority
            />
          </div>

          <div className="mt-8 space-y-6 text-lg leading-9 text-slate-900 sm:text-[1.7rem] sm:leading-[1.45]">
            <p>
              Every story starts with an idea. Sometimes you just need a nudge.
            </p>
            <p>
              Each box below contains a small set of writing prompts built
              around a theme. You don&apos;t have to use them exactly as written.
              Change them. Combine them. Let one spark something of your own. If
              a prompt makes you curious, that&apos;s enough to start.
            </p>
            <p>
              Watch the video below to see how I use story prompts when I&apos;m
              working on a new story.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-sm border border-black/10 bg-black shadow-[0_12px_36px_rgba(15,23,42,0.18)]">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/SxuABlD4fm4"
                title="Story Prompts"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {sortedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/writing-resources/prompts/${post.slug}`}
                className="block rounded-2xl bg-white p-10 shadow-[0_18px_42px_rgba(15,23,42,0.16)] transition-transform hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,23,42,0.2)]"
              >
                <h2 className="text-[2rem] font-semibold leading-tight text-slate-800">
                  {post.title}
                </h2>
                <p className="mt-6 text-xl text-sky-500">read more</p>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
