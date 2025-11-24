# Final Fantasy Tactics: The Ivalice Chronicles - Challenge Run Generator

A web-based tool for generating randomized challenge runs for Final Fantasy Tactics. Create custom challenge runs with various restrictions, party compositions, and special modes.

## Features

- **Multiple Challenge Modes**: Choose from Normal, Humans Only, Monstrous, Five Job Fiesta, and Cavalry modes
- **Flexible Party Generation**: Generate parties with customizable sizes (1-5 members)
- **Character Customization**: Support for human characters, monsters, and unique characters
- **Secondary Jobs**: Optional secondary job system for human characters
- **Run Restrictions**: Configure shop usage and random battle rules
- **Interactive UI**: Real-time party member customization with dropdown menus
- **Run Summary**: Automatically generated summary of your challenge run rules

## Challenge Modes

### Normal
The default mode with no special restrictions. Allows any combination of human characters and monsters based on your settings.

### Humans Only
Only human characters are allowed (no monsters). Ramza plus human party members with standard or unique character jobs.

### Monstrous
Can only use monsters (except for Ramza). Ramza remains human, but all other party members must be monsters from various families.

### Five Job Fiesta
Randomly selects 5 jobs from the standard human job pool. These are the only jobs allowed for the entire run. Characters can mix/match abilities and change between these jobs. 
- **Restrictions**: Party size is locked to 5 (full party), unique characters are not allowed, secondary jobs are not available

### Cavalry
You get 2 human units and 2 chocobos. The human characters must mount the birds on their first turn. No other characters allowed.
- **Restrictions**: Party size is locked to 4

## Settings

### Party Size
Select the number of party members (1-5). Option "*" represents a full party of 5. Some challenge modes lock this setting.

### Shops
- **Normal**: Standard shop usage
- **Items Only**: You cannot buy equipment from shops (except for poaches)
- **Strict**: You cannot buy anything from shops (except for poaches)

### Random Battles
- **Normal**: Standard random battle rules
- **Forbidden**: You must skip all random battles

### Secondary Jobs
- **Allowed**: Human characters can have secondary jobs
- **Disallowed**: Secondary jobs are hidden and not used

### Unique Characters
- **Allowed**: Unique character jobs (Mustadio, Agrias, Rapha, Marach, Cloud, Beowulf, Reis, Orlandeau, Meliadoul) and unique monster families (Construct 8, Byblos) are available
- **Disallowed**: Only standard human jobs and regular monster families are available

## Usage

1. **Select Challenge Mode**: Choose one of the available challenge modes from the left panel
2. **Configure Settings**: Adjust party size, shop rules, random battles, secondary jobs, and unique characters as desired
3. **Customize Party Members** (if applicable): Use the dropdown menus in the Party Members panel to select specific jobs, character types, and monster families
4. **Generate Run**: 
   - Click **Randomize** to randomize all settings and generate a new run
   - Click **Reroll Party** to keep current settings but generate new party members
5. **Review Summary**: Check the Run Summary panel for a complete overview of your challenge run

## Character Types

### Human Characters
Standard human jobs include: Squire, Chemist, Knight, Archer, White Mage, Black Mage, Monk, Thief, Oracle, Time Mage, Geomancer, Dragoon, Orator, Summoner, Samurai, Ninja, Arithmetician, Dancer, Bard, Mime.

Unique character jobs (when allowed): Mustadio, Agrias, Rapha, Marach, Cloud, Beowulf, Reis, Orlandeau, Meliadoul.

### Monster Families
Monsters are organized into families. Each family has multiple types:
- Chocobo Family (Chocobo, Black Chocobo, Red Chocobo)
- Goblin Family (Goblin, Black Goblin, Gobbledygook)
- Bomb Family (Bomb, Grenade, Exploder)
- Panther Family (Red Panther, Coeurl, Vampire Cat)
- Mindflayer Family (Piscodemon, Squidrakin, Mindflayer)
- Skeleton Family (Skeleton, Bonesnatch, Skeletal Fiend)
- Ghost Family (Ghoul, Ghast, Revenant)
- Ahriman Family (Floating Eye, Ahriman, Plague Horror)
- Aevis Family (Jura Aevis, Steelhawk, Cockatrice)
- Pig Family (Pig, Swine, Wild Boar)
- Treant Family (Dryad, Treant, Elder Treant)
- Minotaur Family (Wisenkin, Minotaur, Sekhret)
- Malboro Family (Malboro, Ochu, Great Malboro)
- Behemoth Family (Behemoth, Behemoth King, Dark Behemoth)
- Dragon Family (Dragon, Blue Dragon, Red Dragon)
- Hydra Family (Hydra, Greater Hydra, Tiamat)

Unique monster families (when allowed): Construct 8, Byblos

## Technical Details

### File Structure
```
fft-run-generator/
├── index.html          # Main HTML structure
├── script.js           # Modular JavaScript application
├── styles.css          # Styling
├── fonts/              # Custom fonts
└── images/             # Background images
```

### Code Architecture

The JavaScript code is organized into modular components:

- **Data**: Contains all game data (jobs, monster families, etc.)
- **Utils**: Utility functions (random selection, shuffling, DOM helpers)
- **PartyMemberUI**: Handles UI for party member dropdowns and interactions
- **CharacterGenerator**: Generates character objects from dropdown selections
- **SpecialModes**: Implements special challenge mode generation logic
- **RunGenerator**: Main orchestration for generating runs
- **Renderer**: Renders the run summary
- **Settings**: Handles settings randomization and reset

### Browser Compatibility

Works in all modern browsers that support ES6 JavaScript features. No external dependencies required.

## Notes

- Regardless of run rules, random battles can be used to unlock jobs or recruit monsters as necessary
- The generator automatically randomizes the challenge mode on page load
- When secondary jobs are allowed, they are automatically assigned to human characters during generation
- Unique characters can have secondary jobs, but they will always be standard human jobs (not other unique characters)

## License

This project uses custom fonts with their own licenses. Please refer to the respective font license files in the `fonts/` directory.

