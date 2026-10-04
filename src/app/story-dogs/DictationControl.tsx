"use client";

import type { useStoryDictation } from "./useStoryDictation";

export function DictationControl({ dictation, target, fieldId, label, ready }: {
  dictation: ReturnType<typeof useStoryDictation>;
  target: string;
  fieldId: string;
  label: string;
  ready: boolean;
}) {
  if (!dictation.supported) return null;
  const active = dictation.target === target;
  const feedback = dictation.feedbackTarget === target;
  const statusId = `${fieldId}-dictation-status`;
  return <>
    <div className="sd-dictation-tools">
      <button type="button" className="sd-dictate" disabled={!ready || (active && dictation.phase === "stopping")} aria-controls={fieldId} aria-pressed={active} aria-describedby={feedback ? statusId : undefined} onClick={() => dictation.toggle(target)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8" /></svg>
        {active ? (dictation.phase === "starting" ? "Getting Ready… (Cancel)" : "Stop Dictation") : "Dictate"}<span className="sr-only"> for {label}</span>
      </button>
      {feedback && <p id={statusId} className={`sd-dictation-status ${active && dictation.phase === "listening" ? "sd-listening" : ""}`} role="status"><span aria-hidden="true">{active ? "● " : "ⓘ "}</span>{dictation.message}</p>}
    </div>
    {active && dictation.interim && <p className="sd-dictation-preview" role="status"><strong>Live preview (not saved yet):</strong> {dictation.interim}</p>}
  </>;
}
