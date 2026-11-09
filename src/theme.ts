import { Platform } from 'react-native';

/**
 * Design tokens derived from the "Character Journal • Foundations" frame
 * in the Figma file (parchment theme).
 *
 *   text/primary        #3D2000
 *   text/inverse        #FFFCF6
 *   surface/header-gold #D7BD57
 *   artwork/gold-400    #D7A659
 *   artwork/parchment   #EAD6BB
 *   border/default      #3D2000
 *
 * Fonts are approximated with platform serif faces so the prototype runs
 * without shipping the commercial "Kingthings Petrock" / "Lingo" fonts.
 */
export const colors = {
  textPrimary: '#3d2000',
  textInverse: '#fffcf6',
  textMuted: '#6f512b',
  textFaint: '#8b6f47',

  headerGold: '#d7bd57',
  gold400: '#d7a659',
  gold: '#b8892c',
  parchment200: '#ead6bb',

  parchmentBg: '#f7ecd3',
  parchmentDeep: '#efdfbf',
  parchmentEdge: '#e0c99e',

  card: '#fffdf7',
  cardAlt: '#fff8ea',
  white: '#ffffff',

  border: '#3d2000',
  borderSoft: '#c8b184',

  hp: '#7d1d1d',
  hpDark: '#5a1414',
  hpTrack: '#e6cdb2',
  green: '#5c7a3a',

  shadow: '#2b1a08',
  scrim: 'rgba(41, 19, 9, 0.35)',
  goldScrim: 'rgba(215, 189, 87, 0.22)',
} as const;

export const fonts = {
  // Medieval display face (Kingthings Petrock stand-in)
  display: Platform.select({ ios: 'Palatino', android: 'serif', default: 'serif' }),
  // Narrative body (Lingo stand-in)
  body: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  // Numeric / data face
  data: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
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
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
} as const;

export const cardShadow = {
  shadowColor: colors.shadow,
  shadowOpacity: 0.16,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
} as const;

export const HEADER_HEIGHT = 178;
export const TAB_BAR_HEIGHT = 62;
