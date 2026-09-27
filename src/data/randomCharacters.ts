export type RandomCharacter = {
  id: string;
  src: string;
  width: number;
  height: number;
};

export const randomCharacters: readonly RandomCharacter[] = [
  { id: "rocket-ship", src: "/images/random-characters/Rocket-Ship_Mission-to-the-Moon.png", width: 1089, height: 1445 },
  { id: "green-creature", src: "/images/random-characters/Green-Creature_Attack-of-the-Shadow-Crafters.png", width: 1031, height: 1525 },
  { id: "gameknight-shadow-crafters", src: "/images/random-characters/Gameknight999_Attack-of-the-Shadow-Crafters.png", width: 1145, height: 1374 },
  { id: "ghast", src: "/images/random-characters/Ghast_Battle-for-the-Nether.png", width: 1208, height: 1302 },
  { id: "enderman", src: "/images/random-characters/Enderman_Invasion-of-the-Overworld.png", width: 1024, height: 1536 },
  { id: "guardian", src: "/images/random-characters/Guardian_Last-Stand-on-the-Ocean-Shore.png", width: 1223, height: 1286 },
  { id: "red-crowned-figure", src: "/images/random-characters/Red-Crowned-Figure_Herobrines-War_REVIEW-v2.png", width: 1024, height: 1536 },
  { id: "zombie-king", src: "/images/random-characters/Zombie-King_Trouble-in-Zombie-Town_REVIEW-v2.png", width: 1024, height: 1536 },
  { id: "pig", src: "/images/random-characters/Pig_Saving-Crafter_REVIEW-v2.png", width: 1536, height: 1024 },
  { id: "dragon", src: "/images/random-characters/Dragon_Confronting-the-Dragon_REVIEW-v3.png", width: 1191, height: 1320 },
  { id: "fireball-blaze", src: "/images/random-characters/Fireball-Blaze_Gameknight999-vs-Herobrine.png", width: 1466, height: 1073 },
  { id: "crowned-wither-invasion", src: "/images/random-characters/Crowned-Wither_The-Wither-Invasion.png", width: 1324, height: 1188 },
  { id: "gameknight-jumping", src: "/images/random-characters/Gameknight999_Jumping_Box-Set-2.png", width: 1100, height: 1430 },
  { id: "purple-bow-archer", src: "/images/random-characters/Purple-Bow-Archer_Zombies-Attack.png", width: 1073, height: 1466 },
  { id: "gameknight-diamond-armor", src: "/images/random-characters/Gameknight999_Diamond-Armor_Trouble-in-Zombie-Town.png", width: 1073, height: 1466 },
  { id: "staff-companion", src: "/images/random-characters/Staff-and-Backpack-Companion_Adventures-Through-Time.png", width: 1212, height: 1298 },
  { id: "crowned-wither-awaken", src: "/images/random-characters/Crowned-Wither_The-Withers-Awaken.png", width: 1466, height: 1073 },
  { id: "purple-eyed-spider", src: "/images/random-characters/Purple-Eyed-Spider_Jungle-Temple-Oracle.png", width: 1386, height: 1135 },
];

export function shuffledCharacterBag(previousCharacterId: string | null) {
  const bag = [...randomCharacters];

  for (let index = bag.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [bag[index], bag[swapIndex]] = [bag[swapIndex], bag[index]];
  }

  if (previousCharacterId && bag.length > 1 && bag[0].id === previousCharacterId) {
    [bag[0], bag[1]] = [bag[1], bag[0]];
  }

  return bag;
}
