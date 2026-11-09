import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../theme';

type Props = {
  title: string;
  right?: ReactNode;
};

/** Display-face section heading (22pt) with an optional trailing control. */
export function SectionHeading({ title, right }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  title: {
    flexShrink: 1,
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 27,
    color: colors.textPrimary,
  },
  right: {
    flexShrink: 0,
  },
});
