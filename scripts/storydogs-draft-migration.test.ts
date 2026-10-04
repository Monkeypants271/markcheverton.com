import assert from 'node:assert/strict';
import test from 'node:test';
import { draftKey } from '../src/data/storyDogs';
import { teacherDraftKey, preservedDraftsKey, readDraft, mergeTeacherDraft, preservedDrafts } from '../src/lib/storydogs-draft-migration';
const draft = (text: string) => JSON.stringify({ version: 1, answers: { who: [text, ''] } });
function storage() { const map = new Map<string, string>(); return { getItem: (key: string) => map.get(key) || null, setItem: (key: string, value: string) => { map.set(key, value); }, removeItem: (key: string) => { map.delete(key); } }; }
test('choosing either draft preserves both originals before replacing the working public story', () => {
  for (const source of ['public','teacher'] as const) {
    const s=storage();s.setItem(draftKey,draft('Public original'));s.setItem(teacherDraftKey,draft('Teacher original'));
    const result=mergeTeacherDraft(s,source);
    assert.equal(result.answers.who[0],source==='teacher'?'Teacher original':'Public original');
    assert.equal(readDraft(s.getItem(draftKey)).who[0],result.answers.who[0]);assert.equal(s.getItem(teacherDraftKey),null);
    assert.deepEqual(preservedDrafts(s).map(item=>item.answers.who[0]),['Public original','Teacher original']);
  }
});
test('teacher-only migration and later public resets keep the preserved teacher copy',()=>{
 const s=storage();s.setItem(teacherDraftKey,draft('Teacher story'));mergeTeacherDraft(s,'teacher');s.removeItem(draftKey);
 assert.equal(preservedDrafts(s)[0].answers.who[0],'Teacher story');assert.equal(s.getItem(teacherDraftKey),null);
});
test('backup failure never replaces or deletes either original',()=>{
 const s=storage();s.setItem(draftKey,draft('Public'));s.setItem(teacherDraftKey,draft('Teacher'));
 assert.throws(()=>mergeTeacherDraft({...s,setItem:(key,value)=>{if(key===preservedDraftsKey)throw Error('quota');s.setItem(key,value);}},'teacher'));
 assert.equal(readDraft(s.getItem(draftKey)).who[0],'Public');assert.equal(readDraft(s.getItem(teacherDraftKey)).who[0],'Teacher');
});
