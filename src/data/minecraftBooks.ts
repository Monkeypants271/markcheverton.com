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

export type ReadingOrderEntry = {
  order: number;
  title: string;
  arc: string;
  saga: string;
  bestFor: string;
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
