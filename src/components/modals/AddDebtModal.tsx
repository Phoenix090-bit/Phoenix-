import React, { useState } from 'react';
import { X, UserPlus, Calendar, Clock, Banknote, User } from 'lucide-react';
import { Customer, DebtRecord } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface AddDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  onSaveDebt: (debt: Omit<DebtRecord, 'id' | 'status' | 'amountPaid' | 'remainingBalance' | 'repayments'>) => void;
  onAddNewCustomer?: (name: string, phone: string) => Customer;
}

export const AddDebtModal: React.FC<AddDebtModalProps> = ({
  isOpen,
  onClose,
  customers,
  onSaveDebt,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [manualName, setManualName] = useState<string>('');
  const [manualPhone, setManualPhone] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [itemsDescription, setItemsDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const selectedCust = customers.find((c) => c.id === selectedCustomerId);
    const finalCustName = selectedCust ? selectedCust.name : manualName.trim();
    const finalCustPhone = selectedCust ? selectedCust.phone : manualPhone.trim() || 'N/A';

    if (!finalCustName) return;

    onSaveDebt({
      customerId: selectedCustomerId || `cust-temp-${Date.now()}`,
      customerName: finalCustName,
      customerPhone: finalCustPhone,
      initialAmount: numAmount,
      dateCreated: new Date().toISOString(),
      dueDate: dueDate || undefined,
      itemsDescription: itemsDescription || 'Goods taken on credit',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-[#0B192C] text-white px-5 py-4 flex items-center justify-between border-b border-[#1E3E62] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Clock className="w-4 h-4 font-bold" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Record Customer Debt</h2>
              <p className="text-xs text-slate-300">Track credit goods & repayment deadlines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto max-h-[80vh]">
          {/* Customer */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Select Customer:
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                if (e.target.value) {
                  setManualName('');
                  setManualPhone('');
                }
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="">-- Choose from Saved Customers --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>

            {!selectedCustomerId && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input
                  type="text"
                  required={!selectedCustomerId}
                  placeholder="Customer Name"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#D4AF37]"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Debt Amount (₦)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-lg font-bold text-slate-400">₦</span>
              <input
                type="number"
                step="any"
                required
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xl font-black text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Items Description */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Items Taken on Credit:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 1 Bag of Rice, 2 Cartons Indomie"
              value={itemsDescription}
              onChange={(e) => setItemsDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Due date */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Promised Repayment Date (Optional):
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm shadow-md active:scale-98 transition-transform"
          >
            Record Debt
          </button>
        </form>
      </div>
    </div>
  );
};
