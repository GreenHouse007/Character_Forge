import re
from collections import Counter
from pathlib import Path

spell_file = Path('src/data/spells/wizard.ts')
text = spell_file.read_text()

name_pattern = r"\n\s*name: '((?:\\'|[^'])*)',"
names = [m.replace("\\'", "'") for m in re.findall(name_pattern, text)]
ids = re.findall(r"\n\s*id: '([^']+)',", text)
levels = [int(v) for v in re.findall(r"Wizard:\s*(\d)", text)]

level_counts = Counter(levels)
missing_levels = [lvl for lvl in range(10) if level_counts.get(lvl, 0) == 0]


def duplicates(values):
    counts = Counter(values)
    return sorted([k for k, v in counts.items() if v > 1])


missing_metadata = []
for block in re.findall(r"\{\n(.*?)\n\s*\},", text, flags=re.S):
    name_match = re.search(name_pattern, '\n' + block)
    name = name_match.group(1).replace("\\'", "'") if name_match else '<unknown>'
    required_fields = [
        'id:',
        'componentDetails:',
        'materialsRequired:',
        'materialCostGp:',
        'materialsConsumed:',
        'isRitual:',
        'isDismissible:',
        'tags:',
        'fullDescription:',
        'sourceDetails:',
    ]
    if any(field not in block for field in required_fields):
        missing_metadata.append(name)

print('Wizard spell audit')
print('==================')
print(f'Total wizard spells: {len(names)}')
print('\nLevel counts:')
for lvl in range(10):
    print(f'  {lvl}: {level_counts.get(lvl, 0)}')

print(f"\nMissing wizard levels: {', '.join(map(str, missing_levels)) if missing_levels else 'none'}")
name_dupes = duplicates(names)
id_dupes = duplicates(ids)
print(f"Duplicate spell names: {', '.join(name_dupes) if name_dupes else 'none'}")
print(f"Duplicate spell ids: {', '.join(id_dupes) if id_dupes else 'none'}")
print(f'Spells missing required metadata fields: {len(missing_metadata)}')
if missing_metadata:
    for name in missing_metadata:
        print(f'  - {name}')

