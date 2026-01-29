/**
 * Markdown to PDF Converter
 * Converts markdown content to PDF with proper formatting and structure preservation
 * Uses pdf-lib for serverless compatibility
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { marked } from 'marked';

interface MarkdownToken {
  type: string;
  [key: string]: any;
}

/**
 * Convert markdown content to PDF Buffer
 * Preserves structure: headings, paragraphs, lists, code blocks, blockquotes, tables, links
 */
export async function markdownToPDF(markdown: string): Promise<Buffer> {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Embed standard fonts (these work in serverless)
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helveticaObliqueFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    const courierFont = await pdfDoc.embedFont(StandardFonts.Courier);

    // Page setup
    const pageWidth = 612; // Letter size width in points
    const pageHeight = 792; // Letter size height in points
    const margin = 50;
    const contentWidth = pageWidth - margin * 2;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let yPosition = pageHeight - margin;
    const lineHeight = 12;
    const paragraphSpacing = 6;

    // Parse markdown
    const tokens = marked.lexer(markdown);
    
    // Render tokens
    for (const token of tokens) {
      const result = await renderToken(
        token,
        page,
        pdfDoc,
        helveticaFont,
        helveticaBoldFont,
        helveticaObliqueFont,
        courierFont,
        margin,
        contentWidth,
        yPosition,
        lineHeight,
        pageWidth,
        pageHeight
      );
      
      yPosition = result.yPosition;
      page = result.page;
      
      // Check if we need a new page before next token
      if (yPosition < margin + 50) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPosition = pageHeight - margin;
      }
    }

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

interface RenderResult {
  yPosition: number;
  page: any;
}

async function renderToken(
  token: MarkdownToken,
  page: any,
  pdfDoc: any,
  helveticaFont: any,
  helveticaBoldFont: any,
  helveticaObliqueFont: any,
  courierFont: any,
  margin: number,
  contentWidth: number,
  yPosition: number,
  lineHeight: number,
  pageWidth: number,
  pageHeight: number
): Promise<RenderResult> {
  const paragraphSpacing = 6;

  switch (token.type) {
    case 'heading':
      return renderHeading(
        token,
        page,
        pdfDoc,
        helveticaBoldFont,
        helveticaFont,
        margin,
        contentWidth,
        yPosition,
        lineHeight,
        pageWidth,
        pageHeight
      );
    case 'paragraph':
      return renderParagraph(
        token,
        page,
        pdfDoc,
        helveticaFont,
        margin,
        contentWidth,
        yPosition,
        lineHeight,
        paragraphSpacing,
        pageWidth,
        pageHeight
      );
    case 'list':
      return renderList(
        token,
        page,
        pdfDoc,
        helveticaFont,
        margin,
        contentWidth,
        yPosition,
        lineHeight,
        pageWidth,
        pageHeight
      );
    case 'code':
      return renderCode(
        token,
        page,
        pdfDoc,
        courierFont,
        margin,
        contentWidth,
        yPosition,
        lineHeight,
        pageWidth,
        pageHeight
      );
    case 'blockquote':
      return renderBlockquote(
        token,
        page,
        pdfDoc,
        helveticaObliqueFont,
        margin,
        contentWidth,
        yPosition,
        lineHeight,
        pageWidth,
        pageHeight
      );
    case 'table':
      return renderTable(
        token,
        page,
        pdfDoc,
        helveticaBoldFont,
        helveticaFont,
        margin,
        contentWidth,
        yPosition,
        lineHeight,
        pageWidth,
        pageHeight
      );
    case 'hr':
      return renderHorizontalRule(
        page,
        margin,
        contentWidth,
        yPosition,
        lineHeight
      );
    default:
      // For unknown tokens, try to render text if available
      if (token.text) {
        return renderText(
          sanitizeText(token.text),
          page,
          pdfDoc,
          helveticaFont,
          margin,
          contentWidth,
          yPosition,
          lineHeight,
          paragraphSpacing,
          pageWidth,
          pageHeight
        );
      }
      return { yPosition, page };
  }
}

