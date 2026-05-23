export type Book = {
  title: string;
  cover: string;
  amazon?: string;
  comingSoon?: boolean;
};

export type Series = {
  name: string;
  tag?: string;
  books: Book[];
};

const WP = "https://markcheverton.com/wp-content/uploads";

export const series: Series[] = [
  {
    name: "Order of the Stones",
    books: [
      {
        title: "Facing the Beast Within",
        cover: `${WP}/2023/07/3D-FtBW-8-facing-left-with-award.png`,
        amazon: "https://www.amazon.com/Facing-Beast-Within-Mark-Cheverton/dp/1735878162",
      },
    ],
  },
  {
    name: "Spy-Girl Files",
    books: [
      {
        title: "Spy-girl and the Family Secret",
        cover: `${WP}/2025/04/Low-res-Lexi-Octavia-copy-SMALL.png`,
        comingSoon: true,
      },
    ],
  },
  {
    name: "I Hate It When…",
    books: [
      {
        title: "I Hate It When Goblins Do That",
        cover: `${WP}/2024/04/3D-facing-left-IHIWADT-72dpi-.png`,
        comingSoon: true,
      },
    ],
  },
  {
    name: "The Giants of StoneHold",
    books: [
      {
        title: "The Giant's Giant",
        cover: `${WP}/2023/07/TGG-6-3D-facing-Left.png`,
        amazon: "https://www.amazon.com/Giants-Giant-Mark-Cheverton/dp/B08JTD52K1",
      },
      {
        title: "The Giant's Sword",
        cover: `${WP}/2021/02/3D-TGS-cover-facing-left-72-dpi.png`,
        comingSoon: true,
      },
      {
        title: "The Giant's Nightmare",
        cover: `${WP}/2021/02/TGN-3D-cover-v2-72-dpi.png`,
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
        cover: `${WP}/2019/03/Book-1-3D-small.png`,
        amazon: "https://www.amazon.com/gp/product/1632207117",
      },
      {
        title: "Battle for the Nether",
        cover: `${WP}/2019/03/Book-2-3D-small.png`,
        amazon: "https://www.amazon.com/gp/product/1632207125",
      },
      {
        title: "Confronting the Dragon",
        cover: `${WP}/2019/03/Book-3-3D-small.png`,
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
        cover: `${WP}/2019/03/Book-4-3D-small.png`,
        amazon: "https://www.amazon.com/gp/product/1634500946",
      },
      {
        title: "The Jungle Temple Oracle",
        cover: `${WP}/2019/03/Book-5-3D-small.png`,
        amazon: "https://www.amazon.com/gp/product/1634500962",
      },
      {
        title: "Last Stand on the Ocean Shore",
        cover: `${WP}/2019/03/Book-6-3D-small.png`,
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
        cover: `${WP}/2019/03/Book-7-3D-small.png`,
        amazon: "https://www.amazon.com/gp/product/1510700145",
      },
      {
        title: "Destruction of the Overworld",
        cover: `${WP}/2019/03/Book-8-3D-small.png`,
        amazon: "https://www.amazon.com/gp/product/1510700153",
      },
      {
        title: "Gameknight999 vs Herobrine",
        cover: `${WP}/2019/03/Book-9-3D-small.png`,
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
        cover: `${WP}/2019/03/Book-10-3D-small.png`,
        amazon: "https://www.amazon.com/gp/product/1510706836",
      },
      {
        title: "Overworld in Flames",
        cover: `${WP}/2019/03/Book-11-3D-small.png`,
        amazon: "https://www.amazon.com/gp/product/151070681X",
      },
      {
        title: "System Overload",
        cover: `${WP}/2019/03/Book-12-3D-small.png`,
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
        cover: `${WP}/2019/03/Book-13-3D-small.png`,
        amazon: "https://www.amazon.com/gp/product/1510709940",
      },
      {
        title: "Attack of the Shadow-Crafters",
        cover: `${WP}/2019/03/Book-14-3D-small.png`,
        amazon: "https://www.amazon.com/gp/product/B01HDVCBXM",
      },
      {
        title: "Herobrine's War",
        cover: `${WP}/2019/03/Book-15-3D-small.png`,
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
        cover: `${WP}/2019/03/Book-16-3D-small.png`,
        amazon: "https://www.amazon.com/gp/product/1510718869",
      },
      {
        title: "Monsters in the Mist",
        cover: `${WP}/2019/03/Book-17-3D-small.png`,
        amazon: "https://www.amazon.com/Monsters-Mist-Gameknight999-Unofficial-Minecrafters/dp/1510718877",
      },
      {
        title: "Mission to the Moon",
        cover: `${WP}/2019/03/Book-18-3D-small.png`,
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
        cover: `${WP}/2019/03/Book-19-3D-small.png`,
        amazon: "https://www.amazon.com/gp/product/151072737X",
      },
      {
        title: "Skeletons Strike!",
        cover: `${WP}/2019/03/Book-20-3D-small.png`,
        amazon: "https://www.amazon.com/gp/product/1510727388",
      },
      {
        title: "Spiders Swarm!",
        cover: `${WP}/2019/03/Book-21-3D-small.png`,
        amazon: "https://www.amazon.com/gp/product/1510727396",
      },
    ],
  },
  {
    name: "Wither War",
    tag: "Far Land Series #2",
    books: [
      {
        title: "Wither Attack!",
        cover: `${WP}/2019/03/Book-22-3D-small.png`,
        amazon: "https://www.amazon.com/gp/product/1510734880",
      },
      {
        title: "Wither Invasion!",
        cover: `${WP}/2019/03/Book-23-3D-small.png`,
        amazon: "https://www.amazon.com/gp/product/1510734899",
      },
      {
        title: "Wither Battle!",
        cover: `${WP}/2019/03/Book-24-3D-small.png`,
        amazon: "https://www.amazon.com/gp/product/1510734902",
      },
    ],
  },
  {
    name: "Minecraft Short Stories",
    tag: "Free via BookFunnel",
    books: [
      {
        title: "Elytra Peril",
        cover: `${WP}/2019/03/Elytra-Peril-SS-3D-small.png`,
        amazon: "https://books.bookfunnel.com/freeminecraftstories",
      },
      {
        title: "The Virus",
        cover: `${WP}/2019/03/The-Virus-SS-3D-small.png`,
        amazon: "https://books.bookfunnel.com/freeminecraftstories",
      },
      {
        title: "Battle with Wither King",
        cover: `${WP}/2019/03/Battle-with-Wither-King-SS-3D-small.png`,
        amazon: "https://books.bookfunnel.com/freeminecraftstories",
      },
    ],
  },
  {
    name: "Box Sets",
    books: [
      {
        title: "Gameknight999 & Mystery of Herobrine Box Set",
        cover: `${WP}/2019/03/Box-1-small.jpg`,
        amazon: "https://www.amazon.com/Gameknight999-Box-Set-Unofficial-Minecrafter%C2%99s/dp/1634502108",
      },
      {
        title: "Herobrine Reborn & Herobrine's Revenge Box Set",
        cover: `${WP}/2019/03/box-2-small.jpg`,
        amazon: "https://www.amazon.com/Gameknight999-vs-Herobrine-Box-Set/dp/1510709932",
      },
      {
        title: "Birth of Herobrine & Mystery of Entity303 Box Set",
        cover: `${WP}/2019/03/Box-3-small.jpg`,
        amazon: "https://www.amazon.com/Gameknight999-Adventures-Through-Time-Box/dp/151072740X",
      },
      {
        title: "Rise of the Warlords & The Wither War Box Set",
        cover: `${WP}/2019/10/Box-Set-4.jpg`,
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
