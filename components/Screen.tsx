import React from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from './ui/tokens';

interface ScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  scroll?: boolean;
  padded?: boolean;
}

export function Screen({ children, style, contentStyle, scroll = false, padded = true }: ScreenProps) {
  const paddingStyle = padded ? styles.padded : styles.unpadded;
  const contentStyles = [styles.content, paddingStyle, style, contentStyle];

  if (scroll) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.base}
          contentContainerStyle={contentStyles}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.base, styles.contentWrapper]}>
        <View style={contentStyles}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  base: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentWrapper: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: spacing.md,
  },
  padded: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  unpadded: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});
