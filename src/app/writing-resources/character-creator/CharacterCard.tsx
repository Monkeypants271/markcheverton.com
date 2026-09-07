import type { CharacterData } from "./characterData";

type CharacterCardProps = { character: CharacterData };

const sections: Array<{ label: string; key: keyof CharacterData }> = [
  { label: "They Want...", key: "external_goal" },
  { label: "They're Afraid...", key: "core_fear" },
  { label: "Their Superpower", key: "competence" },
  { label: "Their Trouble Spot", key: "vulnerability" },
  { label: "What Makes Them Unforgettable", key: "distinctive_trait" },
  { label: "Someone They Care About", key: "important_relationship" },
  { label: "Something They Might Be Wrong About", key: "self_belief" },
  { label: "What Could Push Them Too Far", key: "never_do_line" },
];

export function CharacterCard({ character }: CharacterCardProps) {
  const identity = [character.age && `${character.age} years old`, character.character_type].filter(Boolean).join(" ");
  return (
    <article id="character-card" className="overflow-hidden rounded-3xl border-2 border-[var(--color-primary)] bg-white shadow-xl">
      <div className="bg-[var(--color-primary)] px-6 py-8 text-white sm:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-accent-soft)]">Meet My Character</p>
        <h2 className="mt-2 font-display text-4xl font-semibold">{character.character_name || "My Character"}</h2>
        {identity && <p className="mt-2 text-lg text-white/85">{identity}</p>}
        {character.appearance_anchor && <p className="mt-5 max-w-2xl text-white/90">{character.appearance_anchor}</p>}
      </div>
      <div className="grid gap-x-10 gap-y-8 p-6 sm:grid-cols-2 sm:p-10">
        {sections.map((section) => {
          const value = character[section.key];
          if (!value) return null;
          return (
            <div key={section.key}>
              <h3 className="font-display text-xl font-semibold text-[var(--color-accent)]">{section.label}</h3>
              <p className="mt-2 leading-relaxed text-[var(--color-ink)]">{value}</p>
            </div>
          );
        })}
      </div>
    </article>
  );
}
