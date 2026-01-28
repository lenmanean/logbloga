/**
 * Markdown to PDF Converter
 * Converts markdown content to PDF with proper formatting and structure preservation
 */

import PDFDocument from 'pdfkit';
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
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 50,
        size: 'LETTER',
        info: {
          Title: 'Document',
          Author: 'Logbloga',
        },
      });

      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Parse markdown
      const tokens = marked.lexer(markdown);
      renderTokens(doc, tokens);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Render markdown tokens to PDF
 */
function renderTokens(doc: InstanceType<typeof PDFDocument>, tokens: MarkdownToken[]): void {
  for (const token of tokens) {
    switch (token.type) {
      case 'heading':
        renderHeading(doc, token);
        break;
      case 'paragraph':
        renderParagraph(doc, token);
        break;
      case 'list':
        renderList(doc, token);
        break;
      case 'code':
        renderCode(doc, token);
        break;
      case 'blockquote':
        renderBlockquote(doc, token);
        break;
      case 'table':
        renderTable(doc, token);
        break;
      case 'hr':
        renderHorizontalRule(doc);
        break;
      case 'html':
        // Skip HTML tokens or render as plain text
        if (token.text) {
          renderText(doc, token.text, 10);
        }
        break;
      case 'space':
        // Skip spaces
        break;
      default:
        // For unknown tokens, try to render text if available
        if (token.text) {
          renderText(doc, token.text, 10);
          doc.moveDown();
        }
    }
  }
}

/**
 * Render heading (h1-h6)
 */
function renderHeading(doc: InstanceType<typeof PDFDocument>, token: MarkdownToken): void {
  const level = token.depth || 1;
  const sizes = [24, 20, 16, 14, 12, 11];
  const size = sizes[Math.min(level - 1, sizes.length - 1)] || 11;

  // Add spacing before heading (except first)
  if (doc.y > 50) {
    doc.moveDown(0.5);
  }

  doc
    .fontSize(size)
    .font('Helvetica-Bold')
    .text(renderInlineTokens(token.tokens || []), {
      align: 'left',
    })
    .font('Helvetica')
    .moveDown(0.5);

  // Add border for h1
  if (level === 1) {
    const currentY = doc.y;
    doc
      .moveUp(0.3)
      .strokeColor('#cccccc')
      .lineWidth(1)
      .moveTo(50, currentY - 5)
      .lineTo(doc.page.width - 50, currentY - 5)
      .stroke()
      .moveTo(50, currentY);
  }
}

/**
 * Render paragraph
 */
function renderParagraph(doc: InstanceType<typeof PDFDocument>, token: MarkdownToken): void {
  if (!token.tokens || token.tokens.length === 0) {
    doc.moveDown(0.5);
    return;
  }

  doc
    .fontSize(10)
    .font('Helvetica')
    .text(renderInlineTokens(token.tokens), {
      align: 'left',
      lineGap: 2,
    })
    .moveDown();
}

/**
 * Render list (ordered or unordered)
 */
function renderList(doc: InstanceType<typeof PDFDocument>, token: MarkdownToken): void {
  const isOrdered = token.ordered || false;
  const start = token.start || 1;
  let itemNumber = start;

  for (const item of token.items || []) {
    const indent = 20;
    const bulletX = 50 + indent;
    const textX = bulletX + 15;

    // Get current Y position
    const currentY = doc.y;

    // Check if we need a new page
    if (currentY > doc.page.height - 100) {
      doc.addPage();
    }

    // Draw bullet or number
    doc.fontSize(10).font('Helvetica');
    if (isOrdered) {
      doc.text(`${itemNumber}.`, bulletX, currentY);
    } else {
      doc.text('•', bulletX, currentY);
    }

    // Render list item content
    if (item.tokens && item.tokens.length > 0) {
      const itemText = renderInlineTokens(item.tokens);
      doc.text(itemText, textX, currentY, {
        width: doc.page.width - textX - 50,
        lineGap: 2,
      });
    }

    // Move down for next item
    doc.moveDown(0.8);

    if (isOrdered) {
      itemNumber++;
    }
  }

  doc.moveDown(0.5);
}

/**
 * Render code block
 */
function renderCode(doc: InstanceType<typeof PDFDocument>, token: MarkdownToken): void {
  const code = token.text || '';
  const language = token.lang || '';

  // Add spacing
  doc.moveDown(0.5);

  const startY = doc.y;
  const margin = 50;
  const width = doc.page.width - margin * 2;
  const padding = 10;

  // Calculate text height
  doc.fontSize(9).font('Courier');
  const lines = code.split('\n');
  const lineHeight = 12;
  const totalHeight = lines.length * lineHeight + padding * 2;

  // Check if we need a new page
  if (startY + totalHeight > doc.page.height - 50) {
    doc.addPage();
  }

  // Draw background
  doc
    .rect(margin, doc.y, width, totalHeight)
    .fillColor('#f5f5f5')
    .fill()
    .fillColor('black');

  // Draw border
  doc
    .strokeColor('#cccccc')
    .lineWidth(1)
    .rect(margin, doc.y, width, totalHeight)
    .stroke();

  // Render code
  let y = doc.y + padding;
  for (const line of lines) {
    doc.text(line || ' ', margin + padding, y, {
      width: width - padding * 2,
    });
    y += lineHeight;
  }

  doc.y = startY + totalHeight;
  doc.moveDown(0.5);
}

