import { Platform } from 'react-native';

/**
 * Design tokens taken from the "Finalized screens" page in the Figma file.
 *
 *   ink               #3D2000
 *   ink on gold       #FFFCF6
 *   header gold       #D7BD57
 *   parchment         #EAD6BB
 *   card              rgba(255,252,246,0.55)
 *   muted             #796344
 *   roll green        #30432A
 *
 * The display face is IM Fell English (bundled in assets/fonts), a free
 * old-style serif that stands in for Kingthings Petrock. Body copy uses the
 * platform UI sans, standing in for Lingo.
 */
export const colors = {
  ink: '#3d2000',
  inkSoft: '#6b4a24',
  muted: '#796344',

  cream: '#fffcf6',
  gold: '#d7bd57',
  goldDark: '#b8892c',
  goldLight: '#e9d39b',

  parchment: '#ead6bb',
  parchmentLight: '#f4e8d2',
  parchmentDeep: '#e3cbab',

  card: 'rgba(255, 252, 246, 0.55)',
  cardSolid: '#f9efdc',
  cardDeep: 'rgba(234, 214, 187, 0.72)',

  border: '#3d2000',
  borderSoft: 'rgba(61, 32, 0, 0.3)',

  green: '#30432a',
  greenLight: '#5c7a3a',
  hp: '#7d1d1d',
  hpTrack: '#d9bda0',

  white: '#ffffff',
  backdrop: '#1d1710',
  scrim: 'rgba(24, 14, 4, 0.55)',
  shadow: '#2b1a08',
} as const;

export const fonts = {
  display: 'IM Fell English',
  displayItalic: 'IM Fell English Italic',
  /** Lining numerals for scores, coins, hit points and dice labels. */
  numeral: 'MedievalSharp',
  body: Platform.select({
    ios: 'Avenir Next',
    android: 'sans-serif',
    web: 'system-ui',
    default: 'sans-serif',
  }),
  data: Platform.select({
    ios: 'Avenir Next',
    android: 'sans-serif',
    web: 'system-ui',
    default: 'sans-serif',
  }),
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  card: 4,
  sm: 6,
  md: 10,
  sheet: 28,
  pill: 999,
} as const;

export const HEADER_HEIGHT = 178;
export const ABILITY_HEIGHT = 75;
export const SHEET_WIDTH = 390;

export const paperShadow = {
  shadowColor: colors.shadow,
  shadowOpacity: 0.14,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,
} as const;
