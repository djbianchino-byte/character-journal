import type { ReactNode } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, fonts, paperShadow, radius } from '../theme';

const quillIcon = require('../../assets/ui/icon-quill.png');

type PaperCardProps = {
  label?: string;
  title?: string;
  onAction?: () => void;
  actionLabel?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Ruled parchment panel. Matches the cards on the finalized skill screen. */
export function PaperCard({
  label,
  title,
  onAction,
  actionLabel = 'Edit',
  children,
  style,
}: PaperCardProps) {
  return (
    <View style={[styles.card, style]}>
      {label || title || onAction ? (
        <View style={styles.head}>
          <View style={styles.headText}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            {title ? <Text style={styles.title}>{title}</Text> : null}
          </View>
          {onAction ? (
            <Pressable
              onPress={onAction}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={actionLabel}
              style={styles.action}
            >
              <Image source={quillIcon} style={styles.quill} resizeMode="contain" />
            </Pressable>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
  last?: boolean;
  emphasis?: boolean;
};

/** Label on the left, display value on the right, hairline beneath. */
export function InfoRow({ label, value, last, emphasis }: InfoRowProps) {
  const short = value.length <= 12 && /\d/.test(value);
  return (
    <View style={[styles.infoRow, !last && styles.infoBorder]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text
        style={[
          styles.infoValue,
          !short && styles.infoValueText,
          emphasis && styles.infoValueLarge,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <Text style={styles.kicker}>{children}</Text>;
}

export function PageTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.pageTitle}>{children}</Text>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: 14,
    ...paperShadow,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headText: {
    flex: 1,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.ink,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 23,
    lineHeight: 26,
    color: colors.ink,
    marginTop: 1,
  },
  action: {
    paddingLeft: 12,
    paddingTop: 2,
  },
  quill: {
    width: 19,
    height: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  infoBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  infoLabel: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19,
    color: colors.inkSoft,
  },
  infoValue: {
    fontFamily: fonts.numeral,
    fontSize: 19,
    lineHeight: 22,
    color: colors.ink,
    marginLeft: 12,
  },
  infoValueText: {
    fontFamily: fonts.display,
    fontSize: 17,
  },
  infoValueLarge: {
    fontSize: 24,
  },
  kicker: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  pageTitle: {
    fontFamily: fonts.display,
    fontSize: 31,
    lineHeight: 34,
    color: colors.ink,
  },
});
