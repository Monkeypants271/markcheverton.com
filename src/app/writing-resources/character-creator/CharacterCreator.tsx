"use client";

import { useEffect, useState } from "react";
import { CharacterCard } from "./CharacterCard";
import { CHARACTER_QUESTIONS } from "./questions";
import { deriveCharacterSeeds, EMPTY_CHARACTER, type CharacterData } from "./characterData";

const STORAGE_KEY = "markcheverton:character-creator:v1";

function outputText(character: CharacterData) {
  return [
    `Meet My Character\n${character.character_name}${character.age ? `, ${character.age}` : ""}${character.character_type ? ` ${character.character_type}` : ""}${character.appearance_anchor ? `\n${character.appearance_anchor}` : ""}`,
    ["They Want...", character.external_goal], ["They're Afraid...", character.core_fear], ["Their Superpower", character.competence],
    ["Their Trouble Spot", character.vulnerability], ["What Makes Them Unforgettable", character.distinctive_trait],
    ["Someone They Care About", character.important_relationship], ["Something They Might Be Wrong About", character.self_belief],
    ["What Could Push Them Too Far", character.never_do_line],
  ].filter((item) => Array.isArray(item) ? item[1] : item).map((item) => Array.isArray(item) ? `${item[0]}\n${item[1]}` : item).join("\n\n");
}

export function CharacterCreator() {
  const [character, setCharacter] = useState<CharacterData>(EMPTY_CHARACTER);
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) setCharacter({ ...EMPTY_CHARACTER, ...JSON.parse(saved) });
      } catch { /* Storage can be unavailable in private browsing. */ }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(character)); } catch { /* Keep the tool usable without storage. */ }
  }, [character, hydrated]);

  const question = CHARACTER_QUESTIONS[step];
  const isLast = step === CHARACTER_QUESTIONS.length - 1;
  const identityFields: Array<{ key: keyof CharacterData; label: string; placeholder: string }> = [
    { key: "character_name", label: "Name", placeholder: "e.g. Milo" },
    { key: "age", label: "Age", placeholder: "e.g. 12" },
    { key: "character_type", label: "What kind of character?", placeholder: "Human, elf, robot, animal..." },
    { key: "appearance_anchor", label: "One memorable thing about how they look", placeholder: "A purple streak in their hair..." },
  ];

  function update(key: keyof CharacterData, value: string) { setCharacter((current) => ({ ...current, [key]: value })); }
  function next() {
    if (isLast) { setShowCard(true); return; }
    setStep((current) => current + 1);
  }
  function startOver() {
    if (!window.confirm("Start over? This will erase this character from this device.")) return;
    setCharacter(EMPTY_CHARACTER); setStep(0); setShowCard(false);
    window.localStorage.removeItem(STORAGE_KEY);
  }
  async function copyCharacter() {
    await navigator.clipboard?.writeText(outputText(character));
    setCopied(true); window.setTimeout(() => setCopied(false), 1600);
  }

  if (!hydrated) {
    return <div className="mx-auto max-w-3xl rounded-3xl border border-[var(--color-rule)] bg-white p-10 text-center text-[var(--color-ink-soft)]">Loading your character...</div>;
  }

  if (showCard) {
    return <div className="mx-auto max-w-3xl"><CharacterCard character={{ ...character, ...deriveCharacterSeeds(character) }} /><div className="mt-6 flex flex-wrap gap-3 print:hidden">
      <button type="button" onClick={() => setShowCard(false)} className="rounded-full bg-[var(--color-primary)] px-5 py-3 font-semibold text-white hover:bg-[var(--color-primary-soft)]">Edit Character</button>
      <button type="button" onClick={copyCharacter} className="rounded-full border border-[var(--color-primary)] px-5 py-3 font-semibold text-[var(--color-primary)] hover:bg-white">{copied ? "Copied!" : "Copy Character"}</button>
      <button type="button" onClick={() => window.print()} className="rounded-full border border-[var(--color-rule)] px-5 py-3 font-semibold text-[var(--color-ink)] hover:bg-white">Print / Save as PDF</button>
      <button type="button" onClick={startOver} className="ml-auto rounded-full px-5 py-3 font-semibold text-[var(--color-accent)] hover:bg-white">Start Over</button>
    </div></div>;
  }

  return <div className="mx-auto max-w-3xl">
    <div className="mb-5 flex items-center justify-between text-sm font-semibold text-[var(--color-ink-soft)]"><span>{step < 8 ? `${step + 1} of 8` : "Bonus question"}</span><span>{step + 1} / {CHARACTER_QUESTIONS.length}</span></div>
    <div className="mb-8 h-2 overflow-hidden rounded-full bg-[var(--color-rule)]"><div className="h-full rounded-full bg-[var(--color-accent)] transition-all" style={{ width: `${((step + 1) / CHARACTER_QUESTIONS.length) * 100}%` }} /></div>
    <section className="rounded-3xl border border-[var(--color-rule)] bg-white p-6 shadow-lg sm:p-10">
      <p className="font-display text-lg font-semibold text-[var(--color-accent)]">{step === 8 ? "A little story trouble" : `Question ${step + 1}`}</p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-[var(--color-primary)] sm:text-4xl">{question.title}</h2>
      <p className="mt-4 text-lg leading-relaxed text-[var(--color-ink)]">{question.prompt}</p>
      {question.helper && <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">{question.helper}</p>}
      {question.helperExamples && <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">{question.helperExamples.map((example) => <li key={example}>{example}</li>)}</ul>}
      {question.kind === "identity" ? <div className="mt-8 grid gap-5 sm:grid-cols-2">{identityFields.map((field) => <label key={field.key} className={field.key === "appearance_anchor" ? "sm:col-span-2" : ""}><span className="text-sm font-semibold text-[var(--color-ink)]">{field.label}</span><input value={character[field.key]} onChange={(event) => update(field.key, event.target.value)} placeholder={field.placeholder} className="mt-2 w-full rounded-xl border border-[var(--color-rule)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/25" /></label>)}</div> : <textarea autoFocus value={character[question.id]} onChange={(event) => update(question.id, event.target.value)} placeholder={question.placeholder} rows={6} className="mt-8 w-full resize-y rounded-xl border border-[var(--color-rule)] bg-[var(--color-bg)] p-4 text-lg leading-relaxed text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/25" />}
      <div className="mt-8 flex items-center justify-between gap-3"><button type="button" disabled={step === 0} onClick={() => setStep((current) => current - 1)} className="rounded-full border border-[var(--color-rule)] px-5 py-3 font-semibold text-[var(--color-ink-soft)] disabled:invisible">Back</button><button type="button" onClick={next} className="rounded-full bg-[var(--color-accent)] px-6 py-3 font-semibold text-white shadow-sm hover:bg-[var(--color-accent-soft)]">{isLast ? "Meet My Character" : "Next"}</button></div>
    </section>
    <button type="button" onClick={startOver} className="mt-6 block text-sm font-semibold text-[var(--color-ink-soft)] underline decoration-[var(--color-rule)] underline-offset-4 hover:text-[var(--color-accent)]">Start Over</button>
  </div>;
}
