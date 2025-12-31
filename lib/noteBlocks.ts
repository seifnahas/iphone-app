import { generateId } from '@/lib/id';
import { NoteBlock } from '@/types/notes';

export function createNoteBlockId(): string {
  return generateId();
}

export function sanitizeNoteBlocks(blocks: NoteBlock[]): NoteBlock[] {
  return blocks
    .map((block) => {
      if (block.type === 'divider') return block;
      return { ...block, text: block.text.trimEnd() };
    })
    .filter((block) => block.type === 'divider' || block.text.trim().length > 0);
}

export function parseNoteBlocks(value?: string | null): NoteBlock[] | undefined {
  if (!value) return undefined;

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return undefined;

    const noteBlocks: NoteBlock[] = parsed
      .map((item) => {
        if (!item || typeof item !== 'object' || !('type' in item) || !('id' in item)) return null;

        if (item.type === 'divider') {
          return { id: String((item as NoteBlock).id), type: 'divider' } as NoteBlock;
        }

        if (item.type === 'heading' || item.type === 'paragraph') {
          const text = 'text' in item ? String((item as { text?: unknown }).text ?? '') : '';
          return { id: String((item as NoteBlock).id), type: item.type, text };
        }

        return null;
      })
      .filter(Boolean) as NoteBlock[];

    return noteBlocks.length ? noteBlocks : undefined;
  } catch {
    return undefined;
  }
}

export function serializeNoteBlocks(blocks?: NoteBlock[]): string | null {
  if (!blocks || !blocks.length) return null;
  return JSON.stringify(blocks);
}

export function normalizeNoteBlocks(
  input: { id?: string; noteBlocks?: NoteBlock[] | null; body?: string | null | undefined } | null,
): NoteBlock[] {
  if (!input) return [];

  if (input.noteBlocks && input.noteBlocks.length > 0) {
    return input.noteBlocks;
  }

  const legacyBody = input.body?.trim();
  if (legacyBody) {
    const legacyId = input.id ? `${input.id}-legacy-note` : createNoteBlockId();
    return [{ id: legacyId, type: 'paragraph', text: legacyBody }];
  }

  return [];
}