# Focused CRB completeness audit for wizard levels 0-9
expected_by_level = {
    0: {
        'Acid Splash', 'Arcane Mark', 'Bleed', 'Dancing Lights', 'Daze', 'Detect Magic',
        'Detect Poison', 'Disrupt Undead', 'Flare', 'Ghost Sound', 'Light', 'Mage Hand',
        'Mending', 'Message', 'Open/Close', 'Prestidigitation', 'Ray of Frost',
        'Read Magic', 'Resistance', 'Touch of Fatigue',
    },
    1: {
        'Alarm', 'Burning Hands', 'Cause Fear', 'Charm Person', 'Chill Touch', 'Color Spray',
        'Comprehend Languages', 'Detect Secret Doors', 'Disguise Self', 'Endure Elements',
        'Enlarge Person', 'Erase', 'Expeditious Retreat', 'Feather Fall', 'Floating Disk',
        'Grease', 'Hold Portal', 'Hypnotism', 'Identify', 'Jump', 'Mage Armor', 'Magic Aura',
        'Magic Missile', 'Mount', 'Obscuring Mist', 'Protection from Evil',
        'Ray of Enfeeblement', 'Reduce Person', 'Shield', 'Shocking Grasp', 'Silent Image',
        'Sleep', 'Summon Monster I', 'True Strike', 'Unseen Servant', 'Ventriloquism',
    },
    2: {
        'Acid Arrow', 'Alter Self', 'Arcane Lock', "Bear's Endurance", 'Blindness/Deafness',
        'Blur', "Bull's Strength", "Cat's Grace", 'Command Undead', 'Darkness', 'Darkvision',
        'Daze Monster', 'Detect Thoughts', 'False Life', 'Flaming Sphere', 'Fog Cloud',
        "Fox's Cunning", 'Ghoul Touch', 'Glitterdust', 'Gust of Wind', 'Hideous Laughter',
        'Hypnotic Pattern', 'Invisibility', 'Knock', 'Levitate', 'Locate Object', 'Minor Image',
        'Mirror Image', 'Pyrotechnics', 'Resist Energy', 'Rope Trick', 'Scare', 'Scorching Ray',
        'See Invisibility', 'Shatter', 'Spectral Hand', 'Spider Climb', 'Summon Monster II',
        'Summon Swarm', 'Touch of Idiocy', 'Web', 'Whispering Wind',
    },
    3: {
        'Arcane Sight', 'Blink', 'Clairaudience/Clairvoyance', 'Daylight', 'Deep Slumber',
        'Dispel Magic', 'Displacement', 'Explosive Runes', 'Fireball', 'Fly', 'Gaseous Form',
        'Gentle Repose', 'Halt Undead', 'Haste', 'Heroism', 'Hold Person', 'Keen Edge',
        'Lightning Bolt', 'Magic Circle against Evil', 'Magic Weapon, Greater', 'Major Image',
        'Nondetection', 'Phantom Steed', 'Protection from Energy', 'Rage', 'Ray of Exhaustion',
        'Secret Page', 'Sepia Snake Sigil', 'Sleet Storm', 'Slow', 'Stinking Cloud',
        'Suggestion', 'Tongues', 'Vampiric Touch', 'Water Breathing',
    },
    4: {
        'Animate Dead', 'Arcane Eye', 'Bestow Curse', 'Black Tentacles', 'Charm Monster',
        'Confusion', 'Contagion', 'Crushing Despair', 'Detect Scrying', 'Dimension Door',
        'Dimensional Anchor', 'Enervation', 'Fear', 'Fire Shield', 'Greater Invisibility',
        'Hallucinatory Terrain', 'Ice Storm', 'Illusory Wall', 'Lesser Globe of Invulnerability',
        'Locate Creature', 'Minor Creation', 'Mnemonic Enhancer', 'Phantasmal Killer',
        'Polymorph', 'Rainbow Pattern', 'Remove Curse', 'Resilient Sphere', 'Scrying',
        'Secure Shelter', 'Shadow Conjuration', 'Shout', 'Solid Fog', 'Stone Shape',
        'Stoneskin', 'Wall of Fire', 'Wall of Ice',
    },
    5: {
        'Baleful Polymorph', 'Break Enchantment', 'Cloudkill', 'Cone of Cold',
        'Contact Other Plane', 'Dismissal', 'Dominate Person', 'Dream', 'Fabricate',
        'Feeblemind', 'Hold Monster', "Mage's Faithful Hound", "Mage's Private Sanctum",
        'Major Creation', 'Mind Fog', 'Mirage Arcana', 'Nightmare', 'Overland Flight',
        'Passwall', 'Permanency', 'Persistent Image', 'Planar Binding', 'Prying Eyes',
        'Seeming', 'Sending', 'Telekinesis', 'Teleport', 'Transmute Mud to Rock',
        'Transmute Rock to Mud', 'Wall of Force', 'Wall of Stone',
    },
    6: {
        'Acid Fog', 'Analyze Dweomer', 'Antimagic Field', 'Banishment',
        "Bear's Endurance, Mass", "Bull's Strength, Mass", "Cat's Grace, Mass",
        'Chain Lightning', 'Circle of Death', 'Contingency', 'Create Undead', 'Disintegrate',
        "Eagle's Splendor, Mass", 'Flesh to Stone', 'Forceful Hand', 'Geas/Quest',
        'Globe of Invulnerability', 'Greater Dispel Magic', 'Heroism, Greater', 'Legend Lore',
        'Mislead', 'Move Earth', 'Permanent Image', 'Planar Binding, Greater', 'Repulsion',
        'Stone to Flesh', 'Suggestion, Mass', 'Summon Monster VI', 'Transformation',
        'True Seeing', 'Undeath to Death', 'Veil',
    },
    7: {
        'Arcane Sight, Greater', 'Delayed Blast Fireball', 'Ethereal Jaunt', 'Finger of Death',
        'Forcecage', 'Grasping Hand', 'Hold Person, Mass', 'Insanity', 'Invisibility, Mass',
        'Limited Wish', "Mage's Magnificent Mansion", "Mage's Sword", 'Phase Door',
        'Plane Shift', 'Power Word Blind', 'Prismatic Spray', 'Project Image',
        'Reverse Gravity', 'Scrying, Greater', 'Sequester', 'Shadow Conjuration, Greater',
        'Simulacrum', 'Statue', 'Summon Monster VII', 'Teleport Object', 'Teleport, Greater',
        'Vision', 'Waves of Exhaustion',
    },
    8: {
        'Antipathy', 'Binding', 'Clenched Fist', 'Create Greater Undead', 'Dimensional Lock',
        'Discern Location', 'Horrid Wilting', 'Incendiary Cloud', 'Iron Body', 'Maze',
        'Mind Blank', 'Moment of Prescience', 'Polar Ray', 'Polymorph Any Object',
        'Power Word Stun', 'Prismatic Wall', 'Protection from Spells', 'Screen',
        'Shadow Evocation, Greater', 'Shout, Greater', 'Summon Monster VIII', 'Sunburst',
        'Telekinetic Sphere', 'Trap the Soul',
    },
    9: {
        'Astral Projection', 'Dominate Monster', 'Energy Drain', 'Etherealness', 'Foresight',
        'Gate', 'Hold Monster, Mass', "Mage's Disjunction", 'Meteor Swarm', 'Power Word Kill',
        'Prismatic Sphere', 'Shapechange', 'Soul Bind', 'Summon Monster IX',
        'Teleportation Circle', 'Time Stop', 'Wail of the Banshee', 'Weird', 'Wish',
    },
}

wizard_level_names = {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []}
for block in re.findall(r"\{\n(.*?)\n\s*\},", text, flags=re.S):
    name_match = re.search(name_pattern, '\n' + block)
    if not name_match:
        continue
    name = name_match.group(1).replace("\\'", "'")
    level_match = re.search(r"level:\s*\{([^}]*)\}", block, flags=re.S)
    if not level_match:
        continue
    level_pairs = dict((k, int(v)) for k, v in re.findall(r"([A-Za-z]+):\s*(\d)", level_match.group(1)))
    if 'Wizard' in level_pairs and level_pairs['Wizard'] in wizard_level_names:
        wizard_level_names[level_pairs['Wizard']].append(name)

print('\nCRB 0-9 completeness audit (wizard list)')
print('=======================================')
for lvl in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]:
    found = set(wizard_level_names[lvl])
    expected = expected_by_level[lvl]
    missing = sorted(expected - found)
    extras = sorted(found - expected)
    duplicate_names = sorted([k for k, v in Counter(wizard_level_names[lvl]).items() if v > 1])
    print(f'Level {lvl}: expected={len(expected)} found={len(found)} duplicates={len(duplicate_names)} missing={len(missing)} extras={len(extras)}')
    if missing:
        print('  Missing:', ', '.join(missing))
    if extras:
        print('  Extras:', ', '.join(extras))
    if duplicate_names:
        print('  Duplicates:', ', '.join(duplicate_names))
