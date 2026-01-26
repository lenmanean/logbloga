import type { LucideIcon } from 'lucide-react';
import {
  FileText,
  Download,
  FileSpreadsheet,
  File,
} from 'lucide-react';

/**
 * Whether the file type is hosted (rendered in-browser) vs downloadable.
 * Only markdown is hosted; all other types are downloadable.
 */
export function isHostedContent(fileType: string): boolean {
  const t = (fileType || '').toLowerCase();
  return t === 'md' || t === 'markdown';
}

/**
 * Icon component for a file type.
 */
export function getFileTypeIcon(fileType: string): LucideIcon {
  const t = (fileType || '').toLowerCase();
  if (t === 'pdf') return FileText;
  if (t === 'zip' || t === 'rar' || t === '7z') return Download;
  if (t === 'xlsx' || t === 'xls' || t === 'csv') return FileSpreadsheet;
  if (t === 'docx' || t === 'doc') return FileText;
  if (t === 'md' || t === 'markdown') return FileText;
  return File;
}

/**
 * Format a filename for display (strip extension, replace separators, title-case).
 */
export function formatFileName(filename: string): string {
  if (!filename || typeof filename !== 'string') return '';
  const withoutExt = filename.replace(/\.[^/.]+$/, '');
  const withSpaces = withoutExt.replace(/[-_]/g, ' ');
  return withSpaces
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

const MIME_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  zip: 'application/zip',
  rar: 'application/x-rar-compressed',
  '7z': 'application/x-7z-compressed',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  csv: 'text/csv',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  doc: 'application/msword',
  md: 'text/markdown',
  markdown: 'text/markdown',
  txt: 'text/plain',
  json: 'application/json',
};

/**
 * MIME type for a filename.
 */
export function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return MIME_TYPES[ext] ?? 'application/octet-stream';
}
