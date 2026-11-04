import React, { useState } from 'react';
import { X, Share2, Copy, Check, Printer, Send } from 'lucide-react';
import { BusinessProfile, Customer, Sale } from '../../types';
import { formatDateTime, formatNaira, generateReceiptText, getWhatsAppLink } from '../../utils/formatters';

interface ReceiptModalProps {
  sale: Sale | null;
  business: BusinessProfile;
  customer?: Customer;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  sale,
  business,
  customer,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !sale) return null;

  const receiptText = generateReceiptText(sale, business, customer);
  const whatsappUrl = customer?.phone
    ? getWhatsAppLink(customer.phone, receiptText)
    : `https://wa.me/?text=${encodeURIComponent(receiptText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(receiptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#0B192C] text-white px-5 py-4 flex items-center justify-between border-b border-[#1E3E62] shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">Sales Receipt #{sale.saleNumber}</h2>
            <p className="text-xs text-slate-300">{formatDateTime(sale.date)}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper Body */}
        <div className="p-4 overflow-y-auto max-h-[70vh] bg-slate-50">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 print:shadow-none print:border-none">
            {/* Header / Store details */}
            <div className="text-center border-b border-dashed border-slate-300 pb-3">
              <h3 className="font-extrabold text-base text-[#0B192C] uppercase tracking-wide">
                {business.name}
              </h3>
              {business.tagline && (
                <p className="text-[11px] text-slate-500 italic">{business.tagline}</p>
              )}
              <p className="text-xs text-slate-600 mt-1">{business.address}</p>
              <p className="text-xs text-slate-600 font-medium">Tel: {business.phone}</p>
            </div>

            {/* Meta info */}
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Receipt No:</span>
                <span className="font-bold text-slate-900">#{sale.saleNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{formatDateTime(sale.date)}</span>
              </div>
              {(sale.customerName || customer?.name) && (
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-semibold text-slate-900">
                    {sale.customerName || customer?.name}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Payment:</span>
                <span className="font-bold text-emerald-700 uppercase">
                  {sale.paymentMethod}
                </span>
              </div>
            </div>

            {/* Items table */}
            <div className="border-t border-b border-dashed border-slate-300 py-3 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                <span>Item</span>
                <span>Total</span>
              </div>
              {sale.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs text-slate-800">
                  <div className="min-w-0 pr-2">
                    <div className="font-medium truncate">{item.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {item.quantity} x {formatNaira(item.unitPrice)}
                    </div>
                  </div>
                  <span className="font-bold tabular-nums shrink-0">
                    {formatNaira(item.total)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Amount */}
            <div className="flex justify-between items-center text-sm pt-1">
              <span className="font-bold text-slate-900">Total Paid:</span>
              <span className="text-xl font-black text-[#0B192C] tabular-nums">
                {formatNaira(sale.totalAmount)}
              </span>
            </div>

            {/* Bank details for verification */}
            {business.bankDetails && business.bankDetails.accountNumber && (
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-0.5">
                <div className="font-bold text-slate-700">Bank Transfer Account:</div>
                <div>{business.bankDetails.bankName} - {business.bankDetails.accountNumber}</div>
                <div className="text-slate-500">{business.bankDetails.accountName}</div>
              </div>
            )}

            <div className="text-center text-[11px] text-slate-500 italic pt-1">
              Thank you for your patronage! 🙏
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-4 bg-white border-t border-slate-200 grid grid-cols-3 gap-2 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="h-11 bg-[#0B192C] hover:bg-[#1E3E62] text-[#F5D061] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="h-11 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};
