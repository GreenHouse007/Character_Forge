import { Race } from '@/types/race';

export const dwarf: Race = {
  name: 'Dwarf',
  source: 'CRB',
  description:
    'Dwarves are a stoic but stern race, ensconced in cities carved from the hearts of mountains and fiercely determined to repel the depredations of savage races. More than any other race, dwarves have acquired a reputation as dour and humorless artisans of the earth.',
  size: 'Medium',
  speed: 20,
  abilityModifiers: [
    { ability: 'con', modifier: 2 },
    { ability: 'wis', modifier: 2 },
    { ability: 'cha', modifier: -2 },
  ],
  flexibleAbilityBonus: false,
  darkvision: 60,
  racialTraits: [
    {
      name: 'Slow and Steady',
      description:
        'Dwarves have a base speed of 20 feet, but their speed is never modified by armor or encumbrance.',
    },
    {
      name: 'Defensive Training',
      description:
        'Dwarves gain a +4 dodge bonus to AC against monsters of the giant subtype.',
    },
    {
      name: 'Greed',
      description:
        'Dwarves gain a +2 racial bonus on Appraise checks made to determine the price of non-magical goods that contain precious metals or gemstones.',
    },
    {
      name: 'Hatred',
      description:
        'Dwarves gain a +1 racial bonus on attack rolls against humanoid creatures of the orc and goblinoid subtypes.',
    },
    {
      name: 'Hardy',
      description:
        'Dwarves gain a +2 racial bonus on saving throws against poison, spells, and spell-like abilities.',
    },
    {
      name: 'Stability',
      description:
        'Dwarves gain a +4 racial bonus to their Combat Maneuver Defense when resisting a bull rush or trip attempt while standing on the ground.',
    },
    {
      name: 'Stonecunning',
      description:
        'Dwarves gain a +2 bonus on Perception checks to notice unusual stonework, such as traps and hidden doors located in stone walls or floors. They receive a check to notice such features whenever they pass within 10 feet of them, whether or not they are actively looking.',
    },
    {
      name: 'Weapon Familiarity',
      description:
        'Dwarves are proficient with battleaxes, heavy picks, and warhammers, and treat any weapon with the word "dwarven" in its name as a martial weapon.',
    },
  ],
  skillBonuses: [
    { skill: 'Appraise', bonus: 2 },
    { skill: 'Perception', bonus: 2 },
  ],
  languages: ['Common', 'Dwarven'],
  bonusLanguages: ['Giant', 'Gnome', 'Goblin', 'Orc', 'Terran', 'Undercommon'],
};
