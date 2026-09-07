import type { CharacterData } from "./characterData";

export type CharacterQuestion = {
  id: keyof CharacterData;
  title: string;
  prompt: string;
  helper?: string;
  helperExamples?: string[];
  placeholder: string;
  kind?: "identity";
};

export const CHARACTER_QUESTIONS: CharacterQuestion[] = [
  {
    id: "character_name",
    title: "Who is your character?",
    prompt: "Start with the basics. What are they called, and what are they like?",
    placeholder: "Their name",
    kind: "identity",
  },
  {
    id: "external_goal",
    title: "What do they want more than anything?",
    prompt: "What does your character want more than anything right now?",
    helper: "Maybe they want to win a race, find a missing pet, make a best friend, become famous, save their town, or catch whoever keeps stealing their socks.",
    placeholder: "They want...",
  },
  {
    id: "core_fear",
    title: "What are they afraid of?",
    prompt: "What scares your character the most?",
    helper: "Maybe dark caves, being laughed at, disappointing someone, giant spiders, speaking in front of the class, or accidentally turning into a chicken.",
    placeholder: "They are afraid that...",
  },
  {
    id: "competence",
    title: "What are they really good at?",
    prompt: "What can your character do better than most people?",
    helper: "Maybe drawing, climbing, solving puzzles, baking, remembering everything, talking to animals, or sneezing fire.",
    placeholder: "They are great at...",
  },
  {
    id: "vulnerability",
    title: "What is their trouble spot?",
    prompt: "What is something your character struggles with, messes up, or wishes nobody noticed?",
    helper: "Maybe sports, telling the truth, making friends, singing, asking for help, controlling their magic, or keeping a secret for more than six minutes.",
    placeholder: "They struggle with...",
  },
  {
    id: "distinctive_trait",
    title: "What makes them unforgettable?",
    prompt: "Give your character one strange habit, obsession, favorite saying, object, pet peeve, or funny thing they always do.",
    helper: "Maybe they wear two different shoes, name every sandwich, collect broken buttons, argue with squirrels, carry a lucky spoon, or hiccup whenever someone lies.",
    placeholder: "They always...",
  },
  {
    id: "important_relationship",
    title: "Who matters most to them?",
    prompt: "Who does your character care about most, and why?",
    helper: "Maybe a parent, best friend, little sister, annoying brother, grandparent, teacher, rival, pet lizard, or talking backpack.",
    placeholder: "They care about...",
  },
  {
    id: "self_belief",
    title: "What might they be wrong about?",
    prompt: "What does your character believe about themselves that might not actually be true?",
    helper: "Maybe they think: Nobody likes me. I have to be perfect. Asking for help is weak. I'm not brave. Everyone is better than me. I can't trust anyone.",
    placeholder: "They believe...",
  },
  {
    id: "never_do_line",
    title: "Story trouble!",
    prompt: "What would make your character do something they swore they would NEVER do?",
    helperExamples: [
      "Maybe someone threatens their robot... so they climb onto a moving train to save it.",
      "Their little brother is trapped... so they enter the haunted basement they've always been afraid of.",
      "A bully steals their best friend's notebook... so they finally stand up to them.",
      "Their town is in danger... so they use the magic they've been scared to try.",
      "Someone calls their pet dragon ugly... so they challenge the school champion to a duel.",
      "Or...",
    ],
    placeholder: "They might break their promise if...",
  },
];
