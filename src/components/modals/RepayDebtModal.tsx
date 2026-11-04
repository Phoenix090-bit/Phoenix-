import React, { useState } from 'react';
import { X, CheckCircle2, Banknote, Send, CreditCard, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DebtRecord, DebtRepayment } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface RepayDebtModalProps {
  debt: DebtRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onRecordRepayment: (debtId: string, repayment: Omit<DebtRepayment, 'id'>) => void;
}

export const RepayDebtModal: React.FC<RepayDebtModalProps> = ({
  debt,
  isOpen,
  onClose,
  onRecordRepayment,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'pos'>('cash');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen || !debt) return null;

  const handlePayFull = () => {
    setAmount(debt.remainingBalance.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    onRecordRepayment(debt.id, {
      amount: numAmount,
      date: new Date().toISOString(),
      paymentMethod,
      notes: notes || undefined,
    });

    if (numAmount >= debt.remainingBalance) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#D4AF37', '#0B192C'],
        });
      } catch {
        // ignore
      }
    }

    onClose();
  };

  const enteredAmount = parseFloat(amount) || 0;
  const newRemaining = Math.max(0, debt.remainingBalance - enteredAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-[#0B192C] text-white px-5 py-4 flex items-center justify-between border-b border-[#1E3E62] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4 font-bold" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Record Debt Repayment</h2>
              <p className="text-xs text-slate-300">Customer: {debt.customerName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Debt Summary Card */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-600">
              <span>Items:</span>
              <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]">
                {debt.itemsDescription}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600">
              <span>Original Total:</span>
              <span className="font-semibold">{formatNaira(debt.initialAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600">
              <span>Already Paid:</span>
              <span className="font-semibold text-emerald-700">{formatNaira(debt.amountPaid)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800">Remaining Balance:</span>
              <span className="text-base font-extrabold text-rose-600 tabular-nums">
                {formatNaira(debt.remainingBalance)}
              </span>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Amount Being Paid (₦)
              </label>
              <button
                type="button"
                onClick={handlePayFull}
                className="text-xs font-bold text-[#0B192C] hover:text-[#D4AF37] underline"
              >
                Pay Full ({formatNaira(debt.remainingBalance)})
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-lg font-bold text-slate-400">₦</span>
              <input
                type="number"
                step="any"
                required
                max={debt.remainingBalance}
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xl font-black text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {enteredAmount > 0 && (
              <div className="text-xs text-slate-500 mt-1.5 flex justify-between">
                <span>New balance after payment:</span>
                <span className={`font-bold ${newRemaining === 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {newRemaining === 0 ? 'Debt Cleared! 🎉' : formatNaira(newRemaining)}
                </span>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cash', label: 'Cash', icon: Banknote },
                { id: 'transfer', label: 'Transfer', icon: Send },
                { id: 'pos', label: 'POS Card', icon: CreditCard },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-[#0B192C] bg-[#0B192C] text-[#F5D061]'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Paid in morning cash, OPay transfer"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md active:scale-98 transition-transform"
          >
            Confirm Repayment
          </button>
        </form>
      </div>
    </div>
  );
};
