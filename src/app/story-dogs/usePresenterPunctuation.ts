'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { sameWords } from '@/lib/storydogs-punctuation';
type Job = { target: string; raw: string; prefix: string; expected: string; phase: 'processing' | 'failed' | 'done'; message: string; controller: AbortController };
export function usePresenterPunctuation(enabled: boolean, read: (target: string) => string, replace: (target: string, expected: string, value: string) => boolean) {
  const callbacks = useRef({ read, replace });
  useLayoutEffect(() => { callbacks.current = { read, replace }; }, [read, replace]);
  const jobs = useRef<Record<string, Job>>({});
  const [view, setView] = useState<Record<string, Job>>({});
  function publish() { setView(Object.fromEntries(Object.entries(jobs.current).map(([key, job]) => [key, { ...job }]))); }
  function invalidate(target?: string) {
    for (const key of Object.keys(jobs.current)) if (!target || key === target) { jobs.current[key].controller.abort(); delete jobs.current[key]; }
    publish();
  }
  useEffect(() => () => { for (const job of Object.values(jobs.current)) job.controller.abort(); jobs.current = {}; }, []);
  async function process(job: Job) {
    try {
      const response = await fetch('/api/story-dogs/presenter/punctuate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ passage: job.raw }), signal: job.controller.signal });
      const data = await response.json();
      if (jobs.current[job.target] !== job || job.controller.signal.aborted) return;
      if (callbacks.current.read(job.target) !== job.expected) { delete jobs.current[job.target]; publish(); return; }
      if (!response.ok) throw Error(data.error || 'Punctuation failed. Your raw words are safe.');
      if (typeof data.text !== 'string' || !sameWords(job.raw, data.text)) throw Error('The result changed words. Your raw transcript was kept.');
      const value = job.prefix + data.text;
      if (!callbacks.current.replace(job.target, job.expected, value)) return;
      job.expected = value; job.phase = 'done'; job.message = 'AI punctuation applied.'; publish();
    } catch (error) {
      if (jobs.current[job.target] !== job || job.controller.signal.aborted) return;
      job.phase = 'failed'; job.message = 'AI punctuation unavailable. Your dictated text has been kept.' + (error instanceof Error ? ` ${error.message}` : ''); publish();
    }
  }
  function complete(target: string, raw: string) {
    if (!enabled || !raw) return;
    const expected = callbacks.current.read(target);
    if (!expected.endsWith(raw)) return;
    invalidate(target);
    const job: Job = { target, raw, prefix: expected.slice(0, -raw.length), expected, phase: 'processing', message: 'Adding punctuation…', controller: new AbortController() };
    jobs.current[target] = job; publish(); void process(job);
  }
  function retry(target: string) {
    const previous = jobs.current[target]; if (!previous || previous.phase !== 'failed') return;
    if (callbacks.current.read(target) !== previous.expected) { invalidate(target); return; }
    const job = { ...previous, phase: 'processing' as const, message: 'Adding punctuation…', controller: new AbortController() };
    jobs.current[target] = job; publish(); void process(job);
  }
  function undo(target: string) {
    const job = jobs.current[target]; if (!job || job.phase !== 'done') return;
    callbacks.current.replace(target, job.expected, job.prefix + job.raw); invalidate(target);
  }
  return { view, complete, invalidate, retry, undo };
}