function renderHeading(
  token: MarkdownToken,
  page: any,
  pdfDoc: any,
  boldFont: any,
  normalFont: any,
  margin: number,
  contentWidth: number,
  yPosition: number,
  lineHeight: number,
  pageWidth: number,
  pageHeight: number
): RenderResult {
  const level = token.depth || 1;
  const sizes = [24, 20, 16, 14, 12, 11];
  const fontSize = sizes[Math.min(level - 1, sizes.length - 1)] || 11;
  const headingLineHeight = fontSize + 2;
  const text = renderInlineTokens(token.tokens || []);
  const lines = wrapText(text, contentWidth, fontSize, boldFont);
  const textHeight = lines.length * headingLineHeight;

  const paragraphSpacing = 6;
  yPosition -= paragraphSpacing;

  let currentY = yPosition;
  for (const line of lines) {
    if (currentY - headingLineHeight < margin) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      currentY = pageHeight - margin;
    }
    page.drawText(line, {
      x: margin,
      y: currentY - fontSize,
      size: fontSize,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    currentY -= headingLineHeight;
  }

  // Add border for h1 (under last heading line)
  if (level === 1) {
    page.drawLine({
      start: { x: margin, y: currentY - 5 },
      end: { x: margin + contentWidth, y: currentY - 5 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
  }

  yPosition = currentY - paragraphSpacing * 2;

  return { yPosition, page };
}

function renderParagraph(
  token: MarkdownToken,
  page: any,
  pdfDoc: any,
  font: any,
  margin: number,
  contentWidth: number,
  yPosition: number,
  lineHeight: number,
  paragraphSpacing: number,
  pageWidth: number,
  pageHeight: number
): RenderResult {
  if (!token.tokens || token.tokens.length === 0) {
    yPosition -= paragraphSpacing;
    return { yPosition, page };
  }

  const text = renderInlineTokens(token.tokens || []);
  const fontSize = 10;
  const lines = wrapText(text, contentWidth, fontSize, font);

  let currentY = yPosition;
  for (const line of lines) {
    if (currentY - lineHeight < margin) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      currentY = pageHeight - margin;
    }
    page.drawText(line, {
      x: margin,
      y: currentY - fontSize,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeight;
  }

  yPosition = currentY - paragraphSpacing;

  return { yPosition, page };
}

function renderList(
  token: MarkdownToken,
  page: any,
  pdfDoc: any,
  font: any,
  margin: number,
  contentWidth: number,
  yPosition: number,
  lineHeight: number,
  pageWidth: number,
  pageHeight: number
): RenderResult {
  const isOrdered = token.ordered || false;
  const start = token.start || 1;
  let itemNumber = start;
  const indent = 20;
  const bulletX = margin + indent;
  const textX = bulletX + 15;
  const fontSize = 10;
  const bulletChar = '*'; // WinAnsi-safe (avoid U+2022)

  for (const item of token.items || []) {
    const itemText = item.tokens ? renderInlineTokens(item.tokens) : '';
    const lines = wrapText(itemText, contentWidth - indent - 15, fontSize, font);
    const itemHeight = lines.length * lineHeight + 4;

    // Check page break before bullet/number
    if (yPosition - fontSize - itemHeight < margin) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      yPosition = pageHeight - margin;
    }

    // Draw bullet or number
    if (isOrdered) {
      page.drawText(`${itemNumber}.`, {
        x: bulletX,
        y: yPosition - fontSize,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
    } else {
      page.drawText(bulletChar, {
        x: bulletX,
        y: yPosition - fontSize,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
    }

    // Render list item content
    let currentY = yPosition;
    for (const line of lines) {
      if (currentY - lineHeight < margin) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        currentY = pageHeight - margin;
      }
      page.drawText(line, {
        x: textX,
        y: currentY - fontSize,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      currentY -= lineHeight;
    }

    yPosition = currentY - 4;
    if (isOrdered) itemNumber++;
  }

  yPosition -= 6;

  return { yPosition, page };
}

function renderCode(
  token: MarkdownToken,
  page: any,
  pdfDoc: any,
  font: any,
  margin: number,
  contentWidth: number,
  yPosition: number,
  lineHeight: number,
  pageWidth: number,
  pageHeight: number
): RenderResult {
  const code = sanitizeText(token.text || '');
  const fontSize = 9;
  const padding = 10;
  const lines = code.split('\n');
  const textHeight = lines.length * lineHeight + padding * 2;

  // Draw background and border for first-page portion only
  const firstPageHeight = Math.min(textHeight, yPosition - margin);
  if (firstPageHeight > 0) {
    page.drawRectangle({
      x: margin,
      y: yPosition - firstPageHeight,
      width: contentWidth,
      height: firstPageHeight,
      color: rgb(0.96, 0.96, 0.96),
    });
    page.drawRectangle({
      x: margin,
      y: yPosition - firstPageHeight,
      width: contentWidth,
      height: firstPageHeight,
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 1,
    });
  }

  let currentY = yPosition - padding;
  for (const line of lines) {
    if (currentY - lineHeight < margin) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      currentY = pageHeight - margin - padding;
    }
    page.drawText(line || ' ', {
      x: margin + padding,
      y: currentY - fontSize,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeight;
  }

  yPosition = currentY - 6;

  return { yPosition, page };
}

function renderBlockquote(
  token: MarkdownToken,
  page: any,
  pdfDoc: any,
  font: any,
  margin: number,
  contentWidth: number,
  yPosition: number,
  lineHeight: number,
  pageWidth: number,
  pageHeight: number
): RenderResult {
  if (!token.tokens || token.tokens.length === 0) {
    return { yPosition, page };
  }

  const quoteText = renderInlineTokens(token.tokens || []);
  const fontSize = 10;
  const indent = 20;
  const lines = wrapText(quoteText, contentWidth - indent, fontSize, font);
  const textHeight = lines.length * lineHeight + 10;

  // Draw left border (first page only; continuation on new page has no bar)
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: margin, y: Math.max(margin, yPosition - textHeight) },
    thickness: 4,
    color: rgb(0.29, 0.56, 0.89),
  });

  let currentY = yPosition;
  for (const line of lines) {
    if (currentY - lineHeight < margin) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      currentY = pageHeight - margin;
    }
    page.drawText(line, {
      x: margin + indent,
      y: currentY - fontSize,
      size: fontSize,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });
    currentY -= lineHeight;
  }

  yPosition = currentY - 6;

  return { yPosition, page };
}

function renderTable(
  token: MarkdownToken,
  page: any,
  pdfDoc: any,
  boldFont: any,
  normalFont: any,
  margin: number,
  contentWidth: number,
  yPosition: number,
  lineHeight: number,
  pageWidth: number,
  pageHeight: number
): RenderResult {
  const header = token.header || [];
  const rows = token.rows || [];

  if (header.length === 0) return { yPosition, page };

  const colCount = header.length;
  const colWidth = contentWidth / colCount;
  const fontSize = 10;
  const cellPadding = 5;
  const cellWidth = colWidth - cellPadding * 2;

  // Render header: wrap each cell, draw line-by-line
  let x = margin;
  let maxHeaderHeight = 0;
  const headerCellHeights: number[] = [];

  for (let i = 0; i < header.length; i++) {
    const cellTokens = Array.isArray(header[i]) ? header[i] : [];
    const cellText = renderInlineTokens(cellTokens);
    const lines = wrapText(cellText, cellWidth, fontSize, boldFont);
    const cellHeight = lines.length * lineHeight + cellPadding * 2;
    headerCellHeights.push(cellHeight);
    maxHeaderHeight = Math.max(maxHeaderHeight, cellHeight);
  }

  if (yPosition - maxHeaderHeight < margin) {
    page = pdfDoc.addPage([pageWidth, pageHeight]);
    yPosition = pageHeight - margin;
  }

  x = margin;
  for (let i = 0; i < header.length; i++) {
    const cellTokens = Array.isArray(header[i]) ? header[i] : [];
    const cellText = renderInlineTokens(cellTokens);
    const lines = wrapText(cellText, cellWidth, fontSize, boldFont);
    const cellHeight = headerCellHeights[i];

    page.drawRectangle({
      x: x,
      y: yPosition - cellHeight,
      width: colWidth,
      height: cellHeight,
      color: rgb(0.94, 0.94, 0.94),
    });
    page.drawRectangle({
      x: x,
      y: yPosition - cellHeight,
      width: colWidth,
      height: cellHeight,
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 0.5,
    });

    let cellY = yPosition - cellPadding;
    for (const line of lines) {
      page.drawText(line, {
        x: x + cellPadding,
        y: cellY - fontSize,
        size: fontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      cellY -= lineHeight;
    }
    x += colWidth;
  }

  yPosition -= maxHeaderHeight;

  // Render body rows
  for (const row of rows) {
    const rowCellHeights: number[] = [];
    for (let i = 0; i < row.length; i++) {
      const cellTokens = Array.isArray(row[i]) ? row[i] : [];
      const cellText = renderInlineTokens(cellTokens);
      const lines = wrapText(cellText, cellWidth, fontSize, normalFont);
      rowCellHeights.push(lines.length * lineHeight + cellPadding * 2);
    }
    const currentRowHeight = Math.max(...rowCellHeights, 20);

    if (yPosition - currentRowHeight < margin) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      yPosition = pageHeight - margin;
    }

    x = margin;
    for (let i = 0; i < row.length; i++) {
      const cellTokens = Array.isArray(row[i]) ? row[i] : [];
      const cellText = renderInlineTokens(cellTokens);
      const lines = wrapText(cellText, cellWidth, fontSize, normalFont);
      const cellHeight = rowCellHeights[i];

      page.drawRectangle({
        x: x,
        y: yPosition - cellHeight,
        width: colWidth,
        height: cellHeight,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 0.5,
      });

      let cellY = yPosition - cellPadding;
      for (const line of lines) {
        page.drawText(line, {
          x: x + cellPadding,
          y: cellY - fontSize,
          size: fontSize,
          font: normalFont,
          color: rgb(0, 0, 0),
        });
        cellY -= lineHeight;
      }
      x += colWidth;
    }

    yPosition -= currentRowHeight;
  }

  yPosition -= 6;

  return { yPosition, page };
}

function renderHorizontalRule(
  page: any,
  margin: number,
  contentWidth: number,
  yPosition: number,
  lineHeight: number
): RenderResult {
  yPosition -= 6;
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: margin + contentWidth, y: yPosition },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  yPosition -= 6;

  return { yPosition, page };
}

function renderText(
  text: string,
  page: any,
  pdfDoc: any,
  font: any,
  margin: number,
  contentWidth: number,
  yPosition: number,
  lineHeight: number,
  paragraphSpacing: number,
  pageWidth: number,
  pageHeight: number
): RenderResult {
  const fontSize = 10;
  const lines = wrapText(text, contentWidth, fontSize, font);

  let currentY = yPosition;
  for (const line of lines) {
    if (currentY - lineHeight < margin) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      currentY = pageHeight - margin;
    }
    page.drawText(line, {
      x: margin,
      y: currentY - fontSize,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeight;
  }

  yPosition = currentY - paragraphSpacing;

  return { yPosition, page };
}

/**
 * Remove or replace emojis and unsupported Unicode characters
 */
function sanitizeText(text: string): string {
  if (!text) return '';
  
  // Replace common emojis and special characters with text equivalents
  const emojiMap: Record<string, string> = {
    '✅': '[✓]',
    '❌': '[X]',
    '⚠️': '[!]',
    'ℹ️': '[i]',
    '📝': '[Note]',
    '🔗': '[Link]',
    '💡': '[Tip]',
    '🚀': '[Launch]',
    '⚡': '[Fast]',
    '🎯': '[Target]',
    '📊': '[Chart]',
    '🔒': '[Lock]',
    '🔓': '[Unlock]',
    '⭐': '[Star]',
    '💻': '[Code]',
    '📱': '[Mobile]',
    '🌐': '[Web]',
    '💰': '[Money]',
    '📈': '[Up]',
    '📉': '[Down]',
    '→': '->',  // Arrow
    '←': '<-',  // Left arrow
    '↑': '^',   // Up arrow
    '↓': 'v',   // Down arrow
    '⇒': '=>',  // Double arrow
    '⇐': '<=',  // Double left arrow
    '•': '*',   // Bullet point (handled separately in lists, but good to have)
    '–': '-',   // En dash
    '—': '-',   // Em dash
    '…': '...',  // Ellipsis
    '\u201C': '"',   // Left double quote
    '\u201D': '"',   // Right double quote
    '\u2018': "'",   // Left single quote
    '\u2019': "'",   // Right single quote
    // Box-drawing (WinAnsi cannot encode; use Unicode escapes for keys)
    '\u2500': '-',   // Horizontal
    '\u2502': '|',   // Vertical
    '\u250C': '+',   // Down + right
    '\u2510': '+',   // Down + left
    '\u2514': '+',   // Up + right
    '\u2518': '+',   // Up + left
    '\u251C': '|',   // Vertical + right (tree branch)
    '\u2524': '|',   // Vertical + left
    '\u252C': '+',   // Down + horizontal
    '\u2534': '+',   // Up + horizontal
    '\u253C': '+',   // Vertical + horizontal
  };

  let sanitized = text;
  
  // Replace known emojis and special characters
  for (const [emoji, replacement] of Object.entries(emojiMap)) {
    sanitized = sanitized.replace(new RegExp(emoji, 'g'), replacement);
  }
  
  // Strip any remaining box-drawing / block elements (U+2500..U+257F)
  sanitized = sanitized.replace(/[\u2500-\u257F]/g, ' ');
  
  // Remove any remaining emojis and non-printable characters
  // Keep only printable ASCII and common Unicode characters
  sanitized = sanitized.replace(/[\u{1F300}-\u{1F9FF}]/gu, ''); // Emoji range
  sanitized = sanitized.replace(/[\u{2600}-\u{26FF}]/gu, ''); // Miscellaneous Symbols
  sanitized = sanitized.replace(/[\u{2700}-\u{27BF}]/gu, ''); // Dingbats
  
  return sanitized;
}

/**
 * Render inline tokens (text, emphasis, strong, links, code)
 */
function renderInlineTokens(tokens: MarkdownToken[] | undefined | null): string {
  if (!tokens || !Array.isArray(tokens) || tokens.length === 0) return '';

  return tokens
    .map((token) => {
      switch (token.type) {
        case 'text':
          return sanitizeText(token.text || '');
        case 'strong':
          return renderInlineTokens(token.tokens || []);
        case 'em':
          return renderInlineTokens(token.tokens || []);
        case 'code':
          return sanitizeText(token.text || '');
        case 'link':
          const linkText = renderInlineTokens(token.tokens || []);
          return `${linkText} (${token.href || ''})`;
        case 'image':
          return `[Image: ${sanitizeText(token.text || token.alt || '')}]`;
        case 'br':
          return '\n';
        default:
          if (token.tokens && Array.isArray(token.tokens)) {
            return renderInlineTokens(token.tokens);
          }
          return sanitizeText(token.text || '');
      }
    })
    .join('');
}

/**
 * Wrap text to maxWidth. Respects existing newlines; uses font metrics when available.
 */
function wrapText(text: string, maxWidth: number, fontSize: number, font: any): string[] {
  const allLines: string[] = [];
  const segments = text.split('\n');

  function measureWidth(str: string): number {
    if (font && typeof font.widthOfTextAtSize === 'function') {
      try {
        return font.widthOfTextAtSize(str, fontSize);
      } catch {
        return str.length * fontSize * 0.6;
      }
    }
    return str.length * fontSize * 0.6;
  }

  function wrapSegment(segment: string): string[] {
    const words = segment.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = measureWidth(testLine);

      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  }

  for (const segment of segments) {
    const segmentLines = wrapSegment(segment.trim() || ' ');
    allLines.push(...segmentLines);
  }

  return allLines.length > 0 ? allLines : [text];
}
