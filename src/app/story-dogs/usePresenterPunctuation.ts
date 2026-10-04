'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { sameWords } from '@/lib/storydogs-punctuation';
import { appendTranscript } from '@/lib/storydogs-dictation';
type Job = { target: string; raw: string; prefix: string; expected: string; appliedRaw: string; phase: 'processing' | 'failed' | 'done'; message: string; controller: AbortController; running: boolean; finished?: boolean; timer?: ReturnType<typeof setTimeout> };
const failureMessage = 'AI punctuation unavailable. Your dictated text has been kept.';
export function usePresenterPunctuation(enabled: boolean, read: (target: string) => string, replace: (target: string, expected: string, value: string) => boolean, ready = false, backupKey = '') {
  const callbacks = useRef({ read, replace });
  useLayoutEffect(() => { callbacks.current = { read, replace }; }, [read, replace]);
  const jobs = useRef<Record<string, Job>>({});
  const detached = useRef<Record<string, { target: string; raw: string; prefix: string; expected: string; appliedRaw: string }>>({});
  const [recovered, setRecovered] = useState<Record<string, string>>({});
  const [view, setView] = useState<Record<string, Job>>({});
  function backup() {
    if (!enabled || !backupKey) return;
    try {
      const pending = Object.values(jobs.current).filter(job => job.raw !== job.appliedRaw).map(({ target, raw, prefix, expected, appliedRaw }) => ({ target, raw, prefix, expected, appliedRaw }));
      pending.push(...Object.values(detached.current));
      if (pending.length) localStorage.setItem(backupKey, JSON.stringify(pending)); else localStorage.removeItem(backupKey);
    } catch { /* The visible pending preview remains available if storage is full. */ }
  }
  function publish() { backup(); setRecovered(Object.fromEntries(Object.entries(detached.current).map(([target, item]) => [target, item.raw]))); setView(Object.fromEntries(Object.entries(jobs.current).map(([key, job]) => [key, { ...job }]))); }
  function keepRaw(job: Job) {
    if (job.raw !== job.appliedRaw && callbacks.current.read(job.target) === job.expected) {
      const value = job.prefix + job.raw;
      if (callbacks.current.replace(job.target, job.expected, value)) { job.expected = value; job.appliedRaw = job.raw; }
    }
  }
  function invalidate(target?: string, preserve = true) {
    for (const key of Object.keys(jobs.current)) if (!target || key === target) {
      const job = jobs.current[key]; job.controller.abort(); clearTimeout(job.timer);
      if (preserve) keepRaw(job);
      delete jobs.current[key];
    }
    if (!target && !preserve) detached.current = {};
    publish();
  }
  useEffect(() => {
    const leave = () => { backup(); for (const job of Object.values(jobs.current)) job.controller.abort(); };
    window.addEventListener('pagehide', leave);
    return () => { window.removeEventListener('pagehide', leave); for (const job of Object.values(jobs.current)) { job.controller.abort(); clearTimeout(job.timer); } jobs.current = {}; };
    // Jobs live in a ref; cleanup must retain pending transcript backups.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, backupKey]);
  useEffect(() => {
    if (!enabled || !ready || !backupKey) return;
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(backupKey) || '[]');
      if (!Array.isArray(saved)) return;
      for (const item of saved) {
        if (!item || typeof item.target !== 'string' || !/^(who|life-want|uh-oh|trouble|worse|climax|change):[01]$/.test(item.target) || typeof item.raw !== 'string' || typeof item.prefix !== 'string' || typeof item.expected !== 'string' || !item.raw) continue;
        if (callbacks.current.read(item.target) !== item.expected) { detached.current[item.target] = { target: item.target, raw: item.raw, prefix: item.prefix, expected: item.expected, appliedRaw: item.appliedRaw || '' }; continue; }
        const job: Job = { ...item, appliedRaw: typeof item.appliedRaw === 'string' ? item.appliedRaw : '', phase: 'failed', message: failureMessage + ' A pending passage was recovered after reload. Select Retry to add punctuation.', controller: new AbortController(), running: false };
        jobs.current[job.target] = job; keepRaw(job);
      }
      publish();
    } catch { /* Never replace a draft with an unreadable backup. */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ready, backupKey]);
  async function process(job: Job) {
    if (jobs.current[job.target] !== job || job.running || job.controller.signal.aborted) return;
    clearTimeout(job.timer); job.timer = undefined; job.running = true;
    const passage = job.raw;
    try {
      const response = await fetch('/api/story-dogs/presenter/punctuate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ passage }), signal: job.controller.signal });
      const data = await response.json();
      if (jobs.current[job.target] !== job || job.controller.signal.aborted) return;
      if (callbacks.current.read(job.target) !== job.expected) { invalidate(job.target, false); return; }
      if (!response.ok) throw Error(data.error || 'Please retry.');
      if (typeof data.text !== 'string' || !sameWords(passage, data.text)) throw Error('The result changed words.');
      const value = job.prefix + data.text;
      if (!callbacks.current.replace(job.target, job.expected, value)) { invalidate(job.target, false); return; }
      job.expected = value; job.appliedRaw = passage; job.running = false;
      job.phase = job.raw === passage ? 'done' : 'processing';
      job.message = job.phase === 'done' ? 'AI punctuation applied.' : 'Adding punctuation…'; publish();
      if (job.raw !== passage) schedule(job, job.finished);
    } catch (error) {
      if (jobs.current[job.target] !== job || job.controller.signal.aborted) return;
      job.running = false; keepRaw(job); job.phase = 'failed';
      job.message = failureMessage + (error instanceof Error ? ` ${error.message}` : ''); publish();
    }
  }
  function schedule(job: Job, immediate = false) {
    if (job.running || job.phase === 'failed') return;
    clearTimeout(job.timer);
    // Batch nearby final results and cap one field to about ten live requests/minute.
    job.timer = setTimeout(() => { void process(job); }, immediate ? 0 : 6000);
  }
  function append(target: string, words: string) {
    if (!enabled || !words.trim()) return;
    let job = jobs.current[target];
    if (!job) {
      const base = callbacks.current.read(target);
      job = { target, raw: '', prefix: appendTranscript(base, 'x').slice(0, -1), expected: base, appliedRaw: '', phase: 'processing', message: 'Adding punctuation…', controller: new AbortController(), running: false };
      jobs.current[target] = job;
    }
    job.raw = appendTranscript(job.raw, words);
    if (job.phase === 'failed') keepRaw(job);
    else { job.phase = 'processing'; job.message = 'Adding punctuation…'; if (!job.running && !job.timer) schedule(job, job.appliedRaw === ''); }
    publish();
  }
  function complete(target: string) { const job = jobs.current[target]; if (enabled && job) { job.finished = true; if (job.raw !== job.appliedRaw) schedule(job, true); } }
  function retry(target: string) {
    const job = jobs.current[target]; if (!job || job.phase !== 'failed' || callbacks.current.read(target) !== job.expected) return;
    job.phase = 'processing'; job.message = 'Adding punctuation…'; job.controller = new AbortController(); publish(); schedule(job, true);
  }
  function undo(target: string) {
    const job = jobs.current[target]; if (!job || job.phase !== 'done') return;
    callbacks.current.replace(target, job.expected, job.prefix + job.raw); invalidate(target, false);
  }
  function begin(target: string) { invalidate(target); }
  return { view, recovered, append, begin, complete, invalidate, retry, undo };
}
