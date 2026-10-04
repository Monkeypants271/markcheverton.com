import { draftKey, storyDogs, type StoryAnswers } from '@/data/storyDogs';
export const teacherDraftKey = draftKey + ':teachers';
export const preservedDraftsKey = draftKey + ':preserved';
export type PreservedDraft = { source: 'public' | 'teacher'; answers: StoryAnswers };
export function readDraft(raw: string | null): StoryAnswers {
  if (!raw) return {};
  try {
    const data = JSON.parse(raw);
    if (data.version !== 1 || !data.answers || typeof data.answers !== 'object') return {};
    return Object.fromEntries(storyDogs.map(stage => [stage.id, stage.questions.map((_, i) => typeof data.answers[stage.id]?.[i] === 'string' ? data.answers[stage.id][i] : '')]));
  } catch { return {}; }
}
export function hasAnswers(answers: StoryAnswers) { return Object.values(answers).some(pair => pair.some(answer => answer.length > 0)); }
export function preservedDrafts(storage: Pick<Storage, 'getItem'>): PreservedDraft[] {
  try {
    const value = JSON.parse(storage.getItem(preservedDraftsKey) || '[]');
    return Array.isArray(value) ? value.filter(item => item?.source === 'public' || item?.source === 'teacher').map(item => ({ source: item.source, answers: readDraft(JSON.stringify({ version: 1, answers: item.answers })) })).filter(item => hasAnswers(item.answers)) : [];
  } catch { return []; }
}
// Back up both originals before replacing the working draft or removing the old key.
// If a write fails, the old teacher key remains and migration is offered again.
export function mergeTeacherDraft(storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>, source: 'public' | 'teacher') {
  const current = readDraft(storage.getItem(draftKey)); const teacher = readDraft(storage.getItem(teacherDraftKey));
  const archived = preservedDrafts(storage);
  for (const item of [{ source: 'public' as const, answers: current }, { source: 'teacher' as const, answers: teacher }]) {
    if (hasAnswers(item.answers) && !archived.some(prior => prior.source === item.source && JSON.stringify(prior.answers) === JSON.stringify(item.answers))) archived.push(item);
  }
  storage.setItem(preservedDraftsKey, JSON.stringify(archived));
  const selected = source === 'teacher' ? teacher : current;
  storage.setItem(draftKey, JSON.stringify({ version: 1, answers: selected }));
  storage.removeItem(teacherDraftKey);
  return { answers: selected, archived };
}
