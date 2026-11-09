# The Ashen Crown — Campaign Journal (Expo prototype)

An Expo (React Native) prototype built from the Figma screens in the `Module3 2` file:
the character sheet screens plus the campaign-level screens **Campaign Detail**,
**Characters**, and **Location / Lore**.

The campaign reference frames ship with a violet navigation bar; here they are rebuilt in
the same parchment design system as the character screens, reusing the existing tokens,
cards, dividers and custom `TabBar`.

## Screens

| Route | Screen | Figma source |
| --- | --- | --- |
| `/` | Campaign detail — next session, notes, explore shortcuts | `Campaign Detail Screen` (`59:2842`) |
| `/characters` | Player roster + NPCs | `Characters Screen` (`59:2775`) |
| `/lore` | Campaign lore: Story / Locations / Events / Artifacts | `Location Screen` (`59:2795`) |
| `/tabletop` | Dice tray, session and party tools | `Tabletop` nav (bonus screen) |
| `/notes` | Last session recap, loot, next session | `Last session’s notes` row |
| `/location/[id]` | Location detail | `Location` card instance |
| `/character` | Character sheet — Ser Garyth | `Character • Overview` (`1:308` / `1:4511`) |
| `/character/skills` | Abilities & skills | `Character • Abilities & Skills` (`1:383`) |
| `/character/lore` | Character biography | `Character • Biography` (`1:461`) |
| `/character/inventory` | Inventory | Nav-rail inventory tab (bonus screen) |

Navigation is handled by **Expo Router** with routes in `src/app/`. The bottom tabs are
Campaign, Characters, Lore and Tabletop; the character sheet is a detail route reached
from the roster (`Ser Garyth` row).

## Component library

All reusable UI lives in `src/components/`:

| Component | Purpose | Figma counterpart |
| --- | --- | --- |
| `CampaignHeader` | Campaign banner: circular back/more, title, subtitle | `Campaign Header` |
| `CharacterHeader` | Character banner: back, edit, name, class line, portrait | `Character Header` |
| `CharacterRow` | Player (72pt) and NPC (56pt) roster row | `Character row · Player` / `· NPC` |
| `LocationCard` | Location name, region, summary, chevron | `Location` |
| `AddRow` | Dashed add row for characters, NPCs, locations | `Add character` / `Button · Add` |
| `SectionHeading` | Display-face section heading (22pt) | `Description` headings |
| `SortToggle` | A–Z / Date created control | `Sort · Alphabetical` |
| `SegmentedTabs` | Folder tabs for the lore sections | `Character Tabs` |
| `AbilityScores` | Six-column STR→CHA strip | `Overview Content` ability row |
| `CombatHud` | Armor Class · Initiative · Hit Points tiles | HUD rail (AC / initiative / HP) |
| `Card` | Parchment card with ruled header + edit action | Content cards |
| `SavingThrowsSensesCard` | Saving throws and senses | `Saving Throws & Senses` |
| `SkillsTable` | Proficiency bonus + 18-skill table | `Skills` card |
| `LoreSections` | Appearance, backstory, relationships | `Biography Sections` |
| `OrnamentalDivider` | Rule + diamond section divider | Section dividers |
| `DiceButton` | Floating d20 roller with result bubble | `D20` roll button |
| `TabBar` | Bottom app navigation | Campaign nav |
| `ScreenScaffold` | Parchment background, phone-width web frame, scroll area, FAB, tab bar | Screen shell |

## Data

- `src/data/character.ts` — Ser Garyth (Human Paladin 3): abilities, combat, skills, lore, inventory.
- `src/data/campaign.ts` — The Ashen Crown: metadata, party, NPCs, nine locations, events, artifacts, session notes.

## Design tokens

Taken from `Character Journal • Foundations` (`src/theme.ts`):

- `text/primary` `#3D2000`
- `text/inverse` `#FFFCF6`
- `surface/header-gold` `#D7BD57`
- `artwork/gold-400` `#D7A659`
- `artwork/parchment` `#EAD6BB`
- `border/default` `#3D2000`

Fonts in the Figma file are **Kingthings Petrock** (display) and **Lingo** (body).
Those are commercial faces, so the prototype uses platform serif/mono fallbacks
(`Palatino` / `Georgia` / `Courier` on iOS, `serif` / `monospace` on Android) to
keep the app self-contained and offline-friendly.

## Run

```bash
npm install
npm start          # Expo dev server (press a / i / w)
npm run android    # open on Android
npm run ios        # open on iOS (macOS)
npm run web        # open in the browser
npm run build:web  # static web build in dist-web/
```

The web build is a single-page export. Serve `dist-web/` with any static server, e.g.:

```bash
npx serve dist-web
```

Validation used while building:

```bash
npx tsc --noEmit
npx expo lint
npx expo-doctor
npm run build:web
```

## Notes

- Built with Expo SDK 58, React Native 0.88, React 19.3, and Expo Router 58.
- `src/app/` is the router root (non-route code stays outside it).
- Campaign copy is adapted from the Figma frames; story, events, artifacts and NPCs were
  written to keep every tab populated.
- Edit/add affordances show a prototype notice because persistence is out of scope.
- On web the shell is constrained to a 430px phone-width column so the prototype reads
  like the mobile design instead of stretching across a desktop window.
