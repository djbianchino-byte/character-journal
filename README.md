# Character Journal — Expo Prototype

An Expo (React Native) prototype built from the Figma screens **Character • Overview**,
**Character • Abilities & Skills**, and **Character • Biography / Lore** in the
`Module3 2` file.

The UI is assembled from reusable components that mirror the Figma component
structure (header, ability strip, cards, skill table, lore sections, HUD, dice).

## Screens

| Route | Screen | Figma source |
| --- | --- | --- |
| `/` | Character Home | `Character • Overview` (`1:308` / `1:4511`) |
| `/skills` | Abilities & Skills | `Character • Abilities & Skills` (`1:383`) |
| `/lore` | Character Lore | `Character • Biography` (`1:461`) |
| `/inventory` | Inventory | Nav-rail inventory tab (bonus screen) |

Navigation is handled by **Expo Router** with routes in `src/app/`.

## Component library

All reusable UI lives in `src/components/`:

| Component | Purpose | Figma counterpart |
| --- | --- | --- |
| `CharacterHeader` | Gold banner: back, edit, name, class line, portrait | `Character Header` |
| `AbilityScores` | Six-column STR→CHA strip | `Overview Content` ability row |
| `CombatHud` | Armor Class · Initiative · Hit Points tiles | HUD rail (AC / initiative / HP) |
| `Card` | Parchment card with ruled header + edit action | Content cards |
| `SavingThrowsSensesCard` | Saving throws and senses | `Saving Throws & Senses` |
| `SkillsTable` | Proficiency bonus + 18-skill table | `Skills` card |
| `LoreSections` | Appearance, backstory, relationships | `Biography Sections` |
| `OrnamentalDivider` | Rule + diamond section divider | Section dividers |
| `DiceButton` | Floating d20 roller with result bubble | `D20` roll button |
| `TabBar` | Bottom app navigation | Nav rail |
| `ScreenScaffold` | Parchment background, scroll area, FAB, tab bar | Screen shell |

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
```

Validation used while building:

```bash
npx tsc --noEmit
npx expo-doctor
npx expo export --platform android
```

## Notes

- Built with Expo SDK 58, React Native 0.88, React 19.3, and Expo Router 58.
- `src/app/` is the router root (non-route code stays outside it).
- The lore prose is adapted from the Figma `Biography Sections` component and
  rewritten for the selected character (Ser Garyth) so the screens read consistently.
- The dice FAB and action buttons are interactive; edit/add affordances show a
  prototype notice because persistence is out of scope.
