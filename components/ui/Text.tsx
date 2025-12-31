import React from 'react';
import { StyleSheet, Text as RNText, TextProps as RNTextProps } from 'react-native';

import { colors, text as textTokens } from './tokens';

type TextVariant = 'display' | 'title' | 'subtitle' | 'body' | 'caption' | 'overline';
type TextWeight = 'regular' | 'semibold' | 'bold';

export type AppTextProps = RNTextProps & {
  variant?: TextVariant;
  muted?: boolean;
  weight?: TextWeight;
};

const variantStyles: Record<TextVariant, object> = {
  display: textTokens.display,
  title: textTokens.title,
  subtitle: textTokens.subtitle,
  body: textTokens.body,
  caption: textTokens.caption,
  overline: textTokens.overline,
};

const weightStyles: Record<TextWeight, object> = {
  regular: { fontWeight: '500' },
  semibold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
};

export function Text({ variant = 'body', muted = false, weight, style, ...rest }: AppTextProps) {
  return (
    <RNText
      {...rest}
      style={[
        styles.base,
        variantStyles[variant],
        muted ? styles.muted : styles.text,
        weight ? weightStyles[weight] : null,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.text,
  },
  text: {
    color: colors.text,
  },
  muted: {
    color: colors.mutedText,
  },
});

export default Text;
