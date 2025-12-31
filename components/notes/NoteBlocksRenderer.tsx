import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, text as textTokens } from '@/components/ui/tokens';
import { NoteBlock } from '@/types/notes';

type NoteBlocksRendererProps = {
  blocks: NoteBlock[];
};

export function NoteBlocksRenderer({ blocks }: NoteBlocksRendererProps) {
  if (!blocks.length) return null;

  return (
    <View style={styles.container}>
      {blocks.map((block) => {
        if (block.type === 'heading') {
          return (
            <Text key={block.id} style={styles.heading}>
              {block.text}
            </Text>
          );
        }

        if (block.type === 'paragraph') {
          return (
            <Text key={block.id} style={styles.paragraph}>
              {block.text}
            </Text>
          );
        }

        return <View key={block.id} style={styles.divider} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  heading: {
    ...textTokens.title,
    color: colors.text,
    fontWeight: '600',
  },
  paragraph: {
    ...textTokens.body,
    color: colors.text,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
});
