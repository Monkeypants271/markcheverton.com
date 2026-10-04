"use client";

import { useLayoutEffect, useRef, type TextareaHTMLAttributes } from "react";

export function GrowingAnswer(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const field = useRef<HTMLTextAreaElement>(null);
  const measurement = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const node = field.current;
    if (!node) return;
    const grow = () => {
      node.style.height = "auto";
      const mirror = measurement.current;
      if (mirror) {
        const style = window.getComputedStyle(node);
        mirror.style.width = `${node.offsetWidth}px`;
        mirror.style.font = style.font;
        mirror.style.lineHeight = style.lineHeight;
        mirror.style.letterSpacing = style.letterSpacing;
        mirror.style.padding = style.padding;
      }
      // Some browsers omit placeholder wrapping from textarea.scrollHeight.
      // Measure it separately without ever assigning it to the student's value.
      node.style.height = `${Math.max(104, node.scrollHeight + 2, mirror?.getBoundingClientRect().height ?? 0)}px`;
    };
    grow();
    // Wrapping changes when the viewport or panel width changes, too.
    let previousWidth = node.clientWidth;
    const observer = new ResizeObserver(() => {
      if (node.clientWidth !== previousWidth) { previousWidth = node.clientWidth; grow(); }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [props.value, props.placeholder]);
  return <><textarea {...props} ref={field} /><div ref={measurement} className="sd-answer-measure" aria-hidden="true">{String(props.value || props.placeholder || "")}</div></>;
}
