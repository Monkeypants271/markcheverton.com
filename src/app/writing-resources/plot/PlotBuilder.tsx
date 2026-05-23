"use client";

import { useEffect, useRef, useState } from "react";

type Section = {
  id: string;
  title: string;
  prompt: string;
  description: string;
  hints: string[];
  footnote?: string;
  outputLabel: string;
};

const SECTIONS: Section[] = [
  {
    id: "hook",
    title: "The Hook (Once upon a Time…)",
    prompt: "What is your story about at the very beginning?",
    description: "Introduce your main character and their life before the story starts. You might include:",
    hints: [
      "who the character is",
      "where they live",
      "what they care about",
      "what a normal day looks like",
    ],
    footnote: "You don't need details yet — just enough so we understand who the story is about.",
    outputLabel: "Hook (Once upon a time…)",
  },
  {
    id: "normal_world",
    title: "The Normal World (Every day…)",
    prompt: "What does \"every day\" look like for your character?",
    description: "Describe what life is usually like before anything changes. Think about:",
    hints: ["routines", "habits", "rules of the world", "what feels safe or familiar"],
    footnote: "This helps the reader notice when things start to go wrong.",
    outputLabel: "Normal World (Every day…)",
  },
  {
    id: "problem",
    title: "The Problem (One day…)",
    prompt: "What changes and starts the story?",
    description: "Something happens that breaks the normal world. This could be:",
    hints: ["a problem", "a surprise", "a challenge", "a mistake", "a new discovery"],
    footnote: "This moment gives your character something they have to deal with.",
    outputLabel: "The Problem (One day…)",
  },
  {
    id: "first_try",
    title: "First Attempt (Because of that…)",
    prompt: "What does your character do first to fix the problem?",
    description: "Your character reacts and tries something. It doesn't have to work. Think about:",
    hints: [
      "a choice they make",
      "a plan they try",
      "a decision that pushes the story forward",
    ],
    footnote: "Stories get interesting when characters act instead of waiting.",
    outputLabel: "First Try (Because of that…)",
  },
  {
    id: "things_get_worse",
    title: "Things get worse (Because of that… again)",
    prompt: "How does the problem grow or change?",
    description: "Because of the first try, something new goes wrong. The situation becomes:",
    hints: ["harder", "scarier", "more complicated", "more dangerous"],
    footnote: "This is where the stakes rise and the story builds tension.",
    outputLabel: "Things Get Worse (Because of that… again)",
  },
  {
    id: "hardest_moment",
    title: "The Hardest Moment (Dark Night of the Soul)",
    prompt: "When does it feel like your character might fail?",
    description: "This is the moment when:",
    hints: [
      "the plan falls apart",
      "the character feels stuck or defeated",
      "it looks like they might lose",
    ],
    footnote:
      "Many stories have a low point right before the ending. Writers sometimes call this the Dark Night of the Soul.",
    outputLabel: "The Hardest Moment (It looks like the hero might fail)",
  },
  {
    id: "solution",
    title: "The Solution (Until finally…)",
    prompt: "How does your character finally deal with the problem?",
    description: "Your character makes a final choice or takes action. This is where:",
    hints: [
      "something changes",
      "they use what they've learned",
      "the main problem is solved (or almost solved)",
    ],
    footnote: "The solution should grow out of what happened earlier in the story.",
    outputLabel: "The Solution (Until finally…)",
  },
  {
    id: "new_normal",
    title: "The New Normal (So…)",
    prompt: "How is life different at the end?",
    description: "Show what life looks like after everything is over. Think about:",
    hints: [
      "how the character has changed",
      "what they understand now",
      "what the world is like compared to the beginning",
    ],
    footnote: "This helps the story feel complete.",
    outputLabel: "The New Normal (So…)",
  },
  {
    id: "summary",
    title: "Plot Summary (optional but helpful)",
    prompt: "Put the whole story together.",
    description: "Using your notes above, describe what happens from beginning to end. You can:",
    hints: [
      "write short sentences",
      "connect the big moments",
      "leave out small details",
    ],
    footnote: "This will help when you turn your outline into a full story draft.",
    outputLabel: "Plot in One Paragraph (Optional)",
  },
];

const STORAGE_PREFIX = "storybuilder:v1:plot:";

function canUseStorage(): boolean {
  try {
    const t = STORAGE_PREFIX + "__test__";
    window.localStorage.setItem(t, "1");
    window.localStorage.removeItem(t);
    return true;
  } catch {
    return false;
  }
}

