import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { colors, radius, spacing, text as textTokens } from '@/components/ui/tokens';
import { createNoteBlockId } from '@/lib/noteBlocks';
import { NoteBlock } from '@/types/notes';

type NoteBlocksEditorProps = {
  blocks: NoteBlock[];
  onChange: (blocks: NoteBlock[]) => void;
};

export function NoteBlocksEditor({ blocks, onChange }: NoteBlocksEditorProps) {
  const handleChangeText = (id: string, text: string) => {
    onChange(
      blocks.map((block) => (block.id === id && block.type !== 'divider' ? { ...block, text } : block)),
    );
  };

  const handleDelete = (id: string) => {
    onChange(blocks.filter((block) => block.id !== id));
  };

  const addBlock = (type: NoteBlock['type']) => {
    const id = createNoteBlockId();
    if (type === 'divider') {
      onChange([...blocks, { id, type }]);
      return;
    }

    onChange([...blocks, { id, type, text: '' }]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        <Button title="Add heading" size="sm" variant="secondary" onPress={() => addBlock('heading')} />
        <Button title="Add paragraph" size="sm" variant="secondary" onPress={() => addBlock('paragraph')} />
        <Button title="Add divider" size="sm" variant="secondary" onPress={() => addBlock('divider')} />
      </View>

      {!blocks.length ? (
        <Text style={styles.placeholder}>Add headings, paragraphs, or dividers to structure this memory.</Text>
      ) : null}

      <View style={styles.blocksStack}>
        {blocks.map((block) => {
          if (block.type === 'divider') {
            return (
              <View key={block.id} style={styles.blockRow}>
                <View style={styles.divider} />
                <Button
                  title="Delete"
                  size="sm"
                  variant="destructive"
                  onPress={() => handleDelete(block.id)}
                  style={styles.deleteButton}
                />
              </View>
            );
          }

          return (
            <View key={block.id} style={styles.blockRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.blockLabel}>{block.type === 'heading' ? 'Heading' : 'Paragraph'}</Text>
                <TextInput
                  style={[styles.input, block.type === 'heading' ? styles.headingInput : styles.paragraphInput]}
                  placeholder={block.type === 'heading' ? 'Add a heading' : 'Add a paragraph'}
                  value={block.text}
                  onChangeText={(text) => handleChangeText(block.id, text)}
                  multiline={block.type === 'paragraph'}
                />
              </View>
              <Button
                title="Delete"
                size="sm"
                variant="destructive"
                onPress={() => handleDelete(block.id)}
                style={styles.deleteButton}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  placeholder: {
    ...textTokens.caption,
    color: colors.mutedText,
  },
  blocksStack: {
    gap: spacing.sm,
  },
  blockRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  deleteButton: {
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  blockLabel: {
    ...textTokens.caption,
    color: colors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    width: '100%',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...textTokens.body,
    color: colors.text,
  },
  headingInput: {
    ...textTokens.title,
    color: colors.text,
  },
  paragraphInput: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
});
