export type CharacterData = {
  character_name: string;
  age: string;
  character_type: string;
  appearance_anchor: string;
  external_goal: string;
  core_fear: string;
  competence: string;
  vulnerability: string;
  distinctive_trait: string;
  important_relationship: string;
  self_belief: string;
  never_do_line: string;
  character_contradiction?: string;
  arc_seed?: string;
};

export const EMPTY_CHARACTER: CharacterData = {
  character_name: "",
  age: "",
  character_type: "",
  appearance_anchor: "",
  external_goal: "",
  core_fear: "",
  competence: "",
  vulnerability: "",
  distinctive_trait: "",
  important_relationship: "",
  self_belief: "",
  never_do_line: "",
};

// These quiet seeds are ready for a future StoryGecko layer. They stay out of the kid-facing card.
export function deriveCharacterSeeds(character: CharacterData): Pick<CharacterData, "character_contradiction" | "arc_seed"> {
  const contradiction = character.external_goal.trim() && (character.core_fear.trim() || character.self_belief.trim())
    ? `${character.external_goal.trim()} may be harder because ${character.core_fear.trim() || character.self_belief.trim()}.`
    : undefined;
  const arcSeed = character.self_belief.trim()
    ? `${character.self_belief.trim()} could change as the story unfolds.`
    : undefined;
  return { character_contradiction: contradiction, arc_seed: arcSeed };
}