export function PlotBuilder() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [storageOK, setStorageOK] = useState(true);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [showOutput, setShowOutput] = useState(false);
  const [copied, setCopied] = useState(false);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const ok = canUseStorage();
    setStorageOK(ok);
    if (!ok) return;
    const initial: Record<string, string> = {};
    for (const s of SECTIONS) {
      const v = window.localStorage.getItem(STORAGE_PREFIX + s.id);
      if (v !== null) initial[s.id] = v;
    }
    setValues(initial);
  }, []);

  useEffect(() => {
    if (savedAt === null) return;
    const t = setTimeout(() => setSavedAt(null), 1200);
    return () => clearTimeout(t);
  }, [savedAt]);

  function updateField(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }));
    if (!storageOK) return;
    if (saveTimers.current[id]) clearTimeout(saveTimers.current[id]);
    saveTimers.current[id] = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_PREFIX + id, value);
        setSavedAt(Date.now());
      } catch {
        setStorageOK(false);
      }
    }, 300);
  }

  function buildOutputText(): string {
    const parts: string[] = [];
    for (const s of SECTIONS) {
      const v = (values[s.id] || "").trim();
      if (!v) continue;
      parts.push(`${s.outputLabel}\n${v}\n`);
    }
    return parts.length
      ? parts.join("\n")
      : "No plot notes yet — start filling in the boxes above.";
  }

  async function copyToClipboard() {
    const text = buildOutputText();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      alert("Couldn't copy automatically — long-press or right-click the output below to copy.");
    }
  }

  function startOver() {
    const ok = window.confirm(
      "Start a new story?\n\nThis will erase everything saved on this device for the Story Builder. Make sure you've copied your plot first."
    );
    if (!ok) return;
    if (storageOK) {
      for (const s of SECTIONS) {
        window.localStorage.removeItem(STORAGE_PREFIX + s.id);
      }
    }
    setValues({});
    setShowOutput(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 text-sm text-[var(--color-ink-soft)] leading-relaxed">
        <p className="font-semibold text-[var(--color-primary)]">
          How to use the Plot Builder
        </p>
        <p className="mt-2">
          Read each prompt and write your ideas in the box below it. You don&apos;t
          need full sentences — short notes are perfect. Work top to bottom, from
          the Hook to the New Normal. If you get stuck, skip a box and come back
          later.
        </p>
        <p className="mt-2">
          {storageOK ? (
            <span>💾 This page saves on this device as you type. If you&apos;re switching computers or coming back another day, remember to <strong>Copy Plot Text</strong> before you leave.</span>
          ) : (
            <span className="text-[var(--color-accent)]">
              Autosave isn&apos;t available on this device. Use <strong>Copy Plot Text</strong> often to save your work.
            </span>
          )}
        </p>
      </div>

      <details className="mt-6 rounded-xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-5">
        <summary className="cursor-pointer font-display text-lg font-semibold text-[var(--color-primary)]">
          Pixar&apos;s Rule #4
        </summary>
        <div className="mt-3 text-sm text-[var(--color-ink-soft)] leading-relaxed">
          <p>
            This plot organizer follows the pattern described by Pixar&apos;s
            Writing Rule #4. There are lots of ways to organize a plot — this
            one is a great place to start.
          </p>
          <ol className="mt-3 list-decimal pl-6 space-y-1">
            <li>Once upon a time there was ___.</li>
            <li>Every day, ___.</li>
            <li>One day, ___.</li>
            <li>Because of that, ___.</li>
            <li>Because of that, ___.</li>
            <li>Dark Night of the Soul, ___.</li>
            <li>Until finally ___.</li>
            <li>So… ___.</li>
          </ol>
        </div>
      </details>

      <form className="mt-10 space-y-10" onSubmit={(e) => e.preventDefault()}>
        {SECTIONS.map((s, i) => (
          <section key={s.id}>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl font-semibold text-[var(--color-accent)]">
                {i + 1}.
              </span>
              <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
                {s.title}
              </h2>
            </div>

            <p className="mt-3 font-semibold text-[var(--color-ink)]">
              {s.prompt}
            </p>
            <p className="mt-2 text-[var(--color-ink-soft)] leading-relaxed">
              {s.description}
            </p>
            <ul className="mt-2 ml-6 list-disc text-[var(--color-ink-soft)] space-y-1">
              {s.hints.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            {s.footnote && (
              <p className="mt-2 text-sm text-[var(--color-muted)] italic">
                {s.footnote}
              </p>
            )}

            <textarea
              id={`plot_${s.id}`}
              value={values[s.id] || ""}
              onChange={(e) => updateField(s.id, e.target.value)}
              placeholder="Write your ideas here…"
              rows={5}
              className="mt-4 w-full rounded-lg border border-[var(--color-rule)] bg-white p-4 text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 font-sans"
            />
          </section>
        ))}
      </form>

      <div className="mt-12 sticky bottom-4 z-10">
        <div className="rounded-2xl bg-[var(--color-primary)] text-white p-5 shadow-xl flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setShowOutput((v) => !v)}
            className="rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] px-6 py-3 font-semibold transition-colors"
          >
            {showOutput ? "Hide My Plot" : "Show My Plot"}
          </button>
          <button
            type="button"
            onClick={copyToClipboard}
            className="rounded-full border border-white/40 hover:bg-white/10 px-6 py-3 font-semibold transition-colors"
          >
            {copied ? "Copied!" : "Copy Plot Text"}
          </button>
          <button
            type="button"
            onClick={startOver}
            className="rounded-full border border-white/40 hover:bg-white/10 px-6 py-3 font-semibold transition-colors"
          >
            Start a New Story
          </button>
          {savedAt !== null && (
            <span className="text-sm text-white/80">Saved.</span>
          )}
        </div>
      </div>

      {showOutput && (
        <section className="mt-10 rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-8">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
            Your Plot So Far
          </h2>
          <pre className="mt-4 whitespace-pre-wrap font-sans text-[var(--color-ink)] leading-relaxed">
            {buildOutputText()}
          </pre>
        </section>
      )}
    </div>
  );
}
