export type StoryStepHelp = {
  purpose: string;
  guidance: string;
  questions: string[];
  example: string;
  starters: [string, string];
  teacherScript: string;
  listenFor: string;
};

// Editable teaching notes. Pip's example connects the seven steps without
// becoming a suggested answer or being included in a student's outline.
export const storyDogsHelp: Record<string, StoryStepHelp> = {
  who: {
    purpose: "Give readers someone to care about. Your hero is the main character, even if they do not have superpowers or feel brave yet.",
    guidance: "Introduce a name and a few details that matter: what your hero likes, what they can do, or how they act around others. Then choose one fear or difficulty that could affect their choices. You do not need their whole life story. Pick something you can show happening in a scene.",
    questions: ["What would we notice if we spent five minutes with your hero?", "What can they do well, and what feels difficult?", "When that difficult thing happens, what do they do?"],
    example: "Pip is a tiny dragon who breathes flowers instead of fire. Pip loves growing things but is afraid to ask for help, so Pip hides mistakes and tries to fix everything alone.",
    starters: ["My hero is ___. One thing that makes them interesting is ___.", "They find ___ difficult. When it happens, they usually ___."],
    teacherScript: "We are choosing someone to follow through the story. They need something interesting about them and something that is hard for them. That difficulty gives us room to see them grow. A hero can start out worried, quiet, or unsure.",
    listenFor: "A specific character and a difficulty that could shape an action. If a student says ‘nice’ or ‘scared,’ ask what the character does that lets us see it. Help students invent fictional difficulties; they do not need to share personal worries.",
  },
  "life-want": {
    purpose: "Show the starting point and give your hero a reason to act. A wish gives the story a direction; knowing why it matters helps readers care.",
    guidance: "Describe an ordinary day before anything changes. Choose a place, a routine, or someone your hero spends time with. Then name something they want and explain why. A wish can be small, like making a friend, or enormous, like finding a lost moon. Make it important to this particular hero.",
    questions: ["What does your hero do on a normal day?", "What do they hope will happen or change?", "If they got their wish, what would it mean to them?"],
    example: "Pip usually tends a little flower patch alone after school. Pip wants to help at the school garden fair and make a friend, because growing beautiful things feels better when someone shares the fun.",
    starters: ["On an ordinary day, my hero ___ in ___.", "They want ___ because ___."],
    teacherScript: "Let’s take a picture of life before the adventure. Now let’s give our hero a wish. ‘They want a prize’ tells us what they want. ‘They want a prize because they hope their family will notice their hard work’ tells us why we should care.",
    listenFor: "Both an ordinary life and a want with a personal reason. If the wish is vague, ask how we would know it had come true. Keep the hero’s earlier difficulty in mind; wanting a friend while being afraid to ask for help gives later choices meaning.",
  },
  "uh-oh": {
    purpose: "Interrupt the ordinary day. This is the change that starts the adventure, followed by the hero’s decision to do something about it.",
    guidance: "Something arrives, disappears, breaks, or suddenly becomes possible. Connect that change to your hero’s wish. Then give the hero a choice: what will they try? ‘A strange thing happened’ is a beginning; choosing to investigate, help, or try a new plan moves the story forward.",
    questions: ["What happens that makes today different?", "Why does that change matter to this hero?", "What do they decide to do first?"],
    example: "On the morning of the garden fair, Pip discovers that the display flowers have wilted. Pip decides to grow replacements with flower breath, hoping to help the fair and meet the other young gardeners.",
    starters: ["One day, ___ happens, and now ___.", "Because of this, my hero decides to ___."],
    teacherScript: "Up to now, we have shown ordinary life and a wish. Here we tip the first domino: something changes. Our hero does not have to choose perfectly, but they do need to choose an action. What will they do because of this new situation?",
    listenFor: "A clear change and an action that follows from it. If the answer introduces an unrelated surprise, ask how it affects the wish. If another character makes every decision, ask what choice belongs to the hero.",
  },
  trouble: {
    purpose: "Put something in the way of the hero’s goal. Their attempt to solve it creates the next part of the story.",
    guidance: "Use a problem that grows out of what your hero has already done. It could be a confusing clue, a misunderstanding, a missing tool, or a plan that works a little too well. Let the hero try something. The attempt can partly help, backfire, or reveal a new difficulty. Explain the connection so the events belong together.",
    questions: ["What stops the hero’s first plan from working?", "What do they try to get past that problem?", "Because they try that, what new problem appears?"],
    example: "Pip’s new flowers grow tangled vines across the garden gate. Pip tries to pull them loose alone, but the vines drag pots into the path. Now visitors cannot get in, and the entrance is a mess.",
    starters: ["My hero tries to ___, but ___ gets in the way.", "They try ___ to fix it. Because of that, ___."],
    teacherScript: "Trouble gives our hero something to work on. We want a chain of events: this happens, so they try that, and their attempt leads to something new. A problem does not need a villain. A tangled gate or a misunderstanding can be plenty of trouble.",
    listenFor: "An obstacle, an attempt, and a result connected by ‘because’ or ‘so.’ If a student lists random problems, ask which one comes from the hero’s last action. If everything is solved already, ask what remains difficult or what the attempt has changed.",
  },
  worse: {
    purpose: "Make the problem harder and show what matters. Readers should understand what the hero might miss or lose if the plan fails.",
    guidance: "Build on the trouble already in your story. There might be less time, fewer supplies, a hurt feeling, or another promise to keep. Choose one or two changes rather than adding a pile of unrelated disasters. What could the hero lose? A friendship, a special chance, or someone’s trust can matter as much as a magical treasure.",
    questions: ["What makes the existing problem harder now?", "What matters to the hero that could be lost?", "How does this make their earlier fear or difficulty harder to face?"],
    example: "The fair is about to open, and the gate is still blocked. Another young gardener wants to help, but Pip keeps refusing. Pip could spoil the fair and lose the chance to make a friend—the very things Pip hoped for.",
    starters: ["Now things are harder because ___.", "If my hero cannot fix this, they might lose or miss ___."],
    teacherScript: "Here we turn up the pressure on the same problem. We do not need danger or fighting. A deadline, a broken promise, or a friend feeling ignored can make the moment important. What might our hero lose, and why would that hurt this particular hero?",
    listenFor: "A stronger version of the existing problem and a consequence connected to the hero’s wish. If the answer is ‘everything,’ ask for one specific thing. Keep the pressure suitable for the story; a small problem can still feel very big to its character.",
  },
  climax: {
    purpose: "Bring the main problem to its biggest moment. Give the hero a choice that helps decide how it turns out.",
    guidance: "Think about the wish, the biggest problem, and the difficulty you gave your hero at the start. Bring them together. What must the hero do now, even though it is hard? Let them use a skill, a clue, or a lesson already in the story. They can accept help, but their own choice should matter to the result.",
    questions: ["What must your hero face or try right now?", "What difficult choice do they make?", "How does that choice change the main problem?"],
    example: "Pip admits that the gate is too tangled to fix alone and asks the other gardener for help. Together, they use Pip’s flower-growing skill and the gardener’s tools to turn the vines into a welcoming arch. Pip chooses teamwork, and the gate opens in time.",
    starters: ["At the biggest moment, my hero must ___.", "They choose to ___, even though ___. As a result, ___."],
    teacherScript: "This is the moment the earlier steps have been building toward. It does not have to be a fight. The brave choice might be telling the truth or asking for help. Let’s make the hero’s decision matter, using something we have already learned about them.",
    listenFor: "A challenge, a meaningful choice, and its result. If a new power or a stranger suddenly fixes everything, ask what the hero could contribute using an earlier skill or clue. The hero does not have to win everything; a thoughtful choice can lead to a different kind of success.",
  },
  change: {
    purpose: "Show what the adventure has changed. Help readers see how the hero or their everyday life is different from the beginning.",
    guidance: "Look back at your first two steps. What does the hero understand or do differently now? Show that change with a small action or a new routine. They do not have to become perfect or stop feeling afraid. They might simply handle the same feeling differently. Then tell us what life looks like after the big moment.",
    questions: ["What did the hero learn through their choices?", "What can they do now that was hard at the beginning?", "What everyday moment would show us the change?"],
    example: "Pip learns that asking for help can bring people closer. The next day, Pip invites the other gardener to tend the flower patch together. Pip still breathes flowers instead of fire, but now feels proud of that gift and shares it with a friend.",
    starters: ["My hero learns that ___. We can see this when they ___.", "At the end, their life is different because ___."],
    teacherScript: "An ending does more than stop the action. It lets us notice what the journey has changed. Instead of only saying ‘they learned kindness,’ show us a kind action. Compare the beginning and the end: what would our hero do differently on an ordinary day now?",
    listenFor: "A change supported by something that happened in the story, plus a glimpse of life afterward. If the answer is only ‘happy,’ ask what the hero does or understands now. An ending can be funny, quiet, hopeful, or bittersweet; it does not need a perfect life or a stated moral.",
  },
};
