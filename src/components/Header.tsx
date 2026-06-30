"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/books", label: "Books" },
  { href: "/minecraft-books", label: "Minecraft Books" },
  { href: "https://www.chevertonauthorvisits.com", label: "Author Visits", external: true },
  { href: "/for-educators", label: "For Educators" },
  { href: "/writing-resources", label: "Writing Resources" },
  { href: "/fanfic", label: "Fan Fiction" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="relative min-h-36 overflow-hidden bg-[var(--color-primary)] bg-cover bg-center px-6 py-8 text-white sm:min-h-44 md:min-h-56 lg:min-h-64"
        style={{ backgroundImage: "url('/images/home/homepage-header-no-text.webp')" }}
      >
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative mx-auto flex min-h-20 max-w-6xl items-center justify-center text-center sm:min-h-28 md:min-h-40">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-soft)] sm:text-sm">
              New York Times Bestselling Author
            </p>
            <p className="mt-2 font-display text-3xl font-semibold leading-tight text-white drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl">
              Mark Cheverton
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-sm font-medium text-white/90 drop-shadow sm:text-base md:text-lg">
              Minecraft-inspired adventures and writing tools that help kids love reading.
            </p>
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-[var(--color-rule)] bg-[var(--color-surface)]/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-6">
          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-tight text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
            onClick={() => setOpen(false)}
          >
            Mark Cheverton
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[var(--color-ink-soft)]">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
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
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="py-2 text-base text-[var(--color-ink-soft)] hover:text-[var(--color-primary)]"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="py-2 text-base text-[var(--color-ink-soft)] hover:text-[var(--color-primary)]"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
