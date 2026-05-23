"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/books", label: "Books" },
  { href: "/for-educators", label: "For Educators" },
  { href: "/author-visits", label: "Author Visits" },
  { href: "/writing-resources", label: "Writing Resources" },
  { href: "/fanfic", label: "Fan Fiction" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-[var(--color-rule)] bg-[var(--color-surface)]/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
          onClick={() => setOpen(false)}
        >
          Mark Cheverton
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[var(--color-ink-soft)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/free-books"
            className="rounded-full bg-[var(--color-accent)] text-white px-4 py-2 text-sm font-semibold hover:bg-[var(--color-accent-soft)] transition-colors"
          >
            Free Books
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 -m-2 text-[var(--color-ink)]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[var(--color-rule)] bg-[var(--color-surface)]">
          <nav className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2 text-base text-[var(--color-ink-soft)] hover:text-[var(--color-primary)]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/free-books"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex justify-center rounded-full bg-[var(--color-accent)] text-white px-4 py-3 font-semibold"
            >
              Free Books
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
