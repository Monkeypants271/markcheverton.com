import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { getAllPosts } from "@/lib/content";

export const metadata = { title: "Sensory Details" };

export default async function SensoryDetailsPage() {
  const posts = await getAllPosts("sensory-details");
  const featureImages = [
    {
      src: "/images/sensory-details/emotions/terror.png",
      alt: "Terror emotion illustration",
    },
    {
      src: "/images/sensory-details/emotions/shock.png",
      alt: "Shock emotion illustration",
    },
    {
      src: "/images/sensory-details/emotions/surprise.png",
      alt: "Surprised emotion illustration",
    },
    {
      src: "/images/sensory-details/emotions/grief.png",
      alt: "Grief emotion illustration",
    },
    {
      src: "/images/sensory-details/emotions/sadness.png",
      alt: "Sadness emotion illustration",
    },
    {
      src: "/images/sensory-details/emotions/anger.png",
      alt: "Anger emotion illustration",
    },
    {
      src: "/images/sensory-details/emotions/nervousness.png",
      alt: "Nervousness emotion illustration",
    },
    {
      src: "/images/sensory-details/emotions/peacefulness.png",
      alt: "Peacefulness emotion illustration",
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-sm">
            <Image
              src="/images/sensory-details/header.jpg"
              alt="Sensory Details pirate ship header"
              width={864}
              height={494}
              className="h-auto w-full"
              priority
            />
          </div>

          <div className="mt-8 max-w-5xl space-y-6 text-left text-[1.05rem] leading-8 text-slate-800 md:text-[1.15rem]">
            <p>
              Strong stories don&apos;t just tell readers what&apos;s happening - they
              help them experience it.
            </p>
            <p>
              Sensory details are one of the simplest ways to do that. The
              right sound, texture, or small physical reaction can reveal
              emotion, mood, and tension without spelling it out for the
              reader.
            </p>
            <p>
              On this page, you&apos;ll find a collection of sensory responses you
              can use to show what a character is feeling through their body and
              surroundings. In the video below, I walk through how I use these
              details in my own writing to replace telling with moments readers
              can feel.
            </p>
            <p>
              You don&apos;t need to use all of them. Think of these as tools you
              can draw from when a scene feels flat or overly explained.
            </p>
            <p>
              The video below can help you understand how to use these sensory
              details in your story.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-sm border border-black/10 bg-black shadow-[0_12px_36px_rgba(15,23,42,0.18)]">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/s0snzJmLfY4"
                title="Sensory Details"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          <p className="mt-6 max-w-5xl text-[1.05rem] leading-8 text-slate-800 md:text-[1.15rem]">
            If you want to download the sheet of different emotion examples, as
            shown in the video, click{" "}
            <Link
              href="https://www.dropbox.com/scl/fi/mw8dpy7m7pjs716kpgfc0/Show-Dont-Tell-with-Emotions.docx?rlkey=1eu4bf45vxc0w69mkyfy177fg&st=zw53gflh&dl=0"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[var(--color-accent)] underline decoration-2 underline-offset-4"
            >
              HERE
            </Link>
            . It will take you to a dropbox folder for download.
          </p>

          <div className="mt-14 grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div className="grid gap-6 sm:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/writing-resources/sensory-details/${post.slug}`}
                  className="block rounded-xl border-2 border-sky-600 bg-white p-6 shadow-[0_14px_34px_rgba(15,23,42,0.12)] transition-transform hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)]"
                >
                  <h2 className="text-2xl font-semibold uppercase tracking-[0.02em] text-sky-700 underline underline-offset-4">
                    {post.title}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-slate-700">
                    {post.excerpt}
                  </p>
                </Link>
              ))}
            </div>

            <div className="space-y-6">
              {featureImages.map((image) => (
                <div
                  key={image.src}
                  className="overflow-hidden rounded-sm bg-slate-100 shadow-[0_14px_30px_rgba(15,23,42,0.12)]"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={1024}
                    height={1024}
                    className="h-auto w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
