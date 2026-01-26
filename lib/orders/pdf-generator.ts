/**
 * PDF invoice generator
 * Generates PDF invoices from order data
 */

import PDFDocument from 'pdfkit';
import type { OrderWithItems } from '@/lib/types/database';
import { format } from 'date-fns';

/**
 * Generate PDF invoice from order data
 * Returns PDF as a Buffer
 */
export async function generateInvoicePDF(order: OrderWithItems): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'LETTER' });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Header
      doc
        .fontSize(24)
        .text('INVOICE', { align: 'right' })
        .moveDown();

      // Company/Brand Info
      doc
        .fontSize(12)
        .text('Logbloga', { align: 'left' })
        .fontSize(10)
        .text('Digital Products & Resources', { align: 'left' })
        .moveDown(2);

      // Invoice Details
      const invoiceDate = order.created_at
        ? format(new Date(order.created_at), 'MMMM d, yyyy')
        : 'N/A';
      const invoiceNumber = order.order_number || 'N/A';

      doc
        .fontSize(10)
        .text(`Invoice Number: ${invoiceNumber}`, { align: 'right' })
        .text(`Invoice Date: ${invoiceDate}`, { align: 'right' })
        .moveDown(2);

      // Customer Information
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Bill To:', { continued: false })
        .font('Helvetica')
        .fontSize(10)
        .text(order.customer_name || 'Customer', { indent: 0 })
        .text(order.customer_email || '', { indent: 0 });

      if (order.billing_address) {
        const address = order.billing_address as {
          street?: string;
          city?: string;
          state?: string;
          zipCode?: string;
          country?: string;
        };

        if (address.street) {
          doc.text(address.street, { indent: 0 });
        }
        if (address.city) {
          const cityLine = [
            address.city,
            address.state,
            address.zipCode,
          ].filter(Boolean).join(', ');
          doc.text(cityLine, { indent: 0 });
        }
        if (address.country) {
          doc.text(address.country, { indent: 0 });
        }
      }

      doc.moveDown(2);

      // Order Items Table
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Items', { continued: false })
        .moveDown(0.5);

      // Table Header
      const tableTop = doc.y;
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Item', 50, tableTop)
        .text('Quantity', 300, tableTop)
        .text('Price', 380, tableTop, { align: 'right' })
        .text('Total', 450, tableTop, { align: 'right' });

      // Table Rows
      let y = tableTop + 20;
      doc.font('Helvetica');

      if (order.items && order.items.length > 0) {
        order.items.forEach((item) => {
          const unitPrice = typeof item.unit_price === 'number'
            ? item.unit_price
            : parseFloat(String(item.unit_price || 0));
          const totalPrice = typeof item.total_price === 'number'
            ? item.total_price
            : parseFloat(String(item.total_price || 0));

          doc
            .fontSize(10)
            .text(item.product_name || 'Product', 50, y, { width: 240 })
            .text(String(item.quantity), 300, y)
            .text(`$${unitPrice.toFixed(2)}`, 380, y, { align: 'right' })
            .text(`$${totalPrice.toFixed(2)}`, 450, y, { align: 'right' });

          y += 20;

          // Add new page if needed
          if (y > 700) {
            doc.addPage();
            y = 50;
          }
        });
      }

      // Totals Section
      const totalsY = Math.max(y + 20, 500);
      const subtotal = typeof order.subtotal === 'number'
        ? order.subtotal
        : parseFloat(String(order.subtotal || 0));
      const discountAmount = typeof order.discount_amount === 'number'
        ? order.discount_amount
        : parseFloat(String(order.discount_amount || 0));
      const taxAmount = typeof order.tax_amount === 'number'
        ? order.tax_amount
        : parseFloat(String(order.tax_amount || 0));
      const totalAmount = typeof order.total_amount === 'number'
        ? order.total_amount
        : parseFloat(String(order.total_amount || 0));

      doc
        .fontSize(10)
        .text('Subtotal:', 350, totalsY, { align: 'right' })
        .text(`$${subtotal.toFixed(2)}`, 450, totalsY, { align: 'right' });

      if (discountAmount > 0) {
        doc
          .text('Discount:', 350, totalsY + 15, { align: 'right' })
          .text(`-$${discountAmount.toFixed(2)}`, 450, totalsY + 15, { align: 'right' });
      }

      if (taxAmount > 0) {
        doc
          .text('Tax:', 350, totalsY + (discountAmount > 0 ? 30 : 15), { align: 'right' })
          .text(`$${taxAmount.toFixed(2)}`, 450, totalsY + (discountAmount > 0 ? 30 : 15), { align: 'right' });
      }

      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('Total:', 350, totalsY + (discountAmount > 0 ? 45 : taxAmount > 0 ? 30 : 15), { align: 'right' })
        .text(`$${totalAmount.toFixed(2)}`, 450, totalsY + (discountAmount > 0 ? 45 : taxAmount > 0 ? 30 : 15), { align: 'right' });

      // Payment Information
      if (order.stripe_payment_intent_id) {
        doc
          .moveDown(2)
          .font('Helvetica')
          .fontSize(10)
          .text('Payment Information:', { continued: false })
          .fontSize(9)
          .text(`Payment ID: ${order.stripe_payment_intent_id}`, { indent: 20 })
          .text(`Status: ${order.status}`, { indent: 20 });
      }

      // Footer
      doc
        .fontSize(8)
        .text(
          'Thank you for your purchase!',
          doc.page.width / 2,
          doc.page.height - 50,
          { align: 'center' }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