/**
 * Render blockquote
 */
function renderBlockquote(doc: InstanceType<typeof PDFDocument>, token: MarkdownToken): void {
  doc.moveDown(0.5);

  const startY = doc.y;
  const margin = 50;
  const indent = 20;

  // Draw left border
  doc
    .strokeColor('#4a90e2')
    .lineWidth(4)
    .moveTo(margin, startY)
    .lineTo(margin, startY + 30)
    .stroke()
    .strokeColor('black');

  // Render content
  if (token.tokens && token.tokens.length > 0) {
    const quoteText = renderInlineTokens(token.tokens);
    doc
      .fontSize(10)
      .font('Helvetica-Oblique')
      .fillColor('#666666')
      .text(quoteText, margin + indent, startY, {
        width: doc.page.width - margin - indent - 50,
        lineGap: 2,
      })
      .font('Helvetica')
      .fillColor('black');
  }

  doc.moveDown(0.5);
}

/**
 * Render table
 */
function renderTable(doc: InstanceType<typeof PDFDocument>, token: MarkdownToken): void {
  doc.moveDown(0.5);

  const margin = 50;
  const tableWidth = doc.page.width - margin * 2;
  const header = token.header || [];
  const rows = token.rows || [];

  if (header.length === 0) return;

  // Calculate column widths
  const colCount = header.length;
  const colWidth = tableWidth / colCount;

  let startY = doc.y;

  // Check if we need a new page
  if (startY > doc.page.height - 150) {
    doc.addPage();
    startY = doc.y;
  }

  // Render header
  doc.fontSize(10).font('Helvetica-Bold');
  let x = margin;
  let maxRowHeight = 15;

  for (let i = 0; i < header.length; i++) {
    const cell = renderInlineTokens(header[i] || []);
    const cellHeight = Math.ceil(cell.length / 30) * 12 + 10;

    // Draw cell background
    doc
      .rect(x, startY, colWidth, cellHeight)
      .fillColor('#f0f0f0')
      .fill()
      .fillColor('black');

    // Draw cell border
    doc
      .strokeColor('#cccccc')
      .lineWidth(0.5)
      .rect(x, startY, colWidth, cellHeight)
      .stroke();

    // Draw cell text
    doc.text(cell, x + 5, startY + 5, {
      width: colWidth - 10,
      align: 'left',
    });

    x += colWidth;
    maxRowHeight = Math.max(maxRowHeight, cellHeight);
  }

  startY += maxRowHeight;

  // Render rows
  doc.font('Helvetica');
  for (const row of rows) {
    // Check if we need a new page
    if (startY > doc.page.height - 100) {
      doc.addPage();
      startY = doc.y;
    }

    x = margin;
    let rowHeight = 15;

    for (let i = 0; i < row.length; i++) {
      const cell = renderInlineTokens(row[i] || []);
      const cellHeight = Math.ceil(cell.length / 30) * 12 + 10;

      // Draw cell border
      doc
        .strokeColor('#cccccc')
        .lineWidth(0.5)
        .rect(x, startY, colWidth, cellHeight)
        .stroke();

      // Draw cell text
      doc.text(cell, x + 5, startY + 5, {
        width: colWidth - 10,
        align: 'left',
      });

      x += colWidth;
      rowHeight = Math.max(rowHeight, cellHeight);
    }

    startY += rowHeight;
  }

  doc.y = startY;
  doc.moveDown(0.5);
}

/**
 * Render horizontal rule
 */
function renderHorizontalRule(doc: InstanceType<typeof PDFDocument>): void {
  doc.moveDown(0.5);
  const y = doc.y;
  doc
    .strokeColor('#cccccc')
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(doc.page.width - 50, y)
    .stroke();
  doc.moveDown(0.5);
}

/**
 * Render inline tokens (text, emphasis, strong, links, code)
 */
function renderInlineTokens(tokens: MarkdownToken[]): string {
  if (!tokens || tokens.length === 0) return '';

  return tokens
    .map((token) => {
      switch (token.type) {
        case 'text':
          return token.text || '';
        case 'strong':
          return renderInlineTokens(token.tokens || []);
        case 'em':
          return renderInlineTokens(token.tokens || []);
        case 'code':
          return token.text || '';
        case 'link':
          const linkText = renderInlineTokens(token.tokens || []);
          return `${linkText} (${token.href || ''})`;
        case 'image':
          return `[Image: ${token.text || token.alt || ''}]`;
        case 'br':
          return '\n';
        default:
          if (token.tokens) {
            return renderInlineTokens(token.tokens);
          }
          return token.text || '';
      }
    })
    .join('');
}

/**
 * Render plain text with word wrapping
 */
function renderText(doc: InstanceType<typeof PDFDocument>, text: string, fontSize: number): void {
  doc.fontSize(fontSize).font('Helvetica').text(text, {
    align: 'left',
    lineGap: 2,
  });
}
