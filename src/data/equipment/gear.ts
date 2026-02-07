import { AdventuringGear } from "../../types/equipment";

export const ADVENTURING_GEAR: AdventuringGear[] = [
  {
    name: "Backpack",
    cost: 2,
    weight: 2,
    description:
      "A leather pack carried on the back, typically with straps to secure it.",
    source: "CRB",
  },
  {
    name: "Bedroll",
    cost: 0.1,
    weight: 5,
    description:
      "A portable sleeping pad and blanket, rolled for easy transport.",
    source: "CRB",
  },
  {
    name: "Belt pouch",
    cost: 1,
    weight: 0.5,
    description: "A small waterproof bag that clips to a belt.",
    source: "CRB",
  },
  {
    name: "Candle",
    cost: 0.01,
    weight: 0,
    description:
      "A candle dimly illuminates a 5-foot radius and burns for 1 hour.",
    source: "CRB",
  },
  {
    name: "Chain (10 ft.)",
    cost: 30,
    weight: 2,
    description:
      "A chain has hardness 10 and 5 hit points. It can be burst with a DC 26 Strength check.",
    source: "CRB",
  },
  {
    name: "Chalk",
    cost: 0.01,
    weight: 0,
    description: "A single piece of chalk.",
    source: "CRB",
  },
  {
    name: "Climber's kit",
    cost: 80,
    weight: 5,
    description:
      "Pitons, boot tips, gloves, and a harness that grants a +2 circumstance bonus on Climb checks.",
    source: "CRB",
  },
  {
    name: "Crowbar",
    cost: 2,
    weight: 5,
    description:
      "An iron bar for leveraging open doors and chests. Grants a +2 circumstance bonus on Strength checks made to force open a door or chest.",
    source: "CRB",
  },
  {
    name: "Flint and steel",
    cost: 1,
    weight: 0,
    description:
      "Striking steel and flint together creates sparks to light a fire.",
    source: "CRB",
  },
  {
    name: "Grappling hook",
    cost: 1,
    weight: 4,
    description: "A metal hook with multiple tines used to anchor a rope.",
    source: "CRB",
  },
  {
    name: "Hammer",
    cost: 0.5,
    weight: 2,
    description: "A small tool hammer suitable for driving pitons.",
    source: "CRB",
  },
  {
    name: "Holy symbol, wooden",
    cost: 1,
    weight: 0,
    description:
      "A wooden holy symbol of a particular deity, required as a divine focus for divine spellcasting.",
    source: "CRB",
  },
  {
    name: "Holy symbol, silver",
    cost: 25,
    weight: 1,
    description:
      "A silver holy symbol of a particular deity, required as a divine focus for divine spellcasting.",
    source: "CRB",
  },
  {
    name: "Hooded lantern",
    cost: 7,
    weight: 2,
    description:
      "A hooded lantern sheds normal light in a 30-foot radius and increases the light level by one step for an additional 30 feet. It burns for 6 hours on 1 pint of oil.",
    source: "CRB",
  },
  {
    name: "Ink",
    cost: 8,
    weight: 0,
    description: "A 1-ounce vial of black ink.",
    source: "CRB",
  },
  {
    name: "Ink pen",
    cost: 0.1,
    weight: 0,
    description: "A pointed wooden or metal instrument for writing with ink.",
    source: "CRB",
  },
  {
    name: "Journal",
    cost: 10,
    weight: 1,
    description: "A blank journal of 25 pages of parchment bound in leather.",
    source: "CRB",
  },
  {
    name: "Manacles",
    cost: 15,
    weight: 2,
    description:
      "Manacles can bind a Medium creature. Escaping requires a DC 30 Escape Artist check; breaking them requires a DC 26 Strength check.",
    source: "CRB",
  },
  {
    name: "Mirror, small steel",
    cost: 10,
    weight: 0.5,
    description:
      "A polished steel mirror useful for looking around corners or signaling.",
    source: "CRB",
  },
  {
    name: "Oil (1 flask)",
    cost: 0.1,
    weight: 1,
    description:
      "A pint of oil burns for 6 hours in a lantern. Can also be used as a splash weapon.",
    source: "CRB",
  },
  {
    name: "Piton",
    cost: 0.1,
    weight: 0.5,
    description:
      "A metal spike driven into a wall or rock surface to secure a rope.",
    source: "CRB",
  },
  {
    name: "Rations, trail (per day)",
    cost: 0.5,
    weight: 1,
    description:
      "Dry, preserved food suitable for travel, including jerky, dried fruit, hardtack, and nuts.",
    source: "CRB",
  },
  {
    name: "Rope, hemp (50 ft.)",
    cost: 1,
    weight: 10,
    description:
      "Hemp rope has 2 hit points and can be burst with a DC 23 Strength check.",
    source: "CRB",
  },
  {
    name: "Rope, silk (50 ft.)",
    cost: 10,
    weight: 5,
    description:
      "Silk rope has 4 hit points and can be burst with a DC 24 Strength check. It grants a +2 circumstance bonus on Use Rope checks.",
    source: "CRB",
  },
  {
    name: "Sack",
    cost: 0.1,
    weight: 0.5,
    description: "A drawstring sack made of burlap or similar material.",
    source: "CRB",
  },
  {
    name: "Spell component pouch",
    cost: 5,
    weight: 2,
    description:
      "A belt pouch containing all mundane material components and focuses needed for spellcasting (except those with a specific cost).",
    source: "CRB",
  },
  {
    name: "Sunrod",
    cost: 2,
    weight: 1,
    description:
      "An alchemical device that sheds normal light in a 30-foot radius for 6 hours.",
    source: "CRB",
  },
  {
    name: "Tent",
    cost: 10,
    weight: 20,
    description:
      "A simple two-person tent made of canvas, set up with poles and stakes.",
    source: "CRB",
  },
  {
    name: "Thieves' tools",
    cost: 30,
    weight: 1,
    description:
      "A set of picks and tools required to use the Disable Device skill. Without these tools, you must use improvised tools and take a -2 penalty.",
    source: "CRB",
  },
  {
    name: "Thieves' tools, masterwork",
    cost: 100,
    weight: 2,
    description:
      "A masterwork set of picks and tools that grants a +2 circumstance bonus on Disable Device checks.",
    source: "CRB",
  },
  {
    name: "Torch",
    cost: 0.01,
    weight: 1,
    description:
      "A torch sheds normal light in a 20-foot radius and increases the light level by one step for an additional 20 feet. It burns for 1 hour.",
    source: "CRB",
  },
  {
    name: "Waterskin",
    cost: 1,
    weight: 4,
    description:
      "A leather pouch with a narrow spout, holding up to half a gallon of liquid.",
    source: "CRB",
  },
  {
    name: "Healer's kit",
    cost: 50,
    weight: 1,
    description:
      "A collection of bandages and healing herbs providing 10 uses. Grants a +2 circumstance bonus on Heal checks.",
    source: "CRB",
  },
  {
    name: "Lantern, bullseye",
    cost: 12,
    weight: 3,
    description:
      "A bullseye lantern sheds normal light in a 60-foot cone and increases the light level by one step for an additional 60 feet. It burns for 6 hours on 1 pint of oil.",
    source: "CRB",
  },
  {
    name: "Lock, simple",
    cost: 20,
    weight: 1,
    description:
      "A simple lock can be opened with a successful DC 20 Disable Device check.",
    source: "CRB",
  },
  {
    name: "Lock, average",
    cost: 40,
    weight: 1,
    description:
      "An average lock can be opened with a successful DC 25 Disable Device check.",
    source: "CRB",
  },
  {
    name: "Lock, good",
    cost: 80,
    weight: 1,
    description:
      "A good lock can be opened with a successful DC 30 Disable Device check.",
    source: "CRB",
  },
  {
    name: "Lock, superior",
    cost: 150,
    weight: 1,
    description:
      "A superior lock can be opened with a successful DC 40 Disable Device check.",
    source: "CRB",
  },
  {
    name: "Portable ram",
    cost: 10,
    weight: 20,
    description:
      "A portable ram grants a +2 circumstance bonus on Strength checks to break down doors. If two people use it, the bonus increases to +4.",
    source: "CRB",
  },
  {
    name: "Block and tackle",
    cost: 5,
    weight: 5,
    description:
      "A set of pulleys and rope that allows heavy objects to be lifted more easily. It reduces the effective weight of an object by half.",
    source: "CRB",
  },
  {
    name: "Ladder (10 ft.)",
    cost: 0.5,
    weight: 20,
    description: "A simple wooden ladder, 10 feet long.",
    source: "CRB",
  },
  {
    name: "Twine (50 ft.)",
    cost: 0.1,
    weight: 0,
    description:
      "A roll of thin twine useful for tying small objects or making temporary bindings.",
    source: "CRB",
  },
  {
    name: "Soap",
    cost: 0.5,
    weight: 0.5,
    description: "A bar of soap used for cleaning and hygiene.",
    source: "CRB",
  },
  {
    name: "Whetstone",
    cost: 0.02,
    weight: 1,
    description: "A stone used to sharpen bladed weapons and tools.",
    source: "CRB",
  },
  {
    name: "Signal whistle",
    cost: 0.8,
    weight: 0,
    description:
      "A small whistle capable of producing a loud, piercing sound used for signaling.",
    source: "CRB",
  },
  {
    name: "Sealing wax",
    cost: 1,
    weight: 0.5,
    description:
      "Wax used to seal letters or documents. Often paired with a seal stamp.",
    source: "CRB",
  },
  {
    name: "Seal stamp",
    cost: 5,
    weight: 0.5,
    description: "A metal stamp used to impress a symbol into hot sealing wax.",
    source: "CRB",
  },
  {
    name: "Parchment (sheet)",
    cost: 0.2,
    weight: 0,
    description:
      "A single sheet of parchment suitable for writing or mapmaking.",
    source: "CRB",
  },
  {
    name: "Scroll case",
    cost: 1,
    weight: 1,
    description:
      "A cylindrical leather or wooden case used to protect maps, scrolls, or documents.",
    source: "CRB",
  },
  {
    name: "Disguise kit",
    cost: 50,
    weight: 8,
    description:
      "Cosmetics, props, and small tools used to alter appearance. Grants a +2 circumstance bonus on Disguise checks.",
    source: "CRB",
  },
  {
    name: "Disguise kit, masterwork",
    cost: 150,
    weight: 8,
    description:
      "A masterwork disguise kit that grants a +2 circumstance bonus on Disguise checks. This bonus stacks with the normal kit bonus.",
    source: "CRB",
  },
  {
    name: "Artisan’s tools",
    cost: 5,
    weight: 5,
    description:
      "A set of basic tools needed to perform a specific Craft skill.",
    source: "CRB",
  },
  {
    name: "Artisan’s tools, masterwork",
    cost: 55,
    weight: 5,
    description:
      "A masterwork set of artisan’s tools that grants a +2 circumstance bonus on Craft checks.",
    source: "CRB",
  },
  {
    name: "Cold weather outfit",
    cost: 8,
    weight: 7,
    description: "Thick clothing designed to protect against cold climates.",
    source: "CRB",
  },
  {
    name: "Winter blanket",
    cost: 0.5,
    weight: 3,
    description:
      "A heavy wool blanket designed to retain heat in cold environments.",
    source: "CRB",
  },
];
