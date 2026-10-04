export type RecognitionResult = { isFinal: boolean; [index: number]: { transcript: string } };
export type RecognitionEvent = { resultIndex: number; results: ArrayLike<RecognitionResult> };
export type BrowserRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onnomatch: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};
export type RecognitionConstructor = new () => BrowserRecognition;
export type DictationState = {
  supported: boolean | null;
  target: string | null;
  feedbackTarget: string | null;
  phase: "idle" | "starting" | "listening" | "stopping";
  interim: string;
  message: string;
};
export const emptyDictationState: DictationState = { supported: null, target: null, feedbackTarget: null, phase: "idle", interim: "", message: "" };

export function recognitionConstructor(browser: { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }): RecognitionConstructor | undefined {
  const candidate = typeof browser.SpeechRecognition === "function" ? browser.SpeechRecognition : browser.webkitSpeechRecognition;
  return typeof candidate === "function" ? candidate as RecognitionConstructor : undefined;
}

export function appendTranscript(answer: string, transcript: string) {
  const words = transcript.trim();
  if (!words) return answer;
  const space = answer && !/\s$/.test(answer) && !/^[,.;:!?]/.test(words) ? " " : "";
  return answer + space + words;
}

export function dictationError(error: string) {
  switch (error) {
    case "not-allowed": return "Microphone access was denied. Allow it in your browser’s site settings, or keep typing.";
    case "audio-capture": return "No microphone is available. Connect one and select it as your computer’s input, or keep typing.";
    case "no-speech": return "No speech was detected. Click Dictate to try again, or keep typing.";
    case "network": return "The speech service could not connect. Check your connection and try again, or keep typing.";
    case "service-not-allowed": return "Browser dictation is blocked or unavailable. Check your browser settings, or keep typing.";
    case "language-not-supported": return "US English dictation is unavailable in this browser. You can still type.";
    case "aborted": return "Dictation ended. Click Dictate to continue, or keep typing.";
    default: return "The speech service could not finish dictation. Try again, or keep typing.";
  }
}

type Session = {
  target: string;
  recognition: BrowserRecognition;
  committed: Set<number>; words: string[];
  acceptResults: boolean;
  stopping: boolean;
  started: boolean;
  timer?: ReturnType<typeof setTimeout>;
};

// A single coordinator owns the microphone. Every callback is bound to its
// session, so stale events cannot land in another field or restore a reset draft.
export class DictationController {
  private current: Session | null = null;
  private pending: string | null = null;
  private disposed = false;
  private state: DictationState;

  constructor(private Recognition: RecognitionConstructor | undefined, private onState: (state: DictationState) => void, private onFinal: (target: string, words: string) => void, private onComplete?: (target: string, words: string) => void) {
    this.state = { ...emptyDictationState, supported: Boolean(Recognition) };
    this.publish({});
  }

  private publish(change: Partial<DictationState>) {
    if (this.disposed) return;
    this.state = { ...this.state, ...change };
    this.onState(this.state);
  }

  toggle(target: string) {
    if (this.disposed || !this.Recognition) return;
    if (!this.current) { this.begin(target); return; }
    if (this.current.target === target) {
      this.pending = null;
      this.stopSession(this.current, this.current.started);
    } else {
      this.pending = target;
      this.stopSession(this.current, false);
    }
  }

  cancel() {
    this.pending = null;
    if (this.current) this.stopSession(this.current, false);
  }

  cancelForTarget(target: string) {
    if (this.current?.target === target || this.pending === target) this.cancel();
  }

