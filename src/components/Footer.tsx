import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-rule)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold text-[var(--color-primary)]">
            Mark Cheverton
          </p>
          <p className="mt-2 text-sm text-[var(--color-ink-soft)] max-w-xs">
            New York Times bestselling author of Minecraft novels and books for
            young readers facing anxiety.
          </p>
        </div>

        <div className="text-sm">
          <p className="font-semibold text-[var(--color-ink)] mb-3">Explore</p>
          <ul className="space-y-2 text-[var(--color-ink-soft)]">
            <li><Link href="/books" className="hover:text-[var(--color-primary)]">Books</Link></li>
            <li><Link href="/writing-resources" className="hover:text-[var(--color-primary)]">Writing Resources</Link></li>
            <li><Link href="/fanfic" className="hover:text-[var(--color-primary)]">Fan Fiction</Link></li>
            <li><Link href="/free-books" className="hover:text-[var(--color-primary)]">Free Books</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-semibold text-[var(--color-ink)] mb-3">Connect</p>
          <ul className="space-y-2 text-[var(--color-ink-soft)]">
            <li><Link href="/contact" className="hover:text-[var(--color-primary)]">Contact</Link></li>
            <li>
              <a href="https://www.facebook.com/mark.cheverton.94" target="_blank" rel="noreferrer" className="hover:text-[var(--color-primary)]">Facebook</a>
            </li>
            <li>
              <a href="https://twitter.com/MarkC_Author" target="_blank" rel="noreferrer" className="hover:text-[var(--color-primary)]">Twitter / X</a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/markchevertonauthor/" target="_blank" rel="noreferrer" className="hover:text-[var(--color-primary)]">LinkedIn</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--color-rule)]">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[var(--color-muted)]">
          <p>© {new Date().getFullYear()} Mark Cheverton. All rights reserved.</p>
          <Link href="/privacy" className="hover:text-[var(--color-ink-soft)]">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
