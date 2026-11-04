import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Clock,
  ShoppingCart,
  Edit,
  ExternalLink,
  ChevronRight,
  Receipt,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { CustomerWithMetrics } from '../../utils/analytics';
import { DebtRecord, Sale } from '../../types';
import { formatDateTime, formatNaira, getWhatsAppLink } from '../../utils/formatters';

interface CustomerDetailModalProps {
  customer: CustomerWithMetrics | null;
  isOpen: boolean;
  onClose: () => void;
  onEditCustomer: (customer: CustomerWithMetrics) => void;
  onOpenRepayModal: (debt: DebtRecord) => void;
  onOpenReminderModal: (debt: DebtRecord) => void;
  onViewReceipt: (sale: Sale) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  isOpen,
  onClose,
  onEditCustomer,
  onOpenRepayModal,
  onOpenReminderModal,
  onViewReceipt,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'debts' | 'sales'>('debts');

  if (!isOpen || !customer) return null;

  const whatsappUrl = getWhatsAppLink(
    customer.phone,
    `Hello ${customer.name}, reaching out from Phoenix PocketBiz regarding your business with us.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-xl max-h-[92vh] sm:max-h-[88vh] rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header with Navy & Gold Customer Card */}
        <div className="bg-[#0B192C] text-white p-5 border-b border-[#1E3E62] shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-3.5 pr-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#9A6B0A] flex items-center justify-center text-[#0B192C] font-extrabold text-lg shadow-md shrink-0">
              {customer.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white truncate">{customer.name}</h2>
                <span className="bg-[#D4AF37]/20 text-[#F5D061] text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-[#D4AF37]/30">
                  {customer.category}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{customer.phone}</p>
            </div>
          </div>

          {/* Quick Contact Bar */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-700/60">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${customer.phone}`}
              className="py-2 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
            <button
              onClick={() => {
                onClose();
                onEditCustomer(customer);
              }}
              className="py-2 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Info</span>
            </button>
          </div>
        </div>

        {/* Customer Financial Summary Cards */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 border-b border-slate-200 shrink-0 text-center">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <div className="text-[10px] uppercase font-bold text-slate-400">Lifetime Spend</div>
            <div className="text-xs sm:text-sm font-black text-[#0B192C] tabular-nums mt-0.5">
              {formatNaira(customer.totalSpend)}
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <div className="text-[10px] uppercase font-bold text-slate-400">Outstanding Debt</div>
            <div
              className={`text-xs sm:text-sm font-black tabular-nums mt-0.5 ${
                customer.activeDebt > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {customer.activeDebt > 0 ? formatNaira(customer.activeDebt) : '₦0 (Clean)'}
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Orders</div>
            <div className="text-xs sm:text-sm font-black text-[#0B192C] tabular-nums mt-0.5">
              {customer.ordersCount} sales
            </div>
          </div>
        </div>

        {/* Details & Notes */}
        {(customer.address || customer.notes || customer.email) && (
          <div className="px-4 py-2.5 bg-amber-50/50 border-b border-amber-200/50 text-xs text-slate-700 space-y-1 shrink-0">
            {customer.address && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                <span className="truncate">{customer.address}</span>
              </div>
            )}
            {customer.notes && (
              <div className="text-slate-600 italic">
                Note: {customer.notes}
              </div>
            )}
          </div>
        )}

        {/* Sub-Tabs: Linked Debts vs Transaction History */}
        <div className="flex border-b border-slate-200 bg-white shrink-0">
          <button
            onClick={() => setActiveSubTab('debts')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'debts'
                ? 'border-[#0B192C] text-[#0B192C]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Linked Debts ({customer.debtsHistory.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('sales')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'sales'
                ? 'border-[#0B192C] text-[#0B192C]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Sales History ({customer.salesHistory.length})</span>
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeSubTab === 'debts' ? (
            customer.debtsHistory.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                <p className="text-xs font-semibold text-slate-700">No debt records for this customer</p>
                <p className="text-[11px] text-slate-400">Customer has an outstanding clean account</p>
              </div>
            ) : (
              customer.debtsHistory.map((debt) => (
                <div
                  key={debt.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{debt.itemsDescription}</div>
                      <div className="text-[11px] text-slate-400">
                        Date: {formatDateTime(debt.dateCreated)}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        debt.status === 'cleared'
                          ? 'bg-emerald-100 text-emerald-800'
                          : debt.status === 'partial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {debt.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-slate-500">Paid: </span>
                      <span className="font-semibold text-emerald-700">
                        {formatNaira(debt.amountPaid)}
                      </span>
                      <span className="text-slate-400"> / {formatNaira(debt.initialAmount)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Balance Owed</span>
                      <span className="font-extrabold text-rose-600 tabular-nums">
                        {formatNaira(debt.remainingBalance)}
                      </span>
                    </div>
                  </div>

                  {debt.status !== 'cleared' && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => {
                          onClose();
                          onOpenRepayModal(debt);
                        }}
                        className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold text-center"
                      >
                        Record Repayment
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          onOpenReminderModal(debt);
                        }}
                        className="py-1.5 px-2 bg-[#0B192C] hover:bg-[#1E3E62] text-[#F5D061] rounded-lg text-xs font-semibold text-center"
                      >
                        Send Reminder
                      </button>
                    </div>
                  )}
                </div>
              ))
            )
          ) : customer.salesHistory.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <ShoppingCart className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-700">No purchases recorded yet</p>
              <p className="text-[11px] text-slate-400">Select this customer when recording a sale</p>
            </div>
          ) : (
            customer.salesHistory.map((sale) => (
              <div
                key={sale.id}
                className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">#{sale.saleNumber}</span>
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {sale.paymentMethod}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {sale.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {formatDateTime(sale.date)}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-extrabold text-[#0B192C] tabular-nums">
                    {formatNaira(sale.totalAmount)}
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onViewReceipt(sale);
                    }}
                    className="mt-1 text-[11px] font-bold text-[#D4AF37] hover:underline flex items-center gap-0.5 ml-auto"
                  >
                    <span>Receipt</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