  private begin(target: string) {
    if (!this.Recognition || this.disposed) return;
    let recognition: BrowserRecognition;
    try { recognition = new this.Recognition(); }
    catch { this.publish({ target: null, phase: "idle", interim: "", feedbackTarget: target, message: dictationError("service-not-allowed") }); return; }
    const session: Session = { target, recognition, committed: new Set(), words: [], acceptResults: true, stopping: false, started: false };
    this.current = session;
    this.publish({ target, feedbackTarget: target, phase: "starting", interim: "", message: "Getting the microphone ready… Please wait before speaking. Allow microphone access if your browser asks." });
    recognition.onstart = () => {
      if (this.current !== session || this.disposed || session.stopping) return;
      clearTimeout(session.timer);
      session.started = true;
      this.publish({ phase: "listening", message: "Listening… Speak now. Click Stop Dictation when you’re finished." });
    };
    recognition.onresult = event => {
      if (this.current !== session || this.disposed || !session.acceptResults) return;
      for (let index = event.resultIndex; index < event.results.length; index++) {
        const result = event.results[index];
        if (result.isFinal && !session.committed.has(index)) {
          session.committed.add(index);
          const words = result[0]?.transcript.trim();
          if (words) { session.words.push(words); this.onFinal(session.target, words); }
        }
      }
      const interim: string[] = [];
      for (let index = 0; index < event.results.length; index++) {
        if (!event.results[index].isFinal) interim.push(event.results[index][0]?.transcript || "");
      }
      this.publish({ interim: interim.join(" ").trim() });
    };
    recognition.onnomatch = () => {
      if (this.current === session && !session.stopping) this.fail(session, "no-speech");
    };
    recognition.onerror = event => {
      if (this.current !== session || this.disposed) return;
      if (session.stopping && event.error === "aborted") return; // Wait for end before switching.
      this.fail(session, event.error);
    };
    recognition.onend = () => {
      if (this.current !== session || this.disposed) return;
      const passage = session.stopping && session.acceptResults && session.started ? session.words.reduce(appendTranscript, "") : "";
      const next = this.pending;
      this.pending = null;
      this.release(session);
      this.publish({ target: null, phase: "idle", interim: "", message: session.stopping ? "Dictation stopped. You can edit your words." : "Dictation ended. Click Dictate to continue, or keep typing." });
      if (passage) this.onComplete?.(session.target, passage);
      if (next) this.begin(next);
    };
    try {
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = true;
      session.timer = setTimeout(() => {
        if (this.current === session) this.fail(session, "service-not-allowed");
      }, 30000);
      recognition.start();
    } catch (error) {
      this.fail(session, error instanceof Error && (error.name === "NotAllowedError" || error.name === "SecurityError") ? "not-allowed" : "service-not-allowed");
    }
  }

  private stopSession(session: Session, keepFinalResults: boolean) {
    // Cancelling a manually stopping session must also invalidate queued results.
    if (!keepFinalResults) session.acceptResults = false;
    this.publish({ phase: "stopping", interim: "", message: "Stopping microphone…" });
    if (session.stopping) {
      if (!keepFinalResults) { try { session.recognition.abort(); } catch { /* Watchdog finishes cleanup. */ } }
      return;
    }
    session.stopping = true;
    clearTimeout(session.timer);
    session.timer = setTimeout(() => {
      if (this.current !== session) return;
      this.pending = null;
      this.release(session);
      try { session.recognition.abort(); } catch { /* The browser may already have stopped. */ }
      this.publish({ target: null, phase: "idle", interim: "", message: "Dictation did not finish stopping. A stop was requested; check your browser’s microphone indicator before trying again. You can still type." });
    }, 5000);
    try {
      if (keepFinalResults) session.recognition.stop();
      else session.recognition.abort();
    } catch { this.fail(session, "aborted"); }
  }

  private release(session: Session) {
    clearTimeout(session.timer);
    session.acceptResults = false;
    session.recognition.onstart = null;
    session.recognition.onend = null;
    session.recognition.onresult = null;
    session.recognition.onerror = null;
    session.recognition.onnomatch = null;
    if (this.current === session) this.current = null;
  }

  private fail(session: Session, error: string) {
    this.pending = null;
    this.release(session);
    try { session.recognition.abort(); } catch { /* Preserve answers even if abort fails. */ }
    this.publish({ target: null, feedbackTarget: session.target, phase: "idle", interim: "", message: dictationError(error) });
  }

  dispose() {
    this.disposed = true;
    this.pending = null;
    if (this.current) {
      const session = this.current;
      this.release(session);
      try { session.recognition.abort(); } catch { /* No callbacks survive unmount. */ }
    }
  }
}
