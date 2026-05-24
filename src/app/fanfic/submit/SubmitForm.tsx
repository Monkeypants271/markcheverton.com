"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function SubmitForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/fanfic/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, title, story, website }),
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
      <div className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-8 text-center">
        <p className="font-display text-3xl font-semibold text-[var(--color-primary)]">
          Thanks for sharing! 📚
        </p>
        <p className="mt-3 text-[var(--color-ink-soft)]">
          Mark just got your story in his inbox. He reads every submission
          personally and will decide whether to post it. If he posts it, it
          may show up on the Fan Fiction page within a few days.
        </p>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          Sometimes Mark writes back. Watch for an email from him!
        </p>
      </div>
    );
  }

  const wordCount = story.trim().split(/\s+/).filter(Boolean).length;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-8 space-y-5"
    >
      {/* Honeypot — hidden from humans, only bots fill it */}
      <div className="hidden" aria-hidden>
        <label>
          Website (leave empty)
          <input
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-[var(--color-ink)]">
          Your name <span className="text-[var(--color-accent)]">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your first name or Minecraft name… NO last names"
          disabled={status === "submitting"}
          className="mt-1 w-full rounded-lg border border-[var(--color-rule)] bg-white px-4 py-3 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 disabled:opacity-60"
        />
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          For your safety, please don&apos;t use your last name. Just your first name or a fun Minecraft-style name.
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-[var(--color-ink)]">
          Email <span className="text-[var(--color-accent)]">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="So Mark can write back"
          disabled={status === "submitting"}
          autoComplete="email"
          className="mt-1 w-full rounded-lg border border-[var(--color-rule)] bg-white px-4 py-3 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 disabled:opacity-60"
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-[var(--color-ink)]">
          Story title <span className="text-[var(--color-accent)]">*</span>
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's it called?"
          disabled={status === "submitting"}
          className="mt-1 w-full rounded-lg border border-[var(--color-rule)] bg-white px-4 py-3 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 disabled:opacity-60"
        />
      </div>

      <div>
        <label htmlFor="story" className="block text-sm font-semibold text-[var(--color-ink)]">
          Your story <span className="text-[var(--color-accent)]">*</span>
        </label>
        <textarea
          id="story"
          required
          rows={18}
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Paste or type your full story here. Doesn't have to be Minecraft — any topic works."
          disabled={status === "submitting"}
          className="mt-1 w-full rounded-lg border border-[var(--color-rule)] bg-white px-4 py-3 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 disabled:opacity-60 font-sans leading-relaxed"
        />
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          {wordCount.toLocaleString()} words
        </p>
      </div>

      {errorMessage && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] text-white px-6 py-4 text-lg font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending…" : "Send my story to Mark"}
      </button>

      <p className="text-xs text-[var(--color-muted)] text-center">
        Kids: please ask a parent before sharing any information online. Mark
        will read your story and decide whether to post it — not every story
        gets posted, but every story gets read.
      </p>
    </form>
  );
}
