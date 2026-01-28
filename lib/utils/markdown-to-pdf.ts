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
        lineHeight
      );
      
      yPosition = result.yPosition;
      
      // Check if we need a new page
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
  lineHeight: number
): Promise<RenderResult> {
  const paragraphSpacing = 6;

  switch (token.type) {
    case 'heading':
      return renderHeading(
        token,
        page,
        helveticaBoldFont,
        helveticaFont,
        margin,
        contentWidth,
        yPosition,
        lineHeight
      );
    case 'paragraph':
      return renderParagraph(
        token,
        page,
        helveticaFont,
        margin,
        contentWidth,
        yPosition,
        lineHeight,
        paragraphSpacing
      );
    case 'list':
      return renderList(
        token,
        page,
        helveticaFont,
        margin,
        contentWidth,
        yPosition,
        lineHeight
      );
    case 'code':
      return renderCode(
        token,
        page,
        courierFont,
        margin,
        contentWidth,
        yPosition,
        lineHeight
      );
    case 'blockquote':
      return renderBlockquote(
        token,
        page,
        helveticaObliqueFont,
        margin,
        contentWidth,
        yPosition,
        lineHeight
      );
    case 'table':
      return renderTable(
        token,
        page,
        helveticaBoldFont,
        helveticaFont,
        margin,
        contentWidth,
        yPosition,
        lineHeight
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
          helveticaFont,
          margin,
          contentWidth,
          yPosition,
          lineHeight,
          paragraphSpacing
        );
      }
      return { yPosition, page };
  }
}

