import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ABILITY_HEIGHT, HEADER_HEIGHT, SHEET_WIDTH } from '../theme';

/**
 * Where the character sheet sits on screen. On web the sheet is a centred
 * phone-width frame; on a phone it fills the window.
 */
export function useSheetFrame() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const framed = Platform.OS === 'web' && width >= 560;
  const sheetWidth = framed ? SHEET_WIDTH : width;
  const sheetHeight = framed ? Math.min(844, height - 48) : height;
  const top = framed ? (height - sheetHeight) / 2 : 0;
  const left = framed ? (width - SHEET_WIDTH) / 2 : 0;
  // Just below the ability strip, so panels never cover the scores.
  const anchor = top + (framed ? 0 : insets.top) + HEADER_HEIGHT + ABILITY_HEIGHT;

  return { framed, left, top, width: sheetWidth, height: sheetHeight, anchor };
}
