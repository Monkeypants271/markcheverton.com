"use client";
import Image, { getImageProps } from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { draftKey, missingStages, outlineText, storyDogs, type StoryAnswers } from "@/data/storyDogs";
import { answerPlaceholders } from "@/data/storyDogsPlaceholders";
import { storyDogsStudentHelp } from "@/data/storyDogsStudentHelp";

import { appendTranscript } from "@/lib/storydogs-dictation";
import { usePresenterPunctuation } from "./usePresenterPunctuation";
import { useStoryDictation } from "./useStoryDictation";
import { DictationControl } from "./DictationControl";
import { PanelSilhouette } from "./PanelSilhouette";
import { GrowingAnswer } from "./GrowingAnswer";
import { createSuggestionRound, nextSuggestion, type SuggestionRound } from "@/lib/story-dogs";

const dogSizes = "(max-width: 700px) 240px, (max-width: 1360px) 26vw, 360px";

export function StoryDogsBuilder({ version = "kids" }: { version?: "kids" | "teachers" | "presenter" }) {
  const storageKey = version === "kids" ? draftKey : `${draftKey}:${version}`;
  const [answers, setAnswers] = useState<StoryAnswers>({});
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState("Checking browser draft storage…");
  const [output, setOutput] = useState(false);
  const [gaps, setGaps] = useState(false);
  const [status, setStatus] = useState("");
  const [fallback, setFallback] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionRound>({});
  const [copiedForDocs, setCopiedForDocs] = useState(false);
  const copyAttempt = useRef(0);
  const resetDialog = useRef<HTMLDialogElement>(null);
  const resetTrigger = useRef<HTMLButtonElement>(null);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const gapNotice = useRef<HTMLDivElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const fallbackField = useRef<HTMLTextAreaElement>(null);
  const answersRef = useRef(answers);
  useLayoutEffect(() => { answersRef.current = answers; }, [answers]);
  const punctuation = usePresenterPunctuation(version === "presenter", target => {
    const [id, index] = target.split(":"); return answersRef.current[id]?.[Number(index)] || "";
  }, (target, expected, value) => {
    const [id, index] = target.split(":"); const question = Number(index);
    if ((answersRef.current[id]?.[question] || "") !== expected) return false;
    const pair = [...(answersRef.current[id] || ["", ""])]; pair[question] = value;
    answersRef.current = { ...answersRef.current, [id]: pair }; setAnswers(answersRef.current);
    copyAttempt.current++; setCopiedForDocs(false); return true;
  });
  const dictation = useStoryDictation((target, words) => {
    const [id, indexText] = target.split(":"); const index = Number(indexText);
    if (!storyDogs.some(stage => stage.id === id) || (index !== 0 && index !== 1)) return;
    punctuation.invalidate(target);
    copyAttempt.current++; setCopiedForDocs(false);
    const pair = [...(answersRef.current[id] || ["", ""])];
    pair[index] = appendTranscript(pair[index] || "", words);
    answersRef.current = { ...answersRef.current, [id]: pair }; setAnswers(answersRef.current);
  }, punctuation.complete);
  useEffect(() => {
    const timer = window.setTimeout(() => {
    const recovered: StoryAnswers = {};
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft?.version === 1 && draft.answers && typeof draft.answers === "object") {
          for (const s of storyDogs) {
            const pair = draft.answers[s.id];
            if (Array.isArray(pair)) recovered[s.id] = s.questions.map((_, i) => typeof pair[i] === "string" ? pair[i] : "");
          }
        } else setStatus("The saved draft format could not be recovered. You can start a new story.");
      }
    } catch { setStatus("A saved draft could not be read. You can still use the activity."); }
    setAnswers(recovered);
    setSuggestions(createSuggestionRound());
    setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [storageKey]);
  useEffect(() => {
    if (!ready) return;
    try {
      if (Object.values(answers).some(pair => pair.some(Boolean))) localStorage.setItem(storageKey, JSON.stringify({ version: 1, answers }));
      else { localStorage.setItem(storageKey + ":test", "1"); localStorage.removeItem(storageKey + ":test"); localStorage.removeItem(storageKey); }
      // Storage synchronization reports the actual outcome, including quota failures.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSaving("Your draft is saved in this browser. On a shared computer, clear it when you’re done.");
    } catch { setSaving("Your draft is not being saved in this browser. Copy or download your outline before leaving."); }
  }, [answers, ready, storageKey]);
  useEffect(() => { if (fallback) { fallbackField.current?.focus(); fallbackField.current?.select(); } }, [fallback]);
  useEffect(() => {
    const siteHeader = document.querySelector<HTMLElement>("body > header");
    const nav = navigation.current;
    if (!nav) return;
    const measure = () => {
      const page = nav.closest<HTMLElement>(".storydogs-page");
      page?.style.setProperty("--sd-site-nav-height", `${siteHeader?.getBoundingClientRect().height || 0}px`);
      page?.style.setProperty("--sd-story-nav-height", `${nav.getBoundingClientRect().height}px`);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    if (siteHeader) observer.observe(siteHeader);
    measure();
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const index = storyDogs.findIndex(stage => entry.target.id === `sd-stage-${stage.id}`);
        const next = storyDogs[index + 1];
        if (next) {
          const { props } = getImageProps({ src: next.image, alt: "", width: 640, height: 640, sizes: dogSizes });
          preload(props.src, { as: "image", imageSrcSet: props.srcSet, imageSizes: props.sizes, fetchPriority: "low" });
        }
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "200px 0px" });
    document.querySelectorAll(".sd-stage").forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  function jump(id: string) {
    const section = document.getElementById(`sd-stage-${id}`);
    section?.scrollIntoView({ behavior: "instant", block: "start" });
    section?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
  }
  function update(id: string, index: number, value: string) {
    dictation.cancelForTarget(`${id}:${index}`);
    punctuation.invalidate(`${id}:${index}`);
    copyAttempt.current++;
    setCopiedForDocs(false);
    setAnswers(prev => ({ ...prev, [id]: [index === 0 ? value : prev[id]?.[0] || "", index === 1 ? value : prev[id]?.[1] || ""] }));
  }
  function anotherIdea(stageId: string, index: number) {
    const key = `${stageId}-${index}`;
    const bank = storyDogs.find(stage => stage.id === stageId)!.suggestions[index];
    setSuggestions(prev => ({ ...prev, [key]: nextSuggestion(prev[key], bank.length) }));
  }
  function showOutline() {
    dictation.cancel();
    punctuation.invalidate();
    if (missingStages(answers).length) {
      setGaps(true);
      requestAnimationFrame(() => { gapNotice.current?.scrollIntoView({ block: "start" }); gapNotice.current?.focus({ preventScroll: true }); });
    } else reveal();
  }
  function reveal() {
    dictation.cancel();
    punctuation.invalidate();
    setOutput(true);
    setGaps(false);
    requestAnimationFrame(() => { heading.current?.scrollIntoView({ block: "start" }); heading.current?.focus({ preventScroll: true }); });
  }
  async function copy() {
    const attempt = ++copyAttempt.current;
    try {
      await navigator.clipboard.writeText(outlineText(answers));
      if (attempt !== copyAttempt.current) return;
      setStatus("Complete outline copied. Open Google Docs, create a blank document, and paste it.");
      setCopiedForDocs(true);
      setFallback(false);
    } catch {
      if (attempt !== copyAttempt.current) return;
      setCopiedForDocs(false);
      setStatus("Automatic copying was unavailable. Use the selectable outline text below.");
      setFallback(true);
      requestAnimationFrame(() => { fallbackField.current?.focus(); fallbackField.current?.select(); });
    }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([outlineText(answers)], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "my-storydogs-outline.txt"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); setStatus("Outline downloaded.");
  }
  function requestReset(event: React.MouseEvent<HTMLButtonElement>) {
    dictation.cancel();
    punctuation.invalidate();
    resetTrigger.current = event.currentTarget;
    if (Object.values(answers).some(pair => pair.some(answer => answer.length > 0))) {
      resetDialog.current?.showModal();
    } else reset();
  }
  function reset() {
    dictation.cancel();
    punctuation.invalidate();
    copyAttempt.current++;
    try {
      localStorage.removeItem(storageKey);
      setStatus("Your answers and saved browser draft have been cleared. A new round of ideas is ready.");
    } catch {
      setStatus("Your answers were cleared, but the saved browser draft could not be removed. Clear this site’s browser data to prevent it returning after refresh.");
    }
    answersRef.current = {};
    setAnswers({});
    setOutput(false);
    setGaps(false);
    setFallback(false);
    setCopiedForDocs(false);
    setSuggestions(prev => createSuggestionRound(prev));
    resetDialog.current?.close();
    requestAnimationFrame(() => {
      jump("who");
    });
  }
  const missing = missingStages(answers);
  const secondDogProps = getImageProps({ src: storyDogs[1].image, alt: "", width: 640, height: 640, sizes: dogSizes }).props;
  const stageHeadingColors = ["#65258d", "#145a3b", "#174f85", "#a43f18", "#9e2038", "#6b2e91", "#145a3b"];
  return <>
    <link rel="preload" as="image" href={secondDogProps.src} imageSrcSet={secondDogProps.srcSet} imageSizes={secondDogProps.sizes} fetchPriority="low" />
    <nav ref={navigation} className="sd-navigation sd-no-print" aria-label="StoryDogs stages">
      <a className="sd-brand" href="#storydogs-builder">StoryDogs</a>
      <div className="sd-jump-links">{storyDogs.map(stage => <a key={stage.id} href={`#sd-stage-${stage.id}`} onClick={event => { event.preventDefault(); jump(stage.id); }}>{stage.label}</a>)}</div>
      <button className="sd-button sd-gold" disabled={!ready} onClick={showOutline}>Show My Plot Outline</button>
    </nav>
    <header className="sd-intro sd-no-print">
      <p className="sd-eyebrow">FREE STORY PLANNING · GRADES K–5</p>
      <h1>Your ideas. Your story.</h1>
      <p className="sd-tagline">Seven steps to build a story worth telling.</p>
      <p>Write your ideas, or ask an adult to type or dictate them.</p>
      <details className="sd-dictation-help"><summary>Dictation Help</summary>
        <p>To dictate, connect your microphone and select it as your computer’s input device. Click Dictate beside an answer and allow microphone access. Wait until you see “Listening… Speak now,” then speak. Click Stop Dictation when you’re finished. You can edit your words afterward.</p>
        <p>A wireless microphone needs a receiver that your computer recognizes as an audio input. StoryDogs uses the microphone selected by your computer/browser; it cannot automatically configure USB equipment.</p>
        <p>Browser dictation may send audio to the browser provider’s speech-recognition service. StoryDogs does not record or store audio. Only finalized text is added to your answers and saved in your browser draft. Live preview words are not saved.</p>
        <p>US English is used for dictation. Sessions may end after silence; click Dictate again when you’re ready. Typing always remains available.</p>
      </details>
      {dictation.supported === false && <p className="sd-dictation-unavailable">This browser does not support built-in dictation. You can still type every answer, or try a browser with speech recognition, such as Chrome.</p>}
      <button type="button" onClick={requestReset} disabled={!ready} className="sd-reset">Start a New Story</button>
    </header>
    <section id="storydogs-builder" className="sd-builder" aria-label="StoryDogs story builder">
      <p className="sd-storage sd-no-print">{saving} Drafts stay on this device and are not a cloud backup.</p>
      <div className="sd-story-stages sd-no-print">
        {storyDogs.map((stage, stageIndex) => <section id={`sd-stage-${stage.id}`} className={`sd-stage ${stageIndex % 2 ? "sd-right" : "sd-left"}`} key={stage.id} aria-labelledby={`sd-heading-${stage.id}`}>
          <div className="sd-dog">
            {failedImages.includes(stage.id) ? <div className="sd-placeholder">{stage.label}<small>Dog illustration unavailable</small></div> : <Image key={stage.id} src={stage.image} alt={stage.dog} width={640} height={640} sizes={dogSizes} {...(stageIndex === 0 ? { preload: true } : { loading: "lazy" as const })} onError={() => setFailedImages(prev => [...prev, stage.id])} />}
          </div>
          <div className="sd-panel">
            <PanelSilhouette />
            <h2 id={`sd-heading-${stage.id}`} tabIndex={-1} style={{ color: stageHeadingColors[stageIndex] }}><span className="sd-stage-name">{stage.label}</span>{" "}<span className="sd-stage-description">-{"\u00a0"}{stage.title}</span></h2>
            <div className="sd-fields">{stage.questions.map((question, questionIndex) => <div className="sd-field" key={`${stage.id}-${questionIndex}`}>
              <label htmlFor={`${stage.id}-${questionIndex}`}>{question}</label>
              <GrowingAnswer disabled={!ready} id={`${stage.id}-${questionIndex}`} rows={3} value={answers[stage.id]?.[questionIndex] || ""} onBeforeInput={() => dictation.cancelForTarget(`${stage.id}:${questionIndex}`)} onPaste={() => dictation.cancelForTarget(`${stage.id}:${questionIndex}`)} onChange={event => update(stage.id, questionIndex, event.target.value)} placeholder={answerPlaceholders[stage.id][questionIndex]} />
              <DictationControl dictation={{ ...dictation, toggle: target => { punctuation.invalidate(target); dictation.toggle(target); } }} target={`${stage.id}:${questionIndex}`} fieldId={`${stage.id}-${questionIndex}`} label={`${stage.label} question ${questionIndex + 1}`} ready={ready} />
              {version === "presenter" && punctuation.view[`${stage.id}:${questionIndex}`] && <div className="sd-punctuation">
                <p role="status">{punctuation.view[`${stage.id}:${questionIndex}`].message}</p>
                {punctuation.view[`${stage.id}:${questionIndex}`].phase === "failed" && <button className="sd-button" onClick={() => punctuation.retry(`${stage.id}:${questionIndex}`)}>Retry Punctuation</button>}
                {punctuation.view[`${stage.id}:${questionIndex}`].phase === "done" && <button className="sd-button" onClick={() => punctuation.undo(`${stage.id}:${questionIndex}`)}>Undo Punctuation</button>}
              </div>}
              <aside className="sd-inspiration" aria-label={`Inspiration for ${stage.label} question ${questionIndex + 1}`}>
                <p id={`${stage.id}-${questionIndex}-idea`} aria-live="polite"><strong>Try this:</strong> {stage.suggestions[questionIndex][suggestions[`${stage.id}-${questionIndex}`]?.current ?? 0]}</p>
                <button type="button" className="sd-idea-button" disabled={!ready} aria-describedby={`${stage.id}-${questionIndex}-idea`} onClick={() => anotherIdea(stage.id, questionIndex)}>Another Idea<span className="sr-only"> for {stage.label} question {questionIndex + 1}</span></button>
              </aside>
            </div>)}</div>
            <details className="sd-hint">
              <summary>Do you need a little help with this step?</summary>
              <div className="sd-help-content">
                <ul>{storyDogsStudentHelp[stage.id].tips.map(tip => <li key={tip}>{tip}</li>)}</ul>
                <h3>Pip’s example</h3><p>{storyDogsStudentHelp[stage.id].example}</p>

              </div>
            </details>
          </div>
        </section>)}
        <div className="sd-outline-action">
          <button className="sd-button sd-gold" disabled={!ready} onClick={showOutline}>Show My Plot Outline</button>
          <p>Turn your answers into a plan for your story.</p>
        </div>
      </div>
      {gaps && missing.length > 0 && <div ref={gapNotice} tabIndex={-1} className="sd-gap sd-no-print" role="region" aria-label="Unanswered questions"><h3>A few ideas are still missing.</h3><p>These stages have unanswered questions: {missing.map(stage => stage.label).join(", ")}. You can return to them or make a partial outline with clearly marked gaps.</p><div className="sd-controls"><button className="sd-button sd-primary" onClick={reveal}>Show partial outline</button><button className="sd-button" onClick={() => jump(missing[0].id)}>Return to missing answers</button></div></div>}
      <details className="sd-review sd-no-print"><summary>Show our answers</summary>{storyDogs.map(stage => <section key={stage.id}><h3>{stage.label}</h3>{stage.questions.map((question, index) => <div key={question}><p className="sd-small">{question}</p><p className="sd-answer">{answers[stage.id]?.[index] || "[Not answered yet]"}</p></div>)}<button onClick={() => jump(stage.id)}>Edit this stage →</button></section>)}</details>
      {output && <section className="sd-outline" aria-labelledby="sd-outline-title">
        <h2 id="sd-outline-title" ref={heading} tabIndex={-1}>My StoryDogs Plot Outline{missing.length ? " (partial)" : ""}</h2><p>This is the outline of your story. Add the scenes and details to make it yours.</p>
        <div className="sd-controls sd-no-print"><button className="sd-button sd-primary" onClick={copy}>Copy for Google Docs</button><button className="sd-button" onClick={() => jump("who")}>Return to builder</button><button className="sd-button" onClick={download}>Download .txt</button><button className="sd-button" onClick={() => window.print()}>Print outline</button></div>
        {copiedForDocs && <div className="sd-docs-success sd-no-print"><a className="sd-button sd-primary" href="https://docs.google.com/document/" target="_blank" rel="noopener noreferrer">Open Google Docs ↗</a><p>Create a blank document, then paste your outline with Ctrl+V (Windows/Chromebook) or Command+V (Mac).</p></div>}
        {storyDogs.map(stage => <section className="sd-outline-stage" key={stage.id}><h3>{stage.label} <span>— {stage.cue}</span></h3>{stage.questions.map((question, index) => <div key={question}><p className="sd-small">{question}</p><p className="sd-answer">{answers[stage.id]?.[index]?.trim() ? answers[stage.id][index] : "[Not answered yet]"}</p></div>)}<button className="sd-no-print" onClick={() => jump(stage.id)}>Edit {stage.label} →</button></section>)}
        {fallback && <div className="sd-no-print"><label htmlFor="sd-copy">Copy your outline manually</label><p className="sd-small">Click in the text below, press Ctrl+A then Ctrl+C (Windows/Chromebook), or Command+A then Command+C (Mac). In a blank Google document, press Ctrl+V or Command+V to paste.</p><textarea id="sd-copy" ref={fallbackField} readOnly rows={14} value={outlineText(answers)} /></div>}
      </section>}
      <div className="sd-restart-footer sd-no-print"><button type="button" className="sd-reset" disabled={!ready} onClick={requestReset}>Start a New Story</button></div>
      <dialog ref={resetDialog} className="sd-reset-dialog sd-no-print" aria-labelledby="sd-reset-title" onClose={() => resetTrigger.current?.focus()}>
        <h2 id="sd-reset-title">Start a new story? This will clear all your answers.</h2>
        <div className="sd-controls"><button type="button" autoFocus className="sd-button" onClick={() => resetDialog.current?.close()}>Keep My Story</button><button type="button" className="sd-button sd-clear" onClick={reset}>Clear Answers and Start Again</button></div>
      </dialog>
      <p role="status" className="sd-status sd-no-print">{status}</p>
    </section>
  </>;
}
