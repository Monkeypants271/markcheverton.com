import assert from "node:assert/strict";
import test from "node:test";
import { appendTranscript, DictationController, recognitionConstructor, type BrowserRecognition, type DictationState, type RecognitionEvent } from "../src/lib/storydogs-dictation";

class RecognitionMock implements BrowserRecognition {
  static instances: RecognitionMock[] = [];
  lang = ""; continuous = false; interimResults = false;
  onstart: BrowserRecognition["onstart"] = null;
  onend: BrowserRecognition["onend"] = null;
  onresult: BrowserRecognition["onresult"] = null;
  onerror: BrowserRecognition["onerror"] = null;
  onnomatch: BrowserRecognition["onnomatch"] = null;
  starts = 0; stops = 0; aborts = 0;
  constructor() { RecognitionMock.instances.push(this); }
  start() { this.starts++; }
  stop() { this.stops++; }
  abort() { this.aborts++; }
}
function result(...items: [string, boolean][]): RecognitionEvent {
  return { resultIndex: 0, results: items.map(([transcript, isFinal]) => ({ isFinal, 0: { transcript } })) };
}
function fixture(Recognition = RecognitionMock) {
  const answers: Record<string, string> = { a: "Existing answer.", b: "Second answer." };
  let state: DictationState;
  const controller = new DictationController(Recognition, value => { state = value; }, (target, words) => { answers[target] = appendTranscript(answers[target] || "", words); });
  return { controller, answers, state: () => state!, recognition: () => RecognitionMock.instances.at(-1)! };
}

test("detects actual standard/prefixed support; unsupported browsers do not start", () => {
  assert.equal(recognitionConstructor({}), undefined);
  assert.equal(recognitionConstructor({ SpeechRecognition: RecognitionMock }), RecognitionMock);
  assert.equal(recognitionConstructor({ webkitSpeechRecognition: RecognitionMock }), RecognitionMock);
  assert.equal(recognitionConstructor({ SpeechRecognition: {}, webkitSpeechRecognition: RecognitionMock }), RecognitionMock);
  let state: DictationState | undefined;
  const controller = new DictationController(undefined, value => { state = value; }, () => assert.fail());
  controller.toggle("a"); assert.equal(state!.supported, false); assert.equal(state!.phase, "idle"); controller.dispose();
});

test("starts only on click; previews interim words and commits final indexes exactly once", t => {
  const count = RecognitionMock.instances.length;
  const f = fixture(); t.after(() => f.controller.dispose());
  assert.equal(RecognitionMock.instances.length, count);
  f.controller.toggle("a"); const r = f.recognition();
  assert.equal(r.lang, "en-US"); assert.equal(r.continuous, true); assert.equal(r.interimResults, true);
  assert.equal(f.state().phase, "starting"); r.onstart!(); assert.equal(f.state().phase, "listening");
  r.onresult!(result(["new words", false])); assert.equal(f.answers.a, "Existing answer."); assert.equal(f.state().interim, "new words");
  r.onresult!(result(["New words.", true], ["unfinished", false]));
  r.onresult!(result(["New words.", true], ["unfinished revised", false]));
  assert.equal(f.answers.a, "Existing answer. New words."); assert.equal(f.state().interim, "unfinished revised");
  r.onresult!({ ...result(["New words.", true], ["More detail.", true]), resultIndex: 1 });
  assert.equal(f.answers.a, "Existing answer. New words. More detail."); assert.equal(f.state().interim, "");
  f.controller.toggle("a"); assert.equal(r.stops, 1); assert.equal(f.state().phase, "stopping");
  r.onresult!(result(["New words.", true], ["More detail.", true], ["Last words.", true])); r.onend!();
  assert.equal(f.answers.a, "Existing answer. New words. More detail. Last words."); assert.equal(f.state().phase, "idle"); assert.equal(f.state().target, null);
});

test("switch waits for end, discards late words, and binds the new session to its own answer", t => {
  const f = fixture(); t.after(() => f.controller.dispose());
  f.controller.toggle("a"); const first = f.recognition(); first.onstart!();
  const late = first.onresult!; const lateStart = first.onstart!;
  const count = RecognitionMock.instances.length;
  f.controller.toggle("b"); assert.equal(first.aborts, 1); assert.equal(RecognitionMock.instances.length, count);
  late(result(["must not be inserted", true])); assert.equal(f.answers.a, "Existing answer.");
  first.onend!(); const second = f.recognition(); assert.notEqual(second, first); second.onstart!();
  lateStart(); late(result(["still stale", true])); second.onresult!(result(["New second answer.", true]));
  assert.equal(f.answers.a, "Existing answer."); assert.equal(f.answers.b, "Second answer. New second answer."); assert.equal(f.state().target, "b");
});

