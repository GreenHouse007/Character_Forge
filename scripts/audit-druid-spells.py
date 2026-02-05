import re
from collections import Counter
from pathlib import Path

spell_file = Path('src/data/spells/druid.ts')
text = spell_file.read_text()

name_pattern = r"\n\s*name: '((?:\\'|[^'])*)',"

expected_by_level = {
    0: {
        'Create Water', 'Detect Magic', 'Detect Poison', 'Flare', 'Guidance', 'Know Direction',
        'Light', 'Mending', 'Purify Food and Drink', 'Read Magic', 'Resistance',
    },
    1: {
        'Calm Animals', 'Charm Animal', 'Detect Animals or Plants', 'Detect Snares and Pits',
        'Endure Elements', 'Entangle', 'Faerie Fire', 'Goodberry', 'Hide from Animals', 'Jump',
        'Longstrider', 'Magic Fang', 'Magic Stone', 'Obscuring Mist', 'Pass without Trace',
        'Produce Flame', 'Shillelagh', 'Speak with Animals', "Summon Nature's Ally I",
    },
    2: {
        'Animal Messenger', 'Animal Trance', 'Barkskin', "Bear's Endurance", "Bull's Strength",
        "Cat's Grace", 'Chill Metal', 'Delay Poison', 'Fire Trap', 'Flame Blade',
        'Flaming Sphere', 'Fog Cloud', 'Gust of Wind', 'Heat Metal', 'Hold Animal',
        "Owl's Wisdom", 'Reduce Animal', 'Resist Energy', 'Restoration, Lesser',
        'Soften Earth and Stone', "Summon Nature's Ally II", 'Summon Swarm', 'Tree Shape',
        'Warp Wood', 'Wood Shape',
    },
    3: {
        'Call Lightning', 'Contagion', 'Cure Moderate Wounds', 'Daylight', 'Diminish Plants',
        'Dominate Animal', 'Greater Magic Fang', 'Meld into Stone', 'Neutralize Poison',
        'Plant Growth', 'Poison', 'Protection from Energy', 'Quench', 'Remove Disease',
        'Sleet Storm', 'Snare', 'Speak with Plants', 'Spike Growth', 'Stone Shape',
        "Summon Nature's Ally III", 'Water Breathing', 'Wind Wall',
    },

    4: {
        'Air Walk', 'Antiplant Shell', 'Blight', 'Command Plants', 'Control Water',
        'Cure Serious Wounds', 'Dispel Magic', 'Flame Strike', 'Freedom of Movement',
        'Giant Vermin', 'Reincarnate', 'Repel Vermin', 'Rusting Grasp', 'Scrying',
        'Spike Stones', "Summon Nature's Ally IV",
    },
    5: {
        'Animal Growth', 'Atonement', 'Baleful Polymorph', 'Call Lightning Storm',
        'Commune with Nature', 'Control Winds', 'Cure Critical Wounds', 'Death Ward',
        'Hallow', 'Insect Plague', 'Stoneskin', "Summon Nature's Ally V",
        'Transmute Mud to Rock', 'Transmute Rock to Mud', 'Tree Stride', 'Unhallow',
        'Wall of Fire', 'Wall of Thorns',
    },

    6: {
        'Antilife Shell', 'Find the Path', 'Fire Seeds', 'Heal', 'Liveoak', 'Move Earth',
        'Spellstaff', 'Stone Tell', "Summon Nature's Ally VI", 'Transport via Plants',
        'Wall of Stone',
    },
    7: {
        'Animate Plants', 'Changestaff', 'Control Weather', 'Creeping Doom', 'Fire Storm',
        'Repel Wood', "Summon Nature's Ally VII", 'Sunbeam', 'Transmute Metal to Wood',
        'True Seeing', 'Wind Walk',
    },
    8: {
        'Animal Shapes', 'Control Plants', 'Earthquake', 'Finger of Death',
        'Repel Metal or Stone', 'Reverse Gravity', "Summon Nature's Ally VIII", 'Sunburst',
        'Whirlwind',
    },
    9: {
        'Elemental Swarm', 'Foresight', 'Regenerate', 'Shapechange', 'Storm of Vengeance',
        "Summon Nature's Ally IX",
    },
}

level_names = {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []}
ids_0_9 = []
metadata_issues = []

for block in re.findall(r"\{\n(.*?)\n\s*\},", text, flags=re.S):
    level_match = re.search(r"level:\s*\{([^}]*)\}", block, flags=re.S)
    if not level_match:
        continue
    levels = dict((k, int(v)) for k, v in re.findall(r"([A-Za-z]+):\s*(\d)", level_match.group(1)))
    if 'Druid' not in levels or levels['Druid'] not in level_names:
        continue

    level = levels['Druid']
    name_match = re.search(name_pattern, '\n' + block)
    if not name_match:
        continue
    name = name_match.group(1).replace("\\'", "'")
    level_names[level].append(name)

    id_match = re.search(r"\n\s*id: '([^']+)',", '\n' + block)
    if id_match:
        ids_0_9.append(id_match.group(1))

    required_fields = [
        'id:',
        'componentDetails:',
        'materialsRequired:',
        'materialCostGp:',
        'materialsConsumed:',
        'hasFocus:',
        'isRitual:',
        'isDismissible:',
        'tags:',
        'fullDescription:',
        'sourceDetails:',
    ]
    if any(field not in block for field in required_fields):
        metadata_issues.append(name)

print('Druid spell audit (levels 0-9)')
print('=============================')

for level in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]:
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

id_dupes = sorted([k for k, v in Counter(ids_0_9).items() if v > 1])
print(f'\nDuplicate ids (levels 0-9): {", ".join(id_dupes) if id_dupes else "none"}')
print(f'Metadata issues (levels 0-9): {len(metadata_issues)}')
if metadata_issues:
    for name in metadata_issues:
        print(f'  - {name}')
