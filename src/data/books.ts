export type Book = {
  title: string;
  cover: string;
  amazon?: string;
  comingSoon?: boolean;
  note?: string;
};

export type Series = {
  name: string;
  tag?: string;
  books: Book[];
};

export const series: Series[] = [
  {
    name: "Order of the Stones",
    books: [
      {
        title: "Facing the Beast Within",
        cover: "/images/books/3D-FtBW-8-facing-left-with-award.png",
        amazon: "https://www.amazon.com/Facing-Beast-Within-Mark-Cheverton/dp/1735878162",
      },
      {
        title: "Cameron and the Shadow-wraiths",
        cover: "/images/books/cameron-and-the-shadow-wraiths.png",
        amazon: "https://www.amazon.com/Cameron-Shadow-wraiths-Battle-Anxiety-Stones/dp/B0CRDC4VZ5",
      },
    ],
  },
  {
    name: "Spy-Girl Files",
    books: [
      {
        title: "Spy-girl and the Family Secret",
        cover: "/images/books/Low-res-Lexi-Octavia-copy-SMALL.png",
        comingSoon: true,
      },
    ],
  },
  {
    name: "I Hate It When…",
    books: [
      {
        title: "I Hate It When Aliens Do That",
        cover: "/images/books/3D-facing-left-IHIWADT-72dpi-.png",
        amazon: "https://www.amazon.com/Hate-When-Aliens-Do-That/dp/B0D29ZLLNP",
      },
    ],
  },
  {
    name: "The Giants of StoneHold",
    books: [
      {
        title: "The Giant's Giant",
        cover: "/images/books/TGG-6-3D-facing-Left.png",
        amazon: "https://www.amazon.com/Giants-Giant-Mark-Cheverton/dp/B08JTD52K1",
      },
      {
        title: "The Giant's Sword",
        cover: "/images/books/3D-TGS-cover-facing-left-72-dpi.png",
        comingSoon: true,
      },
      {
        title: "The Giant's Nightmare",
        cover: "/images/books/TGN-3D-cover-v2-72-dpi.png",
        comingSoon: true,
      },
    ],
  },
  {
    name: "Gameknight999",
    tag: "Minecraft Series #1 · The 1st Minecraft series ever published",
    books: [
      {
        title: "Invasion of the Overworld",
        cover: "/images/books/Book-1-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/1632207117",
      },
      {
        title: "Battle for the Nether",
        cover: "/images/books/Book-2-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/1632207125",
      },
      {
        title: "Confronting the Dragon",
        cover: "/images/books/Book-3-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/1634500466",
      },
    ],
  },
  {
    name: "Mystery of Herobrine",
    tag: "Minecraft Series #2",
    books: [
      {
        title: "Trouble in Zombie-town",
        cover: "/images/books/Book-4-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/1634500946",
      },
      {
        title: "The Jungle Temple Oracle",
        cover: "/images/books/Book-5-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/1634500962",
      },
      {
        title: "Last Stand on the Ocean Shore",
        cover: "/images/books/Book-6-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/1634500989",
      },
    ],
  },
  {
    name: "Herobrine Reborn",
    tag: "Minecraft Series #3",
    books: [
      {
        title: "Saving Crafter",
        cover: "/images/books/Book-7-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/1510700145",
      },
      {
        title: "Destruction of the Overworld",
        cover: "/images/books/Book-8-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/1510700153",
      },
      {
        title: "Gameknight999 vs Herobrine",
        cover: "/images/books/Book-9-3D-small.png",
        amazon: "https://www.amazon.com/Gameknight999-vs-Herobrine-Minecrafter%C2%99s-Minecrafters/dp/1510700102",
      },
    ],
  },
  {
    name: "Herobrine's Revenge",
    tag: "Minecraft Series #4",
    books: [
      {
        title: "The Phantom Virus",
        cover: "/images/books/Book-10-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/1510706836",
      },
      {
        title: "Overworld in Flames",
        cover: "/images/books/Book-11-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/151070681X",
      },
      {
        title: "System Overload",
        cover: "/images/books/Book-12-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/1510706828",
      },
    ],
  },
  {
    name: "Birth of Herobrine",
    tag: "Minecraft Series #5",
    books: [
      {
        title: "The Great Zombie Invasion",
        cover: "/images/books/Book-13-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/1510709940",
      },
      {
        title: "Attack of the Shadow-Crafters",
        cover: "/images/books/Book-14-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/B01HDVCBXM",
      },
      {
        title: "Herobrine's War",
        cover: "/images/books/Book-15-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/1510709967",
      },
    ],
  },
  {
    name: "Mystery of Entity303",
    tag: "Minecraft Series #6",
    books: [
      {
        title: "Terrors of the Forest",
        cover: "/images/books/Book-16-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/1510718869",
      },
      {
        title: "Monsters in the Mist",
        cover: "/images/books/Book-17-3D-small.png",
        amazon: "https://www.amazon.com/Monsters-Mist-Gameknight999-Unofficial-Minecrafters/dp/1510718877",
      },
      {
        title: "Mission to the Moon",
        cover: "/images/books/Book-18-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/1510718885",
      },
    ],
  },
  {
    name: "Rise of the Warlords",
    tag: "Far Land Series #1",
    books: [
      {
        title: "Zombies Attack!",
        cover: "/images/books/Book-19-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/151072737X",
      },
      {
        title: "Bones of Doom",
        cover: "/images/books/Book-20-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/1510727388",
      },
      {
        title: "Into the Spiders' Lair",
        cover: "/images/books/Book-21-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/1510727396",
      },
    ],
  },
  {
    name: "Wither War",
    tag: "Far Land Series #2",
    books: [
      {
        title: "The Wither King",
        cover: "/images/books/Book-22-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/1510734880",
      },
      {
        title: "The Withers Awaken",
        cover: "/images/books/Book-23-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/1510734899",
      },
      {
        title: "The Wither Invasion",
        cover: "/images/books/Book-24-3D-small.png",
        amazon: "https://www.amazon.com/gp/product/1510734902",
      },
    ],
  },
  {
    name: "Minecraft Short Stories",
    tag: "Free via newsletter signup",
    books: [
      {
        title: "Elytra Peril",
        cover: "/images/books/Elytra-Peril-SS-3D-small.png",
        note: "Free with newsletter signup",
      },
      {
        title: "The Virus",
        cover: "/images/books/The-Virus-SS-3D-small.png",
        note: "Free with newsletter signup",
      },
      {
        title: "Battle with Wither King",
        cover: "/images/books/Battle-with-Wither-King-SS-3D-small.png",
        note: "Free with newsletter signup",
      },
    ],
  },
  {
    name: "Box Sets",
    books: [
      {
        title: "Gameknight999 & Mystery of Herobrine Box Set",
        cover: "/images/books/Box-1-small.jpg",
        amazon: "https://www.amazon.com/Gameknight999-Box-Set-Unofficial-Minecrafter%C2%99s/dp/1634502108",
      },
      {
        title: "Herobrine Reborn & Herobrine's Revenge Box Set",
        cover: "/images/books/box-2-small.jpg",
        amazon: "https://www.amazon.com/Gameknight999-vs-Herobrine-Box-Set/dp/1510709932",
      },
      {
        title: "Birth of Herobrine & Mystery of Entity303 Box Set",
        cover: "/images/books/Box-3-small.jpg",
        amazon: "https://www.amazon.com/Gameknight999-Adventures-Through-Time-Box/dp/151072740X",
      },
      {
        title: "Rise of the Warlords & The Wither War Box Set",
        cover: "/images/books/Box-Set-4.jpg",
        amazon: "https://www.amazon.com/Withers-Warlords-Adventures-Unofficial-Minecrafters/dp/1510745262",
      },
    ],
  },
];

export function findBook(title: string): Book | undefined {
  for (const s of series) {
    const found = s.books.find((b) => b.title === title);
    if (found) return found;
  }
  return undefined;
}
