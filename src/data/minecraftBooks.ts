// Canonical Gameknight999 / Far Lands reading order for the Minecraft-inspired
// book hub at /minecraft-books/.
//
// This module deliberately does NOT re-store cover/Amazon data — that lives in
// `@/data/books.ts`. It only encodes the *reading order* (arcs + sequence) and
// looks book details up by title so there is a single source of truth.

import { findBook } from "@/data/books";

export type ReadingOrderArc = {
  /** Series / story arc name as it appears in books.ts */
  arc: string;
  /** The larger saga this arc belongs to */
  saga: string;
  /** Book titles in reading order — must match titles in books.ts exactly */
  titles: string[];
};

export const gameknightArcs: ReadingOrderArc[] = [
  {
    arc: "Gameknight999",
    saga: "The Gameknight999 Saga",
    titles: [
      "Invasion of the Overworld",
      "Battle for the Nether",
      "Confronting the Dragon",
    ],
  },
  {
    arc: "Mystery of Herobrine",
    saga: "The Gameknight999 Saga",
    titles: [
      "Trouble in Zombie-town",
      "The Jungle Temple Oracle",
      "Last Stand on the Ocean Shore",
    ],
  },
  {
    arc: "Herobrine Reborn",
    saga: "The Gameknight999 Saga",
    titles: [
      "Saving Crafter",
      "Destruction of the Overworld",
      "Gameknight999 vs Herobrine",
    ],
  },
  {
    arc: "Herobrine's Revenge",
    saga: "The Gameknight999 Saga",
    titles: ["The Phantom Virus", "Overworld in Flames", "System Overload"],
  },
  {
    arc: "Birth of Herobrine",
    saga: "The Gameknight999 Saga",
    titles: [
      "The Great Zombie Invasion",
      "Attack of the Shadow-Crafters",
      "Herobrine's War",
    ],
  },
  {
    arc: "Mystery of Entity303",
    saga: "The Gameknight999 Saga",
    titles: [
      "Terrors of the Forest",
      "Monsters in the Mist",
      "Mission to the Moon",
    ],
  },
  {
    arc: "Rise of the Warlords",
    saga: "The Far Lands (sequel saga)",
    titles: ["Zombies Attack!", "Bones of Doom", "Into the Spiders' Lair"],
  },
  {
    arc: "Wither War",
    saga: "The Far Lands (sequel saga)",
    titles: ["The Wither King", "The Withers Awaken", "The Wither Invasion"],
  },
];

// The theme / positive message of each book, written for parents, teachers,
// and librarians. Keyed by the canonical title in books.ts.
export const themesByTitle: Record<string, string> = {
  "Invasion of the Overworld": "Bullying and the value of friendship",
  "Battle for the Nether": "Dealing with fear and anxiety",
  "Confronting the Dragon": "Confronting your fears",
  "Trouble in Zombie-town": "Sibling relationships",
  "The Jungle Temple Oracle": "Even the smallest person can be a hero",
  "Last Stand on the Ocean Shore":
    "Working together is better than working alone",
  "Saving Crafter": "Father/son relationships and growing up",
  "Destruction of the Overworld": "Don't let fear rule your life — just be you",
  "Gameknight999 vs Herobrine": "Judge the behavior first, not the person",
  "The Phantom Virus": "Be responsible for your own choices and actions",
  "Overworld in Flames": "Judge yourself by the quality of the friends you keep",
  "System Overload": "Look for the good in things, not just the bad",
  "The Great Zombie Invasion": "Being accepted by being yourself",
  "Attack of the Shadow-Crafters":
    "Accepting your weaknesses does not make you a failure",
  "Herobrine's War": "Asking for help is not a weakness — it's a strength",
  "Terrors of the Forest":
    "Belief in yourself can make you stronger than you realize",
  "Monsters in the Mist": "Hate can consume who you are — choose forgiveness",
  "Mission to the Moon": "Making good choices for the right reasons",
  "Zombies Attack!": "Be yourself instead of who others want you to be",
  "Bones of Doom": "Believing in yourself",
  "Into the Spiders' Lair":
    "Failing doesn't make you a failure — it just means try again",
  "The Wither King": "Stuff isn't important — friends are",
  "The Withers Awaken": "Be true to your inner self",
  "The Wither Invasion":
    "Learn from your failures so you can become stronger",
};

export type ReadingOrderEntry = {
  order: number;
  title: string;
  arc: string;
  saga: string;
  bestFor: string;
  theme?: string;
  amazon?: string;
  cover?: string;
};

/**
 * Flattened, numbered reading order. Pulls cover + Amazon URL from books.ts so
 * there is no second copy of that data to keep in sync.
 */
export function getGameknightReadingOrder(): ReadingOrderEntry[] {
  const entries: ReadingOrderEntry[] = [];
  let order = 0;
  for (const arc of gameknightArcs) {
    arc.titles.forEach((title, indexInArc) => {
      order += 1;
      const book = findBook(title);
      const bestFor =
        order === 1
          ? "Start here"
          : indexInArc === 0
            ? `Begins the ${arc.arc} arc`
            : "Continue the adventure";
      entries.push({
        order,
        title,
        arc: arc.arc,
        saga: arc.saga,
        bestFor,
        theme: themesByTitle[title],
        amazon: book?.amazon,
        cover: book?.cover,
      });
    });
  }
  return entries;
}

/** Series overview cards for the hub page. One per arc, with its starting book. */
export type SeriesCard = {
  arc: string;
  saga: string;
  startsWith: string;
  startsWithAmazon?: string;
  description: string;
};

