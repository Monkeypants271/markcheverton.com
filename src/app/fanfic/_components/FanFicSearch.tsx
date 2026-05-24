"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/content";

const PER_PAGE = 24;

export function FanFicSearch({ posts, initialPage }: { posts: Post[]; initialPage: number }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(initialPage);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredPosts = useMemo(() => {
    const terms = normalizedSearch.split(/\s+/).filter(Boolean);
    if (terms.length === 0) return posts;

    return posts.filter((post) => {
      const title = post.title.toLowerCase();
      const author = (post.author || "").toLowerCase();
      return terms.every(
        (term) => title.includes(term) || author.includes(term)
      );
    });
  }, [normalizedSearch, posts]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PER_PAGE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pagePosts = filteredPosts.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <>
      <div className="space-y-4">
        <div>
          <label htmlFor="fanfic-search" className="block text-sm font-semibold text-[var(--color-muted)]">
            Search stories by title or author
          </label>
          <input
            id="fanfic-search"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Type a word from your story title or the name you used"
            className="mt-2 w-full rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] px-4 py-3 text-sm shadow-sm outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)/20]"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--color-muted)]">
            {filteredPosts.length === posts.length
              ? `${posts.length} stories and counting. Have one to share? Send it over and I'll post it.`
              : `${filteredPosts.length} stories match your search.`}
          </p>
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="rounded-full border border-[var(--color-rule)] px-4 py-2 text-sm text-[var(--color-primary)] transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)/10]"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      <div className="pt-10">
        <div className="text-center">
          <Link
            href="/fanfic/submit"
            className="inline-flex rounded-full bg-[var(--color-accent)] text-white px-7 py-3 font-semibold hover:bg-[var(--color-accent-soft)] transition-colors"
          >
            Share your own story →
          </Link>
        </div>
      </div>

      <div className="py-16">
        {pagePosts.length === 0 ? (
          <p className="text-[var(--color-muted)]">
            {search
              ? "No stories match that search. Try a different word or the name you used when submitting."
              : "No stories yet."}
          </p>
        ) : (
          <>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pagePosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/fanfic/${post.slug}`}
                    className="group block rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 hover:border-[var(--color-accent)] hover:shadow-md transition-all"
                  >
                    <h2 className="font-display text-lg font-semibold leading-snug text-[var(--color-primary)]">
                      {post.title}
                    </h2>
                    {post.date && (
                      <p className="mt-2 text-xs text-[var(--color-muted)]">
                        {new Date(post.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                    {post.author && (
                      <p className="mt-2 text-xs text-[var(--color-muted)]">by {post.author}</p>
                    )}
                    <p className="mt-3 text-sm text-[var(--color-ink-soft)] line-clamp-3">
                      {post.body
                        .replace(/!?\[.*?\]\(.*?\)/g, "")
                        .replace(/[#*_>`]/g, "")
                        .trim()
                        .slice(0, 200)}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-[var(--color-accent)] group-hover:translate-x-1 transition-transform">
                      Read story →
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-12 flex items-center justify-between text-sm">
      {page > 1 ? (
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          className="rounded-full border border-[var(--color-rule)] px-4 py-2 hover:border-[var(--color-accent)]"
        >
          ← Newer stories
        </button>
      ) : (
        <span />
      )}
      <span className="text-[var(--color-muted)]">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          className="rounded-full border border-[var(--color-rule)] px-4 py-2 hover:border-[var(--color-accent)]"
        >
          Older stories →
        </button>
      ) : (
        <span />
      )}
    </nav>
  );
}
