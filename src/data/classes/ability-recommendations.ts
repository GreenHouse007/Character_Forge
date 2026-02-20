import { ClassName } from '@/types/class';
import { AbilityScore } from '@/types/common';

export interface AbilityRecommendation {
  primary: [AbilityScore, AbilityScore];
  reason: string;
}

export const CLASS_ABILITY_RECOMMENDATIONS: Record<ClassName, AbilityRecommendation> = {
  Barbarian:    { primary: ['str', 'con'], reason: 'STR drives melee attacks; CON maximizes your large hit die and rage endurance' },
  Bard:         { primary: ['cha', 'dex'], reason: 'CHA powers spells and performances; DEX improves AC and initiative' },
  Cleric:       { primary: ['wis', 'str'], reason: 'WIS governs spells and channel energy; STR for melee combat' },
  Druid:        { primary: ['wis', 'con'], reason: 'WIS powers spells; CON keeps you alive in and out of wild shape' },
  Fighter:      { primary: ['str', 'con'], reason: 'STR maximizes attacks and damage; CON gives hit points and Fortitude' },
  Monk:         { primary: ['wis', 'dex'], reason: 'WIS adds to AC; DEX improves attacks, AC, and Reflex saves' },
  Paladin:      { primary: ['str', 'cha'], reason: 'STR for melee; CHA powers Divine Grace, Lay on Hands, and spells' },
  Ranger:       { primary: ['dex', 'wis'], reason: 'DEX for ranged attacks and AC; WIS for spells and Perception' },
  Rogue:        { primary: ['dex', 'int'], reason: 'DEX for sneak attack, AC, and Reflex; INT for bonus skill ranks' },
  Sorcerer:     { primary: ['cha', 'con'], reason: 'CHA is your casting stat; CON for hit points and concentration' },
  Wizard:       { primary: ['int', 'con'], reason: 'INT powers all spells and DCs; CON for survivability' },
  Alchemist:    { primary: ['int', 'dex'], reason: 'INT governs extracts and bomb DCs; DEX for bombs and AC' },
  Inquisitor:   { primary: ['wis', 'str'], reason: 'WIS for spells and Judgement; STR for melee combat' },
  Oracle:       { primary: ['cha', 'con'], reason: 'CHA is your casting stat; CON for hit points and Endurance mysteries' },
  Witch:        { primary: ['int', 'con'], reason: 'INT powers hexes and spells; CON for hit points and concentration' },
  Magus:        { primary: ['int', 'str'], reason: 'INT for spells and Spellstrike DCs; STR for melee damage' },
  Arcanist:     { primary: ['int', 'cha'], reason: 'INT is the primary casting stat; CHA for spontaneous heritage exploits' },
  Bloodrager:   { primary: ['str', 'con'], reason: 'STR for bloodrage melee; CON extends bloodrage duration and hit points' },
  Investigator: { primary: ['int', 'dex'], reason: 'INT powers inspiration and extracts; DEX for AC and Reflex' },
  Slayer:       { primary: ['str', 'dex'], reason: 'STR or DEX depending on build; DEX for ranged/finesse, STR for two-handed' },
  Swashbuckler: { primary: ['dex', 'cha'], reason: 'DEX powers Precise Strike and AC; CHA generates and increases panache pool' },
  Skald:        { primary: ['str', 'cha'], reason: 'STR for melee; CHA for raging song and spell DCs' },
  Summoner:     { primary: ['cha', 'con'], reason: 'CHA scales your eidolon and spells; CON for hit points and concentration' },
  UnSummoner:   { primary: ['cha', 'con'], reason: 'CHA scales your eidolon and spells; CON for hit points and concentration' },
  Shaman:       { primary: ['wis', 'cha'], reason: 'WIS for prepared spells; CHA for hex and spirit power DCs' },
  Hunter:       { primary: ['wis', 'dex'], reason: 'WIS for spells; DEX for ranged attacks and AC alongside your animal companion' },
  Warpriest:    { primary: ['wis', 'str'], reason: 'WIS for spells and blessings; STR for sacred weapon melee attacks' },
  Antipaladin:  { primary: ['str', 'cha'], reason: 'STR for melee; CHA powers Cruelties, Touch of Corruption, and spells' },
  Psychic:      { primary: ['int', 'wis'], reason: 'INT is your primary casting stat; WIS buffers Will saves and amplified disciplines' },
  Mesmerist:    { primary: ['cha', 'dex'], reason: 'CHA for hypnotic stare and spells; DEX for AC and Reflex saves' },
  Occultist:    { primary: ['int', 'con'], reason: 'INT powers implements and mental focus; CON for hit points' },
  Spiritualist: { primary: ['wis', 'cha'], reason: 'WIS for spells; CHA influences your phantom and incorporeal abilities' },
  Medium:       { primary: ['cha', 'wis'], reason: 'CHA for channeling spirits and occult skills; WIS for saves and Perception' },
};
