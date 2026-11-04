import React, { useState } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  Plus,
  Receipt,
  Calendar,
  CreditCard,
  Banknote,
  Send,
  User,
  TrendingUp,
} from 'lucide-react';
import { Sale } from '../../types';
import { formatDateTime, formatNaira, isToday, isWithinDays } from '../../utils/formatters';

interface SalesViewProps {
  sales: Sale[];
  onOpenRecordSale: () => void;
  onViewReceipt: (sale: Sale) => void;
}

export const SalesView: React.FC<SalesViewProps> = ({
  sales,
  onOpenRecordSale,
  onViewReceipt,
}) => {
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'all'>('today');

  // Filter sales
  const filteredSales = sales.filter((sale) => {
    // Time filter
    if (timeFilter === 'today' && !isToday(sale.date)) return false;
    if (timeFilter === 'week' && !isWithinDays(sale.date, 7)) return false;

    // Method filter
    if (methodFilter !== 'all' && sale.paymentMethod !== methodFilter) return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchesNum = sale.saleNumber.toLowerCase().includes(q);
      const matchesCust = sale.customerName?.toLowerCase().includes(q) || false;
      const matchesItem = sale.items.some((it) => it.name.toLowerCase().includes(q));
      return matchesNum || matchesCust || matchesItem;
    }

    return true;
  });

  // Accurate totals for the filtered set
  const totalRevenue = filteredSales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalCost = filteredSales.reduce((acc, s) => acc + s.totalCost, 0);
  const totalProfit = totalRevenue - totalCost;
  const margin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-4 pb-20 max-w-5xl mx-auto">
      {/* Top Banner with Today's / Filtered Sales Metrics */}
      <div className="bg-[#0B192C] text-white p-5 rounded-3xl border border-[#1E3E62] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-[#F5D061] uppercase tracking-wider">
            {timeFilter === 'today'
              ? "Today's Sales Revenue"
              : timeFilter === 'week'
              ? 'Past 7 Days Revenue'
              : 'All Time Sales Revenue'}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tabular-nums mt-0.5">
            {formatNaira(totalRevenue)}
          </div>
          <div className="text-xs text-slate-300 mt-1">
            Total Profit:{' '}
            <span className="text-emerald-400 font-bold">{formatNaira(totalProfit)}</span>{' '}
            (Margin: <span className="text-[#F5D061] font-bold">{margin}%</span>) ·{' '}
            {filteredSales.length} transactions
          </div>
        </div>

        <button
          onClick={onOpenRecordSale}
          className="h-12 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#0B192C] font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-transform shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Record New Sale</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by receipt #, customer name, or item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Time range buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['today', 'week', 'all'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors capitalize ${
                  timeFilter === t
                    ? 'bg-white text-[#0B192C] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'today' ? 'Today' : t === 'week' ? '7 Days' : 'All'}
              </button>
            ))}
          </div>

          {/* Payment Method Selector */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            {[
              { id: 'all', label: 'All Payments' },
              { id: 'cash', label: 'Cash' },
              { id: 'transfer', label: 'Transfer' },
              { id: 'pos', label: 'POS' },
              { id: 'credit', label: 'Debt (Credit)' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMethodFilter(m.id)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border whitespace-nowrap transition-colors ${
                  methodFilter === m.id
                    ? 'bg-[#0B192C] text-[#F5D061] border-[#0B192C]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Transactions List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0B192C]">Sales History</h3>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredSales.length} records
          </span>
        </div>

        {filteredSales.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ShoppingCart className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-700">No sales match your filter</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Try changing the search or time frame</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredSales.map((sale) => (
              <div
                key={sale.id}
                className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-extrabold text-[#0B192C]">
                      #{sale.saleNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        sale.paymentMethod === 'cash'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : sale.paymentMethod === 'transfer'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : sale.paymentMethod === 'pos'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {sale.paymentMethod}
                    </span>
                    {sale.customerName && (
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <User className="w-3 h-3 text-[#D4AF37]" />
                        {sale.customerName}
                      </span>
                    )}
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-slate-600 mt-1.5 flex flex-wrap gap-1.5">
                    {sale.items.map((it, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-700"
                      >
                        {it.quantity}x {it.name} ({formatNaira(it.total)})
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-400 mt-1">
                    {formatDateTime(sale.date)}
                    {sale.notes && <span className="italic"> · "{sale.notes}"</span>}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <div>
                    <div className="text-sm sm:text-base font-black text-[#0B192C] tabular-nums text-right">
                      {formatNaira(sale.totalAmount)}
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-700 text-right">
                      +{formatNaira(sale.profit)} profit
                    </div>
                  </div>

                  <button
                    onClick={() => onViewReceipt(sale)}
                    className="mt-1 px-3 py-1 rounded-lg bg-slate-100 hover:bg-[#0B192C] hover:text-[#F5D061] text-[#0B192C] text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Receipt className="w-3 h-3" />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
