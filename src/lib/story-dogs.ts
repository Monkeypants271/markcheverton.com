import { storyDogs } from "@/data/storyDogs";

export type SuggestionDeck = { current: number; remaining: number[] };
export type SuggestionRound = Record<string, SuggestionDeck>;

// Each field owns a shuffled deck. A new cycle avoids repeating its last idea.
export function newSuggestionDeck(size: number, previous?: number, random = Math.random): SuggestionDeck {
  const order = Array.from({ length: size }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  if (order.length > 1 && order[0] === previous) {
    [order[0], order[1]] = [order[1], order[0]];
  }
  return { current: order[0], remaining: order.slice(1) };
}

export function nextSuggestion(deck: SuggestionDeck, size: number, random = Math.random): SuggestionDeck {
  return deck.remaining.length
    ? { current: deck.remaining[0], remaining: deck.remaining.slice(1) }
    : newSuggestionDeck(size, deck.current, random);
}

export function createSuggestionRound(previous: SuggestionRound = {}): SuggestionRound {
  return Object.fromEntries(storyDogs.flatMap(stage => stage.suggestions.map((bank, index) => {
    const key = `${stage.id}-${index}`;
    return [key, newSuggestionDeck(bank.length, previous[key]?.current)];
  })));
}
