type StudentStepHelp = { tips: [string, string, string]; example: string };

// Short, student-facing help for independent writers in grades 4–5.
// Longer teaching notes remain in storyDogsHelp.ts and the printable guide.
export const storyDogsStudentHelp: Record<string, StudentStepHelp> = {
  who: {
    tips: [
      "Give your hero a name and one interesting detail. Your hero can be a person, an animal, or someone you invent!",
      "Choose something they find hard or scary. This gives them a chance to grow.",
      "Show a detail through an action: what does your hero do?",
    ],
    example: "Pip is a dragon who breathes flowers. Pip is afraid to ask for help, so Pip hides mistakes.",
  },
  "life-want": {
    tips: [
      "Describe a normal day for your hero. Where are they, and what do they do?",
      "Choose one thing they really want. It can be small or huge!",
      "Explain why it matters. Try finishing: ‘They want this because…’",
    ],
    example: "Pip grows flowers alone after school. Pip wants to join the garden fair because Pip hopes to make a friend.",
  },
  "uh-oh": {
    tips: [
      "Make something change your hero’s normal day. Something could arrive, disappear, or go wrong.",
      "Connect this change to what your hero wants.",
      "Let your hero choose what to do next. What is their first plan?",
    ],
    example: "The fair’s flowers wilt! Pip decides to grow new ones with flower breath to help the fair.",
  },
  trouble: {
    tips: [
      "Put a problem in the way of your hero’s plan. Use something connected to your story so far.",
      "Let your hero try to fix it.",
      "Make that attempt lead to another problem. Try: ‘They try…, but then…’",
    ],
    example: "Pip’s flowers grow vines across the gate. Pulling the vines knocks pots into the path, blocking visitors.",
  },
  worse: {
    tips: [
      "Make the same problem harder. Maybe time is running out, supplies are missing, or a friend feels hurt.",
      "Choose something your hero might lose or miss if they fail.",
      "Connect it to their wish. Why does your hero care so much?",
    ],
    example: "The fair opens soon! Pip refuses help and could miss the fair—and the chance to make a friend.",
  },
  climax: {
    tips: [
      "Bring your hero face-to-face with the biggest problem. What must they do now?",
      "Give them a difficult choice. They might tell the truth, try again, or ask for help.",
      "Show how their choice changes things. Use a skill or clue you already put in the story.",
    ],
    example: "Pip finally asks for help. With a friend’s tools and Pip’s flower breath, they turn the vines into an arch.",
  },
  change: {
    tips: [
      "Look back at your hero at the start. What have they learned or changed?",
      "Show the change with something they do, not just ‘They are happy.’",
      "Describe life after the big moment. Your ending does not have to be perfect!",
    ],
    example: "Pip now asks a friend to garden together. Pip still breathes flowers, but no longer tries to do everything alone.",
  },
};
