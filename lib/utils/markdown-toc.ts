/**
 * Table of contents utilities for markdown: slugify and parse headings.
 * Used by Expanded View sidebar and MarkdownViewer for heading ids.
 */

import { marked } from 'marked';

export interface TocEntry {
  id: string;
  depth: number;
  text: string;
}

/**
 * Slugify heading text for use as id: lowercase, replace non-alphanumeric with '-', collapse/trim dashes.
 */
export function slugify(text: string): string {
  if (!text || typeof text !== 'string') return 'section';
  const s = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
  return s || 'section';
}

/**
 * Parse markdown and return heading entries with stable unique ids.
 * Uses same slugify logic so ids match rendered heading ids when viewer uses this for id generation.
 */
export function parseHeadings(markdown: string): TocEntry[] {
  if (!markdown || typeof markdown !== 'string') return [];

  const tokens = marked.lexer(markdown);
  const entries: TocEntry[] = [];
  const usedIds = new Set<string>();

  for (const token of tokens) {
    if (token.type !== 'heading') continue;

    const depth = typeof token.depth === 'number' ? token.depth : 1;
    const text = typeof token.text === 'string' ? token.text.trim() : '';

    if (!text) continue;

    let baseId = slugify(text);
    let id = baseId;
    let n = 1;
    while (usedIds.has(id)) {
      n += 1;
      id = `${baseId}-${n}`;
    }
    usedIds.add(id);

    entries.push({ id, depth, text });
  }

  return entries;
}

export interface TocNode {
  entry: TocEntry;
  children: TocNode[];
}

/**
 * Build a tree from flat heading entries by depth.
 * Root array holds top-level nodes (shallowest depth present).
 * Deeper headings become children of the previous shallower heading.
 */
export function buildTocTree(entries: TocEntry[]): TocNode[] {
  if (entries.length === 0) return [];

  const roots: TocNode[] = [];
  const stack: TocNode[] = []; // stack of nodes for each depth level

  for (const entry of entries) {
    const node: TocNode = { entry, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].entry.depth >= entry.depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  }

  return roots;
}
