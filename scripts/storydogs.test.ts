import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { storyDogs } from "../src/data/storyDogs";
import { createSuggestionRound, newSuggestionDeck, nextSuggestion } from "../src/lib/story-dogs";

test("every response has a distinct bank of at least twelve suggestions", () => {
  assert.equal(storyDogs.length, 7);
  const banks = storyDogs.flatMap(stage => stage.suggestions);
  assert.equal(banks.length, 14);
  for (const bank of banks) {
    assert.ok(bank.length >= 12);
    assert.equal(new Set(bank).size, bank.length);
    assert.ok(bank.every(idea => idea.trim().length > 0));
  }
  for (const stage of storyDogs.slice(2)) assert.ok(stage.connectionReminder);
});

test("shuffle consumes every idea before repeating and avoids the cycle boundary repeat", () => {
  // Reproducible random choices exercise several deck permutations.
  for (let seed = 1; seed < 30; seed++) {
    let state = seed;
    const random = () => ((state = (state * 16807) % 2147483647) - 1) / 2147483646;
    let deck = newSuggestionDeck(12, undefined, random);
    for (let cycle = 0; cycle < 4; cycle++) {
      const seen = new Set<number>();
      for (let n = 0; n < 12; n++) {
        seen.add(deck.current);
        const before = structuredClone(deck);
        const next = nextSuggestion(deck, 12, random);
        assert.deepEqual(deck, before, "rotation must not mutate its previous state");
        assert.notEqual(next.current, deck.current);
        deck = next;
      }
      assert.equal(seen.size, 12);
    }
  }
});

test("a new story refreshes all fourteen decks without changing the previous round", () => {
  const first = createSuggestionRound();
  const before = structuredClone(first);
  const next = createSuggestionRound(first);
  assert.equal(Object.keys(next).length, 14);
  assert.deepEqual(first, before);
  for (const key of Object.keys(next)) {
    assert.notEqual(first[key].current, next[key].current);
    assert.equal(next[key].remaining.length, 11);
  }
});

test("each stage maps to a unique existing dog asset with alternating facing directions", () => {
  const hashes = storyDogs.map((stage, index) => {
    assert.ok(stage.dog.includes(index % 2 ? "looking left" : "looking right"));
    return createHash("sha256").update(readFileSync(`public${stage.image}`)).digest("hex");
  });
  assert.equal(new Set(storyDogs.map(stage => stage.image)).size, 7);
  assert.equal(new Set(hashes).size, 7);
});
