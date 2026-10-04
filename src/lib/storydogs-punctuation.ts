// Accept punctuation/capitalization only; reject added, removed, or reordered words.
export function sameWords(raw: string, cleaned: string) {
  const words = (text: string) => text.normalize('NFC').toLocaleLowerCase('en-US').replace(/[’‘]/g, "'").match(/[\p{L}\p{N}]+(?:'[\p{L}\p{N}]+)*/gu) || [];
  return JSON.stringify(words(raw)) === JSON.stringify(words(cleaned));
}
