"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function CommentForm({
  postSlug,
  postType,
  postId,
}: {
  postSlug: string;
  postType: string;
  postId: number | null;
}) {
  const [author, setAuthor] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/comments/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          postSlug,
          postType,
          postId,
          author,
          authorEmail,
          content,
          website,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Network error — please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-8 rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 text-center">
        <p className="font-display text-xl font-semibold text-[var(--color-primary)]">
          Thanks for your comment! 👍
        </p>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
          Mark reads every comment before it&apos;s posted. If it&apos;s
          approved, it&apos;ll appear on this page soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 space-y-4"
    >
      <h3 className="font-display text-xl font-semibold text-[var(--color-primary)]">
        Leave a comment
      </h3>

      {/* Honeypot */}
      <div className="hidden" aria-hidden>
        <label>
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="comment-author" className="block text-sm font-semibold text-[var(--color-ink)]">
            Your name <span className="text-[var(--color-accent)]">*</span>
          </label>
          <input
            id="comment-author"
            type="text"
            required
            maxLength={80}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name or pen name"
            disabled={status === "submitting"}
            className="mt-1 w-full rounded-lg border border-[var(--color-rule)] bg-white px-3 py-2 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="comment-email" className="block text-sm font-semibold text-[var(--color-ink)]">
            Email <span className="text-[var(--color-muted)] font-normal">(optional)</span>
          </label>
          <input
            id="comment-email"
            type="email"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            placeholder="Only Mark sees this"
            disabled={status === "submitting"}
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-[var(--color-rule)] bg-white px-3 py-2 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 disabled:opacity-60"
          />
        </div>
      </div>

      <div>
        <label htmlFor="comment-content" className="block text-sm font-semibold text-[var(--color-ink)]">
          Your comment <span className="text-[var(--color-accent)]">*</span>
        </label>
        <textarea
          id="comment-content"
          required
          rows={5}
          maxLength={4000}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Be kind. Mark reads every comment before it's posted."
          disabled={status === "submitting"}
          className="mt-1 w-full rounded-lg border border-[var(--color-rule)] bg-white px-3 py-2 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 disabled:opacity-60 leading-relaxed"
        />
      </div>

      {errorMessage && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-[var(--color-muted)]">
          Mark reviews every comment. Mean or vulgar comments don&apos;t get posted.
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] text-white px-5 py-2 font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
        >
          {status === "submitting" ? "Sending…" : "Post comment"}
        </button>
      </div>
    </form>
  );
}
