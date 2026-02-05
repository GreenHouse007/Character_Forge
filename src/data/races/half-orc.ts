import { Race } from '@/types/race';

export const halfOrc: Race = {
  name: 'Half-Orc',
  source: 'CRB',
  description:
    'Half-orcs are the result of the union between humans and orcs. Often shunned by both parent races, they are frequently forced to grow up in harsh and unwelcoming environments. Despite this, half-orcs possess a fierce tenacity and resilience that makes them formidable warriors.',
  size: 'Medium',
  speed: 30,
  abilityModifiers: [],
  flexibleAbilityBonus: true,
  darkvision: 60,
  racialTraits: [
    {
      name: 'Intimidating',
      description:
        'Half-orcs receive a +2 racial bonus on Intimidate checks due to their fearsome nature.',
    },
    {
      name: 'Orc Blood',
      description:
        'Half-orcs count as both humans and orcs for any effect related to race.',
    },
    {
      name: 'Orc Ferocity',
      description:
        'Once per day, when a half-orc is brought below 0 hit points but not killed, he can fight on for one more round as if disabled. At the end of his next turn, unless brought to above 0 hit points, he immediately falls unconscious and begins dying.',
    },
    {
      name: 'Weapon Familiarity',
      description:
        'Half-orcs are proficient with greataxes and falchions and treat any weapon with the word "orc" in its name as a martial weapon.',
    },
  ],
  skillBonuses: [{ skill: 'Intimidate', bonus: 2 }],
  languages: ['Common', 'Orc'],
  bonusLanguages: ['Abyssal', 'Draconic', 'Giant', 'Gnoll', 'Goblin'],
};