test("manual edits, reset/outline cancellation and disposal invalidate all delayed results", t => {
  const f = fixture(); t.after(() => f.controller.dispose());
  f.controller.toggle("a"); const r = f.recognition(); r.onstart!(); const late = r.onresult!;
  f.controller.cancelForTarget("b"); assert.equal(r.aborts, 0);
  f.controller.cancelForTarget("a"); f.answers.a = "Typed correction."; late(result(["late words", true])); assert.equal(f.answers.a, "Typed correction.");
  r.onend!(); f.controller.toggle("a"); const next = f.recognition(); const nextLate = next.onresult!;
  f.controller.cancel(); f.answers.a = ""; nextLate(result(["cannot restore cleared draft", true])); assert.equal(f.answers.a, "");
  f.controller.dispose(); nextLate(result(["unmounted", true])); assert.equal(f.answers.a, ""); assert.equal(next.onresult, null);
});

test("denial, missing input, silence and service failure restore idle state without changing answers", () => {
  for (const error of ["not-allowed", "audio-capture", "no-speech", "network", "service-not-allowed"]) {
    const f = fixture(); f.controller.toggle("a"); f.recognition().onerror!({ error });
    assert.equal(f.state().phase, "idle"); assert.equal(f.state().target, null); assert.ok(f.state().message.includes("typ")); assert.equal(f.answers.a, "Existing answer."); f.controller.dispose();
  }
});

test("unexpected end clears Listening and never restarts automatically", t => {
  const f = fixture(); t.after(() => f.controller.dispose()); f.controller.toggle("a"); const r = f.recognition(); r.onstart!();
  const count = RecognitionMock.instances.length; r.onend!(); assert.equal(f.state().phase, "idle"); assert.equal(f.state().interim, ""); assert.equal(RecognitionMock.instances.length, count);
});

test("a missing end event times out safely without starting a queued microphone", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const f = fixture(); t.after(() => f.controller.dispose()); f.controller.toggle("a"); f.recognition().onstart!();
  f.controller.toggle("b"); const count = RecognitionMock.instances.length; t.mock.timers.tick(5000);
  assert.equal(f.state().phase, "idle"); assert.equal(f.state().target, null); assert.equal(RecognitionMock.instances.length, count); assert.match(f.state().message, /microphone indicator/);
});

test("appending preserves existing whitespace, paragraphs and punctuation", () => {
  assert.equal(appendTranscript("", " hello "), "hello");
  assert.equal(appendTranscript("One\n", "Two"), "One\nTwo");
  assert.equal(appendTranscript("One", "Two"), "One Two");
  assert.equal(appendTranscript("One", ", two"), "One, two");
  assert.equal(appendTranscript("Keep exactly  ", ""), "Keep exactly  ");
});

test('presenter completion receives only new finalized words after an explicit stop and actual end', t => {
  const completed: [string, string][] = [];
  const controller = new DictationController(RecognitionMock, () => {}, () => {}, (target, words) => completed.push([target, words]));
  t.after(() => controller.dispose());
  controller.toggle('a'); const r = RecognitionMock.instances.at(-1)!; r.onstart!();
  r.onresult!(result(['pip finds', true], ['moon seeds', false]));
  controller.toggle('a'); assert.deepEqual(completed, []);
  r.onresult!(result(['pip finds', true], ['moon seeds', true])); r.onend!();
  assert.deepEqual(completed, [['a', 'pip finds moon seeds']]);
});

test('cancelled and switched sessions never trigger punctuation; normal browser end completes finalized words', t => {
  const completed: string[] = [];
  const controller = new DictationController(RecognitionMock, () => {}, () => {}, (_target, words) => completed.push(words));
  t.after(() => controller.dispose());
  for (const action of ['cancel', 'switch', 'silence']) {
    controller.toggle('a'); const r = RecognitionMock.instances.at(-1)!; r.onstart!(); r.onresult!(result(['raw words', true]));
    if (action === 'cancel') controller.cancel();
    if (action === 'switch') controller.toggle('b');
    r.onend!();
    if (action === 'switch') { controller.cancel(); RecognitionMock.instances.at(-1)!.onend!(); }
  }
  assert.deepEqual(completed, ['raw words']);
});