export const seriesCards: SeriesCard[] = [
  {
    arc: "Gameknight999",
    saga: "The Gameknight999 Saga",
    startsWith: "Invasion of the Overworld",
    description:
      "The original arc, and the best place for any new reader to start. A gamer is pulled into the world of his favorite game — where everything is suddenly real.",
  },
  {
    arc: "Mystery of Herobrine",
    saga: "The Gameknight999 Saga",
    startsWith: "Trouble in Zombie-town",
    description:
      "The shadowy figure of Herobrine spreads across the Overworld as Gameknight and his friends race to stop a digital virus from escaping the game.",
  },
  {
    arc: "Herobrine Reborn",
    saga: "The Gameknight999 Saga",
    startsWith: "Saving Crafter",
    description:
      "Herobrine returns more dangerous than ever, and Gameknight must save his closest friend, Crafter, before the Overworld falls apart.",
  },
  {
    arc: "Herobrine's Revenge",
    saga: "The Gameknight999 Saga",
    startsWith: "The Phantom Virus",
    description:
      "A phantom virus threatens to tear the server apart. Gameknight999 leads a desperate stand to keep two worlds from colliding.",
  },
  {
    arc: "Birth of Herobrine",
    saga: "The Gameknight999 Saga",
    startsWith: "The Great Zombie Invasion",
    description:
      "Travel back to where the legend began, as the origins of Herobrine and the first great battles of the Overworld are revealed.",
  },
  {
    arc: "Mystery of Entity303",
    saga: "The Gameknight999 Saga",
    startsWith: "Terrors of the Forest",
    description:
      "A new enemy, Entity303, leads Gameknight and his friends on a chase through strange modded worlds and all the way to the moon.",
  },
  {
    arc: "Rise of the Warlords",
    saga: "The Far Lands (sequel saga)",
    startsWith: "Zombies Attack!",
    description:
      "A brand-new hero in the distant Far Lands faces a rising army of monsters in this fast-paced continuation of the Minecraft-inspired universe.",
  },
  {
    arc: "Wither War",
    saga: "The Far Lands (sequel saga)",
    startsWith: "The Wither King",
    description:
      "The withers awaken and war comes to the Far Lands. The final arc brings the sequel saga to its biggest, most explosive finish.",
  },
];

// The BookFunnel page where parents, teachers, and homeschoolers can browse all
// of Mark's free ELA and writing resources.
export const ELA_RESOURCES_URL = "https://books.bookfunnel.com/ELAresources";

// Free ELA companion guides for the first three Gameknight999 books, delivered
// as free downloads via BookFunnel. Order matches the reading order.
export const bookCompanionGuides: {
  title: string;
  href: string;
  blurb: string;
}[] = [
  {
    title: "Invasion of the Overworld",
    href: "https://dl.bookfunnel.com/o8nfliewox",
    blurb:
      "Lesson-ready grammar, vocabulary, writing, and comprehension activities built around Book One.",
  },
  {
    title: "Battle for the Nether",
    href: "https://dl.bookfunnel.com/gd6moashpf",
    blurb:
      "ELA activities to teach grammar, writing, and vocabulary with Book Two of the series.",
  },
  {
    title: "Confronting the Dragon",
    href: "https://dl.bookfunnel.com/ei4ll9gvrf",
    blurb:
      "ELA activities to teach grammar, writing, and vocabulary with Book Three of the series.",
  },
];

// Quick lookup of a book's companion-guide URL by canonical title.
export const elaCompanionGuideByTitle: Record<string, string> =
  Object.fromEntries(bookCompanionGuides.map((g) => [g.title, g.href]));

export type ElaResource = {
  title: string;
  description: string;
  href: string;
};

// Additional free ELA / writing resources for parents, teachers, and
// homeschoolers. Items with a direct BookFunnel download link point straight
// to it; the rest open the full BookFunnel resources page.
export const elaResources: ElaResource[] = [
  {
    title: "ELA Companion Guide for Any Book",
    description:
      "A flexible set of ELA activities you can pair with any Mark Cheverton novel.",
    href: ELA_RESOURCES_URL,
  },
  {
    title: "365 Writing Prompts for 15-Minute Daily Writing",
    description:
      "A full year of quick daily prompts to build a consistent writing habit.",
    href: ELA_RESOURCES_URL,
  },
  {
    title: "5 Strategies for Reluctant Writers",
    description:
      "Five proven strategies to get a hesitant writer putting words on the page — and eventually enjoying it.",
    href: "https://dl.bookfunnel.com/r5jtl2b948",
  },
  {
    title: "How to Give Constructive Feedback",
    description:
      "Ten strategies for giving feedback on a child's writing without crushing their motivation.",
    href: "https://dl.bookfunnel.com/ml5ysytccc",
  },
  {
    title: "11 Strategies to Help Kids Finish Long Assignments",
    description:
      "Practical ways to help kids push through long, challenging assignments to the finish.",
    href: "https://dl.bookfunnel.com/3dff13u88b",
  },
  {
    title: "Linking Fan Fiction to Reading",
    description:
      "Fifteen strategies for using fan fiction and creative writing to strengthen reading and writing skills.",
    href: "https://dl.bookfunnel.com/q4steblaey",
  },
  {
    title: "Integrate Creative Writing into Homeschool Curriculums",
    description:
      "How to weave creative writing into a homeschool routine without adding a whole new program.",
    href: ELA_RESOURCES_URL,
  },
];
