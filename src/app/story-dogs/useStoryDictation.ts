"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DictationController, emptyDictationState, recognitionConstructor } from "@/lib/storydogs-dictation";

export function useStoryDictation(onFinal: (target: string, words: string) => void, onComplete?: (target: string, words: string) => void) {
  const [state, setState] = useState(emptyDictationState);
  const callback = useRef(onFinal);
  const completion = useRef(onComplete);
  useLayoutEffect(() => { completion.current = onComplete; }, [onComplete]);
  const controller = useRef<DictationController | null>(null);
  useLayoutEffect(() => { callback.current = onFinal; }, [onFinal]);
  useEffect(() => {
    const instance = new DictationController(recognitionConstructor(window as Window & { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }), setState, (target, words) => callback.current(target, words), (target, words) => completion.current?.(target, words));
    controller.current = instance;
    const leave = () => instance.cancel();
    window.addEventListener("pagehide", leave);
    window.addEventListener("beforeunload", leave);
    return () => {
      window.removeEventListener("pagehide", leave);
      window.removeEventListener("beforeunload", leave);
      instance.dispose();
      controller.current = null;
    };
  }, []);
  return {
    ...state,
    toggle: (target: string) => controller.current?.toggle(target),
    cancel: () => controller.current?.cancel(),
    cancelForTarget: (target: string) => controller.current?.cancelForTarget(target),
  };
}
