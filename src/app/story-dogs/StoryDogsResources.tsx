'use client';
import { useEffect, useRef } from 'react';
import { outlineText } from '@/data/storyDogs';
import type { PreservedDraft } from '@/lib/storydogs-draft-migration';
export function StoryDogsResources({ archived = [] }: { archived?: PreservedDraft[] }) {
  const dialog = useRef<HTMLDialogElement>(null); const trigger = useRef<HTMLButtonElement>(null);
  const isOpen = useRef(false);
  const position = useRef({ x: 0, y: 0, overflow: '' });
  function restore() {
    isOpen.current = false;
    document.body.style.overflow = position.current.overflow;
    window.scrollTo(position.current.x, position.current.y);
    trigger.current?.focus({ preventScroll: true });
  }
  useEffect(() => () => { if (isOpen.current) document.body.style.overflow = position.current.overflow; }, []);
  function open() {
    position.current = { x: window.scrollX, y: window.scrollY, overflow: document.body.style.overflow };
    dialog.current?.showModal(); isOpen.current = true; document.body.style.overflow = 'hidden';
    dialog.current?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
  }
  function downloadDraft(item: PreservedDraft) {
    const url = URL.createObjectURL(new Blob([outlineText(item.answers)], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `preserved-${item.source}-story.txt`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <>
    <button ref={trigger} type="button" className="sd-button sd-resources-trigger" aria-haspopup="dialog" aria-controls="sd-resources-panel" onClick={open}>Resources</button>
    <dialog id="sd-resources-panel" ref={dialog} className="sd-resources-dialog sd-no-print" aria-labelledby="sd-resources-title" onClose={restore}>
      <div className="sd-resources-dialog-header"><h2 id="sd-resources-title">StoryDogs Resources</h2><button type="button" className="sd-button" onClick={() => dialog.current?.close()}>Close Resources</button></div>
      <p>Lead a group story by projecting the questions and recording students’ choices, or let students write individual stories at their own pace. Typing works without microphone equipment.</p>
      <article><h3>Printable Teacher Guide</h3><p>Seven pages with teaching scripts, hints, discussion prompts, and Pip’s connected example—one page for each story step.</p><div className="sd-resource-actions"><a href="/downloads/storydogs-teacher-guide.pdf" target="_blank" rel="noopener noreferrer">Preview PDF <span className="sr-only">(opens in a new tab)</span></a><a href="/downloads/storydogs-teacher-guide.pdf" download="storydogs-teacher-guide.pdf" target="_blank" rel="noopener noreferrer">Download Teacher Guide (PDF)<span className="sr-only"> (may open in a new tab)</span></a></div></article>
      {archived.length > 0 && <section aria-labelledby="sd-preserved-title"><h3 id="sd-preserved-title">Your preserved stories</h3><p>These are copies of your original public and teacher drafts from before the views were combined. Download them at any time.</p>{archived.map((item, index) => <button className="sd-button" type="button" key={index} onClick={() => downloadDraft(item)}>Download preserved {item.source === 'teacher' ? 'teacher' : 'public'} story{archived.filter(other => other.source === item.source).length > 1 ? ` (${index + 1})` : ''}</button>)}</section>}
      <p className="sd-presenter-link"><a href="/story-dogs/presenter/login">Presenter Login</a></p>
    </dialog>
  </>;
}
