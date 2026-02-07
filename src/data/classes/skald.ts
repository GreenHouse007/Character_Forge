import { CharacterClass } from '../../types/class';

export const skald: CharacterClass = {
  name: 'Skald',
  source: 'ACG',
  description:
    'Skalds are poets, historians, and keepers of lore who use their gifts for oration and song to inspire allies into a frenzied rage. They balance the pointed prowess of a warrior with the versatile performance of a bard, using the power of their war songs to grant rage powers to their allies.',
  hitDie: 8,
  babProgression: 'threeQuarter',
  goodSaves: ['fortitude', 'will'],
  skillRanksPerLevel: 4,
  classSkills: [
    'Acrobatics',
    'Appraise',
    'Bluff',
    'Climb',
    'Craft',
    'Diplomacy',
    'Escape Artist',
    'Handle Animal',
    'Intimidate',
    'Knowledge (Arcana)',
    'Knowledge (History)',
    'Knowledge (Local)',
    'Knowledge (Nature)',
    'Knowledge (Nobility)',
    'Knowledge (Religion)',
    'Linguistics',
    'Perception',
    'Perform',
    'Profession',
    'Ride',
    'Sense Motive',
    'Spellcraft',
    'Swim',
    'Use Magic Device',
  ],
  startingWealth: {
    dice: { count: 3, sides: 6 },
    multiplier: 10,
    average: 105,
  },
  proficiencies: {
    weapons: ['simple', 'martial'],
    armor: ['light', 'medium'],
    shields: ['shields (except tower shields)'],
  },
  spellProgression: {
    type: 'spontaneous',
    castingAbility: 'cha',
    maxSpellLevel: 6,
    spellsPerDay: {
      1:  { 0: 1 },
      2:  { 0: 2 },
      3:  { 0: 3 },
      4:  { 0: 3, 1: 1 },
      5:  { 0: 4, 1: 2 },
      6:  { 0: 4, 1: 3 },
      7:  { 0: 4, 1: 3, 2: 1 },
      8:  { 0: 4, 1: 4, 2: 2 },
      9:  { 0: 5, 1: 4, 2: 3 },
      10: { 0: 5, 1: 4, 2: 3, 3: 1 },
      11: { 0: 5, 1: 4, 2: 4, 3: 2 },
      12: { 0: 5, 1: 5, 2: 4, 3: 3 },
      13: { 0: 5, 1: 5, 2: 4, 3: 3, 4: 1 },
      14: { 0: 5, 1: 5, 2: 4, 3: 4, 4: 2 },
      15: { 0: 5, 1: 5, 2: 5, 3: 4, 4: 3 },
      16: { 0: 5, 1: 5, 2: 5, 3: 4, 4: 3, 5: 1 },
      17: { 0: 5, 1: 5, 2: 5, 3: 4, 4: 4, 5: 2 },
      18: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 4, 5: 3 },
      19: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 5, 5: 4, 6: 1 },
      20: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 2 },
    },
    spellsKnown: {
      1:  { 0: 4 },
      2:  { 0: 5, 1: 2 },
      3:  { 0: 6, 1: 3 },
      4:  { 0: 6, 1: 3, 2: 1 },
      5:  { 0: 6, 1: 4, 2: 2 },
      6:  { 0: 6, 1: 4, 2: 3 },
      7:  { 0: 6, 1: 4, 2: 3, 3: 1 },
      8:  { 0: 6, 1: 4, 2: 4, 3: 2 },
      9:  { 0: 6, 1: 5, 2: 4, 3: 3 },
      10: { 0: 6, 1: 5, 2: 4, 3: 3, 4: 1 },
      11: { 0: 6, 1: 5, 2: 4, 3: 4, 4: 2 },
      12: { 0: 6, 1: 5, 2: 5, 3: 4, 4: 3 },
      13: { 0: 6, 1: 5, 2: 5, 3: 4, 4: 3, 5: 1 },
      14: { 0: 6, 1: 5, 2: 5, 3: 4, 4: 4, 5: 2 },
      15: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 4, 5: 3 },
      16: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 4, 5: 3, 6: 1 },
      17: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 4, 5: 4, 6: 2 },
      18: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 5, 5: 4, 6: 3 },
      19: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 4 },
      20: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 4 },
    },
  },
  classResources: [
    {
      name: 'Raging Song',
      description:
        'A skald can use raging song for a number of rounds per day equal to 4 + his Charisma modifier. At each level after 1st, he can use raging song for 2 additional rounds per day.',
      getUsesAtLevel: (level: number, chaMod?: number) =>
        4 + (chaMod ?? 0) + (level - 1) * 2,
      resetsOn: 'rest',
    },
  ],
  classFeatures: [
    {
      name: 'Bardic Knowledge',
      level: 1,
      description:
        'A skald adds half his class level (minimum 1) to all Knowledge skill checks and may make all Knowledge skill checks untrained.',
    },
    {
      name: 'Inspired Rage',
      level: 1,
      description:
        'At 1st level, affected allies gain a +2 morale bonus to Strength and Constitution and a +1 morale bonus on Will saving throws, but also take a -1 penalty to AC. At 4th level and every 4 levels thereafter, the song\'s bonuses on Will saves increase by 1; the penalty to AC doesn\'t change. At 8th and 16th levels, the song\'s bonuses to Strength and Constitution increase by 2.',
    },
    {
      name: 'Raging Song',
      level: 1,
      description:
        'A skald is trained to use his performance to inspire allies into a pointed rage. He can use this ability for a number of rounds per day equal to 4 + his Charisma modifier. At each level after 1st a skald can use raging song for 2 additional rounds per day.',
    },
    {
      name: 'Well-Versed',
      level: 2,
      description:
        'At 2nd level, the skald becomes resistant to the bardic performance of others, and to sonic effects in general. The skald gains a +4 bonus on saving throws made against bardic performance, sonic, and language-dependent effects.',
    },
    {
      name: 'Song of Marching',
      level: 3,
      description:
        'At 3rd level, a skald can use raging song to inspire his allies to move faster without suffering the normal penalties of a forced march. By expending 1 round of raging song per hour of travel, affected allies can hustle without suffering nonlethal damage or fatigue.',
    },
    {
      name: 'Rage Powers',
      level: 3,
      description:
        'At 3rd level and every 3 levels thereafter, a skald learns a rage power that affects himself and any allies under the influence of his inspired rage. The skald and his allies use the skald\'s level as their barbarian level for the purposes of these rage powers.',
    },
    {
      name: 'Song of Strength',
      level: 6,
      description:
        'At 6th level, a skald can use raging song to inspire his allies to feats of great strength. Once each round while the skald uses this performance, allies who are affected and within 60 feet can add 1/2 the skald\'s level to a Strength check or Strength-based skill check.',
    },
    {
      name: 'Dirge of Doom',
      level: 10,
      description:
        'At 10th level, a skald can create a sense of growing dread in his enemies, causing them to become shaken. This only affects enemies within 30 feet who can hear the skald\'s performance. This cannot cause a creature to become frightened or panicked, even if the creature is already shaken from another effect. This is a mind-affecting fear effect.',
    },
    {
      name: 'Song of the Fallen',
      level: 14,
      description:
        'At 14th level, a skald can temporarily revive dead allies to continue fighting, with the same limitations as raise dead, by expending rounds of raging song. The dead ally is healed to 1 hit point and can act as though under the effects of the skald\'s inspired rage for as long as the skald continues the song.',
    },
    {
      name: 'Master Skald',
      level: 20,
      description:
        'At 20th level, a skald\'s inspired rage no longer gives allies a penalty to AC, and the bonuses it provides increase to +4 morale bonus on Will saves and +6 morale bonus to Strength and Constitution. In addition, allies affected by the skald\'s raging song who are knocked unconscious or killed can continue to benefit from the song for 1 round after the effect that would normally end the song.',
    },
  ],
};
