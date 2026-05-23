import type { MigratedComment } from "@/lib/content";

export function CommentList({ comments }: { comments: MigratedComment[] }) {
  if (comments.length === 0) return null;

  // Build a thread tree
  const byId = new Map(comments.map((c) => [c.id, c]));
  const children = new Map<number, MigratedComment[]>();
  for (const c of comments) {
    if (c.parent !== 0) {
      const list = children.get(c.parent) ?? [];
      list.push(c);
      children.set(c.parent, list);
    }
  }
  const roots = comments.filter((c) => c.parent === 0 || !byId.has(c.parent));

  return (
    <section className="mt-16 border-t border-[var(--color-rule)] pt-10">
      <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
        {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
      </h2>

      <ul className="mt-6 space-y-6">
        {roots.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            replies={children.get(c.id) ?? []}
          />
        ))}
      </ul>
    </section>
  );
}

function CommentItem({
  comment,
  replies,
}: {
  comment: MigratedComment;
  replies: MigratedComment[];
}) {
  const date = new Date(comment.date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <li className="rounded-lg border border-[var(--color-rule)] bg-[var(--color-surface)] p-5">
      <header className="flex items-center justify-between text-sm">
        <span className="font-semibold text-[var(--color-primary)]">
          {comment.author}
        </span>
        <time className="text-[var(--color-muted)]">{date}</time>
      </header>
      <div
        className="mt-3 text-[var(--color-ink-soft)] [&_p]:my-2"
        dangerouslySetInnerHTML={{ __html: comment.contentHtml }}
      />

      {replies.length > 0 && (
        <ul className="mt-4 ml-6 space-y-3 border-l border-[var(--color-rule)] pl-5">
          {replies.map((r) => (
            <CommentItem key={r.id} comment={r} replies={[]} />
          ))}
        </ul>
      )}
    </li>
  );
}
