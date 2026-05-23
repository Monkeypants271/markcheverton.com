"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const BOOKFUNNEL_URL =
  process.env.NEXT_PUBLIC_BOOKFUNNEL_URL ||
  "https://books.bookfunnel.com/2freeminecraftbooks";

type Status = "idle" | "submitting" | "success" | "error";

export function FreeBooksForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/free-books/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ firstName, email }),
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
          You&apos;re in! 🎉
        </p>
        <p className="mt-3 text-[var(--color-ink-soft)]">
          Your two free Minecraft books are waiting for you on BookFunnel.
          Click below to download them.
        </p>
        <a
          href={BOOKFUNNEL_URL}
          className="mt-6 inline-flex rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] text-white px-8 py-4 text-lg font-semibold transition-colors"
        >
          Get my books →
        </a>
        <p className="mt-4 text-xs text-[var(--color-muted)]">
          You can pick PDF, ePub, or Kindle from the BookFunnel page.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-8">
      <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
        Join the MVP Club
      </h2>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        Sign up to get <em>The Virus</em> and <em>Elytra Perils</em> for free.
        Unsubscribe anytime.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-semibold text-[var(--color-ink)]"
          >
            First name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="What should I call you?"
            disabled={status === "submitting"}
            className="mt-1 w-full rounded-lg border border-[var(--color-rule)] bg-white px-4 py-3 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-[var(--color-ink)]"
          >
            Email address <span className="text-[var(--color-accent)]">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={status === "submitting"}
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-[var(--color-rule)] bg-white px-4 py-3 focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 disabled:opacity-60"
          />
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
          {status === "submitting" ? "Signing you up…" : "I want some books!"}
        </button>

        <p className="text-xs text-[var(--color-muted)] text-center">
          Kids: please ask a parent before sharing any information online. We
          never share your email, and you can unsubscribe at any time.
        </p>
      </form>
    </div>
  );
}

export function FreeBooksCovers() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Image
        src="/images/free-books/the-virus.jpg"
        alt="The Virus — an Unofficial Minecraft Book by Mark Cheverton"
        width={400}
        height={600}
        className="rounded-xl shadow-xl w-full h-auto"
        priority
      />
      <Image
        src="/images/free-books/elytra-perils.jpg"
        alt="Elytra Perils — an Unofficial Minecraft Adventure by Mark Cheverton"
        width={401}
        height={600}
        className="rounded-xl shadow-xl w-full h-auto"
        priority
      />
    </div>
  );
}
