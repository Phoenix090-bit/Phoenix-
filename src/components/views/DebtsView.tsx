import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Search,
  MessageSquare,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Trash2,
  Phone,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DebtRecord } from '../../types';
import { formatDate, formatDateTime, formatNaira } from '../../utils/formatters';

interface DebtsViewProps {
  debts: DebtRecord[];
  onOpenAddDebt: () => void;
  onOpenRepayModal: (debt: DebtRecord) => void;
  onOpenReminderModal: (debt: DebtRecord) => void;
  onDeleteDebt: (id: string) => void;
}

export const DebtsView: React.FC<DebtsViewProps> = ({
  debts,
  onOpenAddDebt,
  onOpenRepayModal,
  onOpenReminderModal,
  onDeleteDebt,
}) => {
  const [tab, setTab] = useState<'pending' | 'cleared'>('pending');
  const [search, setSearch] = useState('');
  const [expandedDebtId, setExpandedDebtId] = useState<string | null>(null);

  const pendingDebts = debts.filter((d) => d.status !== 'cleared');
  const clearedDebts = debts.filter((d) => d.status === 'cleared');

  const totalOutstanding = pendingDebts.reduce((sum, d) => sum + d.remainingBalance, 0);
  const totalRecovered = debts.reduce((sum, d) => sum + d.amountPaid, 0);

  const listToDisplay = (tab === 'pending' ? pendingDebts : clearedDebts).filter((d) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      d.customerName.toLowerCase().includes(q) ||
      d.customerPhone.includes(q) ||
      d.itemsDescription.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 pb-20 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#0B192C] text-white p-5 rounded-3xl border border-[#1E3E62] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Total Outstanding Customer Debt</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tabular-nums mt-0.5">
            {formatNaira(totalOutstanding)}
          </div>
          <div className="text-xs text-slate-300 mt-1">
            {pendingDebts.length} active debtors · Recovered so far:{' '}
            <span className="text-emerald-400 font-bold">{formatNaira(totalRecovered)}</span>
          </div>
        </div>

        <button
          onClick={onOpenAddDebt}
          className="h-12 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#0B192C] font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-transform shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Record New Debt</span>
        </button>
      </div>

      {/* Search and Tabs */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search debtor by name, phone, or items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('pending')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'pending'
                ? 'bg-[#0B192C] text-[#F5D061] shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Active Debts ({pendingDebts.length})</span>
          </button>

          <button
            onClick={() => setTab('cleared')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'cleared'
                ? 'bg-[#0B192C] text-[#F5D061] shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cleared Debts ({clearedDebts.length})</span>
          </button>
        </div>
      </div>

      {/* Debts List */}
      <div className="space-y-3">
        {listToDisplay.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs text-slate-400">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-2" />
            <p className="text-sm font-bold text-slate-700">
              {tab === 'pending' ? 'No pending debts!' : 'No cleared debts on record'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {tab === 'pending'
                ? 'All customer accounts are settled and up to date.'
                : 'Debts paid in full will appear here.'}
            </p>
          </div>
        ) : (
          listToDisplay.map((debt) => {
            const isExpanded = expandedDebtId === debt.id;
            const percentPaid =
              debt.initialAmount > 0
                ? Math.min(100, Math.round((debt.amountPaid / debt.initialAmount) * 100))
                : 100;

            return (
              <div
                key={debt.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3 hover:border-slate-300 transition-all"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{debt.customerName}</h4>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          debt.status === 'cleared'
                            ? 'bg-emerald-100 text-emerald-800'
                            : debt.status === 'partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {debt.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <Phone className="w-3 h-3 text-[#D4AF37]" />
                      <span>{debt.customerPhone}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      Remaining Owed
                    </div>
                    <div
                      className={`text-base font-black tabular-nums ${
                        debt.remainingBalance > 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {formatNaira(debt.remainingBalance)}
                    </div>
                  </div>
                </div>

                {/* Items Description & Dates */}
                <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1">
                  <div className="text-slate-800">
                    <span className="font-semibold text-slate-500">Items: </span>
                    {debt.itemsDescription}
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                    <span>Taken on: {formatDate(debt.dateCreated)}</span>
                    {debt.dueDate && (
                      <span className="font-medium text-amber-800">
                        Promised: {formatDate(debt.dueDate)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Repayment Progress bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>
                      Paid: <b className="text-emerald-700">{formatNaira(debt.amountPaid)}</b> of{' '}
                      {formatNaira(debt.initialAmount)}
                    </span>
                    <span className="font-bold">{percentPaid}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        debt.status === 'cleared'
                          ? 'bg-emerald-500'
                          : debt.status === 'partial'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${percentPaid}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  {debt.status !== 'cleared' ? (
                    <div className="flex items-center gap-2 flex-1">
                      <button
                        onClick={() => onOpenRepayModal(debt)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Record Payment</span>
                      </button>

                      <button
                        onClick={() => onOpenReminderModal(debt)}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] text-[#F5D061] text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send Reminder</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Debt fully cleared!</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    {debt.repayments && debt.repayments.length > 0 && (
                      <button
                        onClick={() => setExpandedDebtId(isExpanded ? null : debt.id)}
                        className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 text-xs font-medium flex items-center gap-0.5"
                        title="Payment history"
                      >
                        <span>History ({debt.repayments.length})</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete debt record for ${debt.customerName}?`)) {
                          onDeleteDebt(debt.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete debt"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Repayments History Accordion */}
                {isExpanded && debt.repayments && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 mt-2">
                    <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Payment Log:
                    </div>
                    {debt.repayments.map((rep) => (
                      <div
                        key={rep.id}
                        className="flex justify-between items-center py-1 border-b border-slate-200 last:border-none"
                      >
                        <div>
                          <span className="font-bold text-emerald-700 tabular-nums">
                            +{formatNaira(rep.amount)}
                          </span>{' '}
                          via {rep.paymentMethod.toUpperCase()}
                          {rep.notes && <span className="text-slate-500 block text-[11px]">{rep.notes}</span>}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {formatDateTime(rep.date)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
