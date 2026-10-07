"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const messages: Record<string, string> = {
  who: "Meet the hero!",
  "life-want": "A wish is brewing!",
  "uh-oh": "Uh-oh unlocked!",
  trouble: "Trouble has arrived!",
  worse: "Yikes. Worse!",
  climax: "Big moment ahead!",
  change: "Story complete!",
};
const pawColors = ["#b62e46", "#006b70", "#80396c", "#ad4918", "#244c82", "#28633d"];
type Celebration = { anchor: Element; top: number };

export function DogCompletion({ complete, stageId, nextId }: { complete: boolean; stageId: string; nextId?: string }) {
  // Restored complete answers do not replay; only clearing a field rearms them.
  const celebrated = useRef(complete);
  const [celebration, setCelebration] = useState<Celebration | null>(null);

  useEffect(() => {
    if (!complete) {
      celebrated.current = false;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCelebration(null);
      return;
    }
    if (celebrated.current) return;
    let timer: number | undefined;
    const stage = document.getElementById(`sd-stage-${stageId}`);
    const next = nextId ? document.getElementById(`sd-stage-${nextId}`) : document.querySelector(".sd-outline-action");
    let previousScrollY = window.scrollY;
    const gapCenter = () => {
      const previousBottom = (stage?.querySelector(".sd-panel") || stage)?.getBoundingClientRect().bottom;
      const nextTop = (next?.querySelector(".sd-panel") || next)?.getBoundingClientRect().top;
      return previousBottom !== undefined && nextTop !== undefined ? (previousBottom + nextTop) / 2 : null;
    };
    function celebrate() {
      if (celebrated.current || !next) return;
      const center = gapCenter();
      if (center === null) return;
      celebrated.current = true;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      setCelebration({ anchor: next, top: center - next.getBoundingClientRect().top });
      timer = window.setTimeout(() => setCelebration(null), 1500);
    }
    function onFocus(event: FocusEvent) {
      if (!(event.target instanceof Node) || !next?.contains(event.target) || celebrated.current) return;
      // A stage-link jump can hide the gap behind the sticky navigation.
      // Reveal that gap only for an armed, animated forward celebration.
      const center = gapCenter();
      const navigation = document.querySelector(".sd-navigation");
      if (center !== null && navigation && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const visibleTop = navigation.getBoundingClientRect().bottom + 100;
        if (center < visibleTop) window.scrollBy({ top: center - visibleTop, behavior: "instant" });
      }
      celebrate();
    }
    function onScroll() {
      const movingForward = window.scrollY > previousScrollY;
      previousScrollY = window.scrollY;
      if (!movingForward || !stage || !next) return;
      const center = gapCenter();
      if (center !== null && center < window.innerHeight * .8 && next.getBoundingClientRect().bottom > 0 && stage.getBoundingClientRect().top < 0) celebrate();
    }
    document.addEventListener("focusin", onFocus);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("focusin", onFocus);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [complete, stageId, nextId]);

  if (!complete || !celebration) return null;
  return createPortal(<div className="sd-forward-celebration" aria-hidden="true" style={{ top: celebration.top }}>
    <svg className="sd-paw-trail" viewBox="0 0 340 120" focusable="false">
      {pawColors.map((color, index) => <g key={color} transform={`translate(${24 + index * 54},${index % 2 ? 91 : 76}) rotate(${68 + index * 5})`}>
        <g className="sd-scampering-paw" fill={color} stroke="#fff4cd" strokeWidth="1.2" style={{ "--paw-delay": `${index * 90}ms` } as CSSProperties}>
          <path d="M-9 5 C-12 13 -6 17 0 14 C7 18 13 12 9 5 C6-3 -5-4 -9 5Z" />
          <ellipse cx="-10" cy="-4" rx="4" ry="5.5" transform="rotate(-24 -10 -4)" />
          <ellipse cx="-4" cy="-11" rx="4" ry="5.5" transform="rotate(-8 -4 -11)" />
          <ellipse cx="5" cy="-10" rx="4" ry="5.5" transform="rotate(14 5 -10)" />
          <ellipse cx="11" cy="-3" rx="4" ry="5.5" transform="rotate(30 11 -3)" />
        </g>
      </g>)}
    </svg>
    <div className="sd-story-sticker">
      <svg className="sd-sticker-paper" viewBox="0 0 280 86" focusable="false">
        <path d="M17 10 Q30 0 48 7 L230 4 Q259 0 267 20 L274 57 Q280 78 256 79 L45 82 Q15 88 9 66 L4 31 Q1 15 17 10Z" fill="#fff0a5" stroke="#fff9e2" strokeWidth="8" />
        <path d="M17 10 Q30 0 48 7 L230 4 Q259 0 267 20 L274 57 Q280 78 256 79 L45 82 Q15 88 9 66 L4 31 Q1 15 17 10Z" fill="none" stroke="#8b294b" strokeWidth="3" />
        <path d="M239 78 L263 58 L267 73Z" fill="#efad55" stroke="#8b294b" strokeWidth="2" />
        <path d="M18 28 L24 22 M21 48 L28 49 M251 22 L255 29" stroke="#006b70" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span>{messages[stageId]}</span>
    </div>
  </div>, celebration.anchor);
}
