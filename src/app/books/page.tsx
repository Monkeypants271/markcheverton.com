import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export const metadata = { title: "Books" };

const series = [
  {
    name: "Order of the Stones",
    books: ["Facing the Beast Within"],
  },
  { name: "Spy-Girl Files", books: ["Spy-girl and the Family Secret"] },
  { name: "The Giants of StoneHold", books: ["The Giant's Giant", "The Giant's Nightmare"] },
  { name: "Gameknight999 (Minecraft Series #1)", books: ["3 books"] },
  { name: "Mystery of Herobrine (Minecraft Series #2)", books: ["3 books"] },
  { name: "Herobrine Reborn (Minecraft Series #3)", books: ["3 books"] },
  { name: "Herobrine's Revenge (Minecraft Series #4)", books: ["3 books"] },
  { name: "Birth of Herobrine (Minecraft Series #5)", books: ["3 books"] },
  { name: "Mystery of Entity303 (Minecraft Series #6)", books: ["3 books"] },
  { name: "Rise of the Warlords (Far Land Series #1)", books: ["3 books"] },
  { name: "Wither War (Far Land Series #2)", books: ["3 books"] },
];

export default function BooksPage() {
  return (
    <>
      <PageHeader eyebrow="Books" title="Series and stand-alone novels">
        24 novels in print across 32 countries. Browse the full catalog below —
        every book links to its Amazon page.
      </PageHeader>

      <Container className="py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {series.map((s) => (
            <div
              key={s.name}
              className="rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6"
            >
              <h2 className="font-display text-xl font-semibold text-[var(--color-primary)]">
                {s.name}
              </h2>
              <ul className="mt-3 text-sm text-[var(--color-ink-soft)] space-y-1">
                {s.books.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-[var(--color-muted)]">
          Note: this catalog will be wired up with cover images and direct Amazon
          links during content migration.
        </p>
      </Container>
    </>
  );
}
