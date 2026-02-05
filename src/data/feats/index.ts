import { Feat, FeatCategory } from '@/types/feat';
import { combatFeats } from './combat';
import { generalFeats } from './general';
import { metamagicFeats } from './metamagic';
import { itemCreationFeats } from './item-creation';
import { criticalFeats } from './critical';
import { styleFeats } from './style';
import { teamworkFeats } from './teamwork';

export { combatFeats, generalFeats, metamagicFeats, itemCreationFeats, criticalFeats, styleFeats, teamworkFeats };

export const ALL_FEATS: Feat[] = [
  ...combatFeats,
  ...generalFeats,
  ...metamagicFeats,
  ...itemCreationFeats,
  ...criticalFeats,
  ...styleFeats,
  ...teamworkFeats,
];

export const FEATS_BY_NAME: Record<string, Feat> = ALL_FEATS.reduce(
  (acc, feat) => {
    acc[feat.name] = feat;
    return acc;
  },
  {} as Record<string, Feat>
);

export const FEATS_BY_CATEGORY: Record<FeatCategory, Feat[]> = {
  Combat: combatFeats,
  General: generalFeats,
  Metamagic: metamagicFeats,
  'Item Creation': itemCreationFeats,
  Critical: criticalFeats,
  Style: styleFeats,
  Teamwork: teamworkFeats,
};
