/** Only allow YouTube's own ID shape through into the iframe src. */
const VALID_ID = /^[A-Za-z0-9_-]{6,20}$/;

export function YouTubeEmbed({ id, title }: { id: string; title?: string }) {
  if (!VALID_ID.test(id)) return null;

  return (
    <div className="my-8 overflow-hidden rounded-lg border border-[var(--color-rule)] shadow-sm">
      <div className="relative aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={title ?? "YouTube video"}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