function renderHeading(
  token: MarkdownToken,
  page: any,
  boldFont: any,
  normalFont: any,
  margin: number,
  contentWidth: number,
  yPosition: number,
  lineHeight: number
): RenderResult {
  const level = token.depth || 1;
  const sizes = [24, 20, 16, 14, 12, 11];
  const fontSize = sizes[Math.min(level - 1, sizes.length - 1)] || 11;
  const text = renderInlineTokens(token.tokens || []);

  const paragraphSpacing = 6;
  yPosition -= paragraphSpacing;

  const textHeight = (fontSize * text.split('\n').length);
  page.drawText(text, {
    x: margin,
    y: yPosition - fontSize,
    size: fontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
    maxWidth: contentWidth,
  });

  // Add border for h1
  if (level === 1) {
    page.drawLine({
      start: { x: margin, y: yPosition - fontSize - 5 },
      end: { x: margin + contentWidth, y: yPosition - fontSize - 5 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
  }

  yPosition -= textHeight + paragraphSpacing * 2;

  return { yPosition, page };
}

function renderParagraph(
  token: MarkdownToken,
  page: any,
  font: any,
  margin: number,
  contentWidth: number,
  yPosition: number,
  lineHeight: number,
  paragraphSpacing: number
): RenderResult {
  if (!token.tokens || token.tokens.length === 0) {
    yPosition -= paragraphSpacing;
    return { yPosition, page };
  }

  const text = renderInlineTokens(token.tokens || []);
  const fontSize = 10;
  const lines = wrapText(text, contentWidth, fontSize, font);
  const textHeight = lines.length * lineHeight;

  let currentY = yPosition;
  for (const line of lines) {
    page.drawText(line, {
      x: margin,
      y: currentY - fontSize,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeight;
  }

  yPosition -= textHeight + paragraphSpacing;

  return { yPosition, page };
}

function renderList(
  token: MarkdownToken,
  page: any,
  font: any,
  margin: number,
  contentWidth: number,
  yPosition: number,
  lineHeight: number
): RenderResult {
  const isOrdered = token.ordered || false;
  const start = token.start || 1;
  let itemNumber = start;
  const indent = 20;
  const bulletX = margin + indent;
  const textX = bulletX + 15;
  const fontSize = 10;

  for (const item of token.items || []) {
    const itemText = item.tokens ? renderInlineTokens(item.tokens) : '';
    const lines = wrapText(itemText, contentWidth - indent - 15, fontSize, font);
    const itemHeight = lines.length * lineHeight + 4;

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
      page.drawText('•', {
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
      page.drawText(line, {
        x: textX,
        y: currentY - fontSize,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      currentY -= lineHeight;
    }

    yPosition -= itemHeight + 4;
    if (isOrdered) itemNumber++;
  }

  yPosition -= 6;

  return { yPosition, page };
}

function renderCode(
  token: MarkdownToken,
  page: any,
  font: any,
  margin: number,
  contentWidth: number,
  yPosition: number,
  lineHeight: number
): RenderResult {
  const code = sanitizeText(token.text || '');
  const fontSize = 9;
  const padding = 10;
  const lines = code.split('\n');
  const textHeight = lines.length * lineHeight + padding * 2;

  // Draw background
  page.drawRectangle({
    x: margin,
    y: yPosition - textHeight,
    width: contentWidth,
    height: textHeight,
    color: rgb(0.96, 0.96, 0.96),
  });

  // Draw border
  page.drawRectangle({
    x: margin,
    y: yPosition - textHeight,
    width: contentWidth,
    height: textHeight,
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1,
  });

  // Render code
  let currentY = yPosition - padding;
  for (const line of lines) {
    page.drawText(line || ' ', {
      x: margin + padding,
      y: currentY - fontSize,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeight;
  }

  yPosition -= textHeight + 6;

  return { yPosition, page };
}

function renderBlockquote(
  token: MarkdownToken,
  page: any,
  font: any,
  margin: number,
  contentWidth: number,
  yPosition: number,
  lineHeight: number
): RenderResult {
  if (!token.tokens || token.tokens.length === 0) {
    return { yPosition, page };
  }

  const quoteText = renderInlineTokens(token.tokens || []);
  const fontSize = 10;
  const indent = 20;
  const lines = wrapText(quoteText, contentWidth - indent, fontSize, font);
  const textHeight = lines.length * lineHeight + 10;

  // Draw left border
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: margin, y: yPosition - textHeight },
    thickness: 4,
    color: rgb(0.29, 0.56, 0.89),
  });

  // Render content
  let currentY = yPosition;
  for (const line of lines) {
    page.drawText(line, {
      x: margin + indent,
      y: currentY - fontSize,
      size: fontSize,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });
    currentY -= lineHeight;
  }

  yPosition -= textHeight + 6;

  return { yPosition, page };
}

function renderTable(
  token: MarkdownToken,
  page: any,
  boldFont: any,
  normalFont: any,
  margin: number,
  contentWidth: number,
  yPosition: number,
  lineHeight: number
): RenderResult {
  const header = token.header || [];
  const rows = token.rows || [];

  if (header.length === 0) return { yPosition, page };

  const colCount = header.length;
  const colWidth = contentWidth / colCount;
  const fontSize = 10;
  const cellPadding = 5;
  const rowHeight = 20;

  // Render header
  let x = margin;
  let maxHeaderHeight = rowHeight;

  for (let i = 0; i < header.length; i++) {
    const cellTokens = Array.isArray(header[i]) ? header[i] : [];
    const cell = renderInlineTokens(cellTokens);
    const cellHeight = Math.ceil(cell.length / 30) * lineHeight + cellPadding * 2;

    // Draw cell background
    page.drawRectangle({
      x: x,
      y: yPosition - cellHeight,
      width: colWidth,
      height: cellHeight,
      color: rgb(0.94, 0.94, 0.94),
    });

    // Draw cell border
    page.drawRectangle({
      x: x,
      y: yPosition - cellHeight,
      width: colWidth,
      height: cellHeight,
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 0.5,
    });

    // Draw cell text
    page.drawText(cell, {
      x: x + cellPadding,
      y: yPosition - fontSize - cellPadding,
      size: fontSize,
      font: boldFont,
      color: rgb(0, 0, 0),
      maxWidth: colWidth - cellPadding * 2,
    });

    x += colWidth;
    maxHeaderHeight = Math.max(maxHeaderHeight, cellHeight);
  }

  yPosition -= maxHeaderHeight;

  // Render rows
  for (const row of rows) {
    x = margin;
    let currentRowHeight = rowHeight;

    for (let i = 0; i < row.length; i++) {
      const cellTokens = Array.isArray(row[i]) ? row[i] : [];
      const cell = renderInlineTokens(cellTokens);
      const cellHeight = Math.ceil(cell.length / 30) * lineHeight + cellPadding * 2;

      // Draw cell border
      page.drawRectangle({
        x: x,
        y: yPosition - cellHeight,
        width: colWidth,
        height: cellHeight,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 0.5,
      });

      // Draw cell text
      page.drawText(cell, {
        x: x + cellPadding,
        y: yPosition - fontSize - cellPadding,
        size: fontSize,
        font: normalFont,
        color: rgb(0, 0, 0),
        maxWidth: colWidth - cellPadding * 2,
      });

      x += colWidth;
      currentRowHeight = Math.max(currentRowHeight, cellHeight);
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
  font: any,
  margin: number,
  contentWidth: number,
  yPosition: number,
  lineHeight: number,
  paragraphSpacing: number
): RenderResult {
  const fontSize = 10;
  const lines = wrapText(text, contentWidth, fontSize, font);
  const textHeight = lines.length * lineHeight;

  let currentY = yPosition;
  for (const line of lines) {
    page.drawText(line, {
      x: margin,
      y: currentY - fontSize,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
    currentY -= lineHeight;
  }

  yPosition -= textHeight + paragraphSpacing;

  return { yPosition, page };
}

/**
 * Remove or replace emojis and unsupported Unicode characters
 */
function sanitizeText(text: string): string {
  if (!text) return '';
  
  // Replace common emojis with text equivalents
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
  };

  let sanitized = text;
  
  // Replace known emojis
  for (const [emoji, replacement] of Object.entries(emojiMap)) {
    sanitized = sanitized.replace(new RegExp(emoji, 'g'), replacement);
  }
  
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
 * Simple text wrapping (basic implementation)
 */
function wrapText(text: string, maxWidth: number, fontSize: number, font: any): string[] {
  // Simple word wrapping - split by spaces and combine words until line exceeds maxWidth
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    // Approximate width: each character is roughly fontSize * 0.6 points wide
    const estimatedWidth = testLine.length * fontSize * 0.6;

    if (estimatedWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [text];
}
