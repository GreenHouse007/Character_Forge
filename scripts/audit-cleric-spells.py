import re
from collections import Counter
from pathlib import Path

spell_file = Path('src/data/spells/cleric.ts')
text = spell_file.read_text()
name_pattern = r"\n\s*name: '((?:\\'|[^'])*)',"

expected_by_level = {
    0: {
        'Bleed', 'Create Water', 'Detect Magic', 'Detect Poison', 'Guidance', 'Light',
        'Mending', 'Purify Food and Drink', 'Read Magic', 'Resistance', 'Stabilize', 'Virtue',
    },
    1: {
        'Bane', 'Bless', 'Bless Water', 'Cause Fear', 'Command', 'Comprehend Languages',
        'Cure Light Wounds', 'Detect Chaos', 'Detect Evil', 'Detect Good', 'Detect Law',
        'Detect Undead', 'Divine Favor', 'Doom', 'Endure Elements', 'Entropic Shield',
        'Hide from Undead', 'Inflict Light Wounds', 'Magic Stone', 'Magic Weapon',
        'Obscuring Mist', 'Protection from Chaos', 'Protection from Evil',
        'Protection from Good', 'Protection from Law', 'Remove Fear', 'Sanctuary',
        'Shield of Faith', 'Summon Monster I',
    },
    2: {
        'Aid', 'Align Weapon', 'Augury', "Bear's Endurance", "Bull's Strength",
        'Calm Emotions', 'Consecrate', 'Cure Moderate Wounds', 'Darkness', 'Death Knell',
        'Delay Poison', "Eagle's Splendor", 'Enthrall', 'Find Traps', 'Gentle Repose',
        'Hold Person', 'Inflict Moderate Wounds', 'Make Whole', "Owl's Wisdom",
        'Remove Paralysis', 'Resist Energy', 'Restoration, Lesser', 'Shatter',
        'Shield Other', 'Silence', 'Sound Burst', 'Spiritual Weapon', 'Status',
        'Summon Monster II', 'Undetectable Alignment', 'Zone of Truth',
    },
    3: {
        'Bestow Curse', 'Cure Serious Wounds', 'Inflict Serious Wounds', 'Magic Circle against Evil',
        'Prayer', 'Remove Curse', 'Remove Disease', 'Searing Light',
    },
    4: {
        'Cure Critical Wounds', 'Death Ward', 'Dismissal', 'Divine Power', 'Freedom of Movement',
        'Inflict Critical Wounds', 'Neutralize Poison', 'Restoration', 'Sending', 'Spell Immunity',
    },

    5: {
        'Atonement', 'Breath of Life', 'Commune', 'Flame Strike', 'Raise Dead',
        'Righteous Might', 'Slay Living', 'True Seeing',
    },
    6: {
        'Banishment', 'Blade Barrier', 'Harm', 'Heal', 'Word of Recall',
    },
    7: {
        'Destruction', 'Regenerate', 'Repulsion', 'Resurrection', 'Scrying, Greater',
    },
    8: {
        'Earthquake', 'Fire Storm', 'Holy Aura', 'Planar Ally, Greater', 'Symbol of Death',
    },
    9: {
        'Gate', 'Heal, Mass', 'Implosion', 'Miracle', 'True Resurrection',
    },
}

levels_to_check = sorted(expected_by_level.keys())
level_names = {level: [] for level in levels_to_check}
ids = []
metadata_issues = []

for block in re.findall(r"\{\n(.*?)\n\s*\},", text, flags=re.S):
    level_match = re.search(r"level:\s*\{([^}]*)\}", block, flags=re.S)
    if not level_match:
        continue
    levels = dict((k, int(v)) for k, v in re.findall(r"([A-Za-z]+):\s*(\d)", level_match.group(1)))
    if 'Cleric' not in levels or levels['Cleric'] not in level_names:
        continue

    level = levels['Cleric']
    name_match = re.search(name_pattern, '\n' + block)
    if not name_match:
        continue
    name = name_match.group(1).replace("\\'", "'")
    level_names[level].append(name)

    id_match = re.search(r"\n\s*id: '([^']+)',", '\n' + block)
    if id_match:
        ids.append(id_match.group(1))

    required_fields = [
        'id:', 'componentDetails:', 'materialsRequired:', 'materialCostGp:', 'materialsConsumed:',
        'hasFocus:', 'isRitual:', 'isDismissible:', 'tags:', 'fullDescription:', 'sourceDetails:',
    ]
    if any(field not in block for field in required_fields):
        metadata_issues.append(name)

print('Cleric spell audit (levels 0-9)')
print('==============================')
for level in levels_to_check:
    found = set(level_names[level])
    expected = expected_by_level[level]
    missing = sorted(expected - found)
    extras = sorted(found - expected)
    duplicates = sorted([k for k, v in Counter(level_names[level]).items() if v > 1])
    print(f'Level {level}: expected={len(expected)} found={len(found)} duplicates={len(duplicates)} missing={len(missing)} extras={len(extras)}')
    if missing:
        print('  Missing:', ', '.join(missing))
    if extras:
        print('  Extras:', ', '.join(extras))
    if duplicates:
        print('  Duplicates:', ', '.join(duplicates))

id_dupes = sorted([k for k, v in Counter(ids).items() if v > 1])
print(f'\nDuplicate ids (levels 0-9): {", ".join(id_dupes) if id_dupes else "none"}')
print(f'Metadata issues (levels 0-9): {len(metadata_issues)}')
if metadata_issues:
    for name in metadata_issues:
        print(f'  - {name}')
