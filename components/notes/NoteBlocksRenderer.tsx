import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/components/ui/tokens';
import { Text } from '@/components/ui/Text';
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
            <Text key={block.id} variant="subtitle" style={styles.heading}>
              {block.text}
            </Text>
          );
        }

        if (block.type === 'paragraph') {
          return (
            <Text key={block.id} variant="body" style={styles.paragraph}>
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
    color: colors.text,
  },
  paragraph: {
    color: colors.text,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
});
