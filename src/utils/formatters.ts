/**
 * Utility functions for currency, dates, receipts, and communication in Phoenix PocketBiz AI
 */

import { BusinessProfile, Customer, DebtRecord, Sale } from '../types';

/**
 * Format numbers as Nigerian Naira (₦)
 */
export function formatNaira(amount: number, includeDecimals = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₦0';
  }
  const formatted = Math.abs(amount).toLocaleString('en-NG', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  });

  return amount < 0 ? `-₦${formatted}` : `₦${formatted}`;
}

/**
 * Compact formatting for mobile KPI badges (e.g. ₦45k, ₦1.2m)
 */
export function formatCompactNaira(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₦0';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 1_000_000) {
    return `${sign}₦${(abs / 1_000_000).toFixed(1)}m`;
  }
  if (abs >= 1_000) {
    return `${sign}₦${(abs / 1_000).toFixed(1)}k`;
  }
  return `${sign}₦${abs.toLocaleString('en-NG')}`;
}

/**
 * Formats ISO date to Nigerian friendly date (e.g. 03 Nov 2026)
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formats ISO date to Nigerian friendly date and time (e.g. 03 Nov, 02:45 PM)
 */
export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Checks if a date string is today
 */
export function isToday(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

/**
 * Check if a date is within the last 7 days
 */
export function isWithinDays(dateStr: string, days: number): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  const diffTime = now.getTime() - d.getTime();
  const diffDays = diffTime / (1000 * 3600 * 24);
  return diffDays >= 0 && diffDays <= days;
}

/**
 * Generates WhatsApp/SMS shareable digital receipt text
 */
export function generateReceiptText(
  sale: Sale,
  business: BusinessProfile,
  customer?: Customer
): string {
  const lineDivider = '--------------------------------';
  const itemsText = sale.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.name}\n   ${item.quantity} x ${formatNaira(item.unitPrice)} = ${formatNaira(item.total)}`
    )
    .join('\n');

  let text = `*${business.name.toUpperCase()}*\n`;
  if (business.tagline) text += `${business.tagline}\n`;
  text += `${business.address}\n`;
  text += `Tel: ${business.phone}\n`;
  text += `${lineDivider}\n`;
  text += `*SALES RECEIPT: #${sale.saleNumber}*\n`;
  text += `Date: ${formatDateTime(sale.date)}\n`;
  if (sale.customerName || customer?.name) {
    text += `Customer: ${sale.customerName || customer?.name}\n`;
  }
  text += `Payment: ${sale.paymentMethod.toUpperCase()}\n`;
  text += `${lineDivider}\n`;
  text += `*ITEMS PURCHASED:*\n${itemsText}\n`;
  text += `${lineDivider}\n`;
  text += `*TOTAL AMOUNT: ${formatNaira(sale.totalAmount)}*\n`;
  text += `${lineDivider}\n`;

  if (business.bankDetails && business.bankDetails.accountNumber) {
    text += `*Bank Details for Transfer:*\n`;
    text += `Bank: ${business.bankDetails.bankName}\n`;
    text += `Acct No: ${business.bankDetails.accountNumber}\n`;
    text += `Acct Name: ${business.bankDetails.accountName}\n`;
    text += `${lineDivider}\n`;
  }

  text += `Thank you for your patronage! 🙏\n`;
  text += `Powered by Phoenix PocketBiz AI`;

  return text;
}

/**
 * Generates Debt Reminder messages for WhatsApp or SMS in Nigerian English or Pidgin
 */
export function generateDebtReminderMessage(
  debt: DebtRecord,
  business: BusinessProfile,
  dialect: 'english' | 'pidgin' = 'english'
): string {
  const dueInfo = debt.dueDate ? `due by ${formatDate(debt.dueDate)}` : `currently pending`;
  const remaining = formatNaira(debt.remainingBalance);

  if (dialect === 'pidgin') {
    let msg = `How far ${debt.customerName}! Hope say work/business dey go well? 🙏\n\n`;
    msg += `Na gentle reminder from *${business.name}* regarding the items you take on credit (${debt.itemsDescription}).\n\n`;
    msg += `Your balance remaining na *${remaining}* (${dueInfo}).\n\n`;
    if (business.bankDetails?.accountNumber) {
      msg += `You fit do transfer sharp-sharp go:\n`;
      msg += `Bank: ${business.bankDetails.bankName}\n`;
      msg += `Account: ${business.bankDetails.accountNumber} (${business.bankDetails.accountName})\n\n`;
    }
    msg += `Abeg let us know when you go balance am. God bless your hustle! ✨`;
    return msg;
  }

  // Standard Nigerian Business English
  let msg = `Good day ${debt.customerName},\n\n`;
  msg += `This is a friendly reminder from *${business.name}* regarding your outstanding balance of *${remaining}* for the goods purchased on credit (${debt.itemsDescription}).\n\n`;
  msg += `Status: ${dueInfo}.\n\n`;
  if (business.bankDetails?.accountNumber) {
    msg += `Kindly make payment to our business account:\n`;
    msg += `Bank: ${business.bankDetails.bankName}\n`;
    msg += `Account Number: ${business.bankDetails.accountNumber}\n`;
    msg += `Account Name: ${business.bankDetails.accountName}\n\n`;
  }
  msg += `Kindly reply with payment confirmation or let us know when we can expect your settlement.\n\n`;
  msg += `Thank you for your continued partnership,\n*${business.name}* (${business.phone})`;
  return msg;
}

/**
 * Prepares direct WhatsApp link
 */
export function getWhatsAppLink(phone: string, message: string): string {
  // Normalize Nigerian phone numbers: 080... -> 23480...
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '234' + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith('234')) {
    cleanPhone = '234' + cleanPhone;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
