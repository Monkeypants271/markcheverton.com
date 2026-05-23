import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-display text-3xl font-semibold text-[var(--color-primary)] mt-10 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)] mt-8 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-display text-xl font-semibold text-[var(--color-primary)] mt-6 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-4 text-[var(--color-ink-soft)] leading-relaxed">
              {children}
            </p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-[var(--color-accent)] hover:underline"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="my-4 ml-6 list-disc space-y-1 text-[var(--color-ink-soft)]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 ml-6 list-decimal space-y-1 text-[var(--color-ink-soft)]">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-4 border-[var(--color-accent)] pl-4 italic text-[var(--color-ink-soft)]">
              {children}
            </blockquote>
          ),
          img: ({ src, alt, title }) => (
            <figure className="my-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={typeof src === "string" ? src : undefined}
                alt={alt ?? ""}
                className="rounded-lg max-w-full h-auto mx-auto"
              />
              {title && (
                <figcaption className="mt-2 text-center text-sm text-[var(--color-muted)] italic">
                  {title}
                </figcaption>
              )}
            </figure>
          ),
          code: ({ children }) => (
            <code className="rounded bg-[var(--color-surface)] px-1.5 py-0.5 text-sm border border-[var(--color-rule)] font-mono">
              {children}
            </code>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
