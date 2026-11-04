import React, { useState } from 'react';
import {
  TrendingDown,
  Plus,
  Search,
  Filter,
  Fuel,
  Home,
  Truck,
  Users,
  Zap,
  Wrench,
  Shield,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { Expense, ExpenseCategory } from '../../types';
import { formatDateTime, formatNaira, isToday, isWithinDays } from '../../utils/formatters';

interface ExpensesViewProps {
  expenses: Expense[];
  onOpenAddExpense: () => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  onOpenAddExpense,
  onDeleteExpense,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'all'>('today');
  const [search, setSearch] = useState('');

  // Categories
  const categories: ExpenseCategory[] = [
    'Generator & Fuel',
    'Transport & Delivery',
    'PHCN / Light Bill',
    'Shop Rent & Levies',
    'Staff Wages',
    'Market Security & Cleaning',
    'Packaging & Nylon',
    'Repairs & Shop Maintenance',
    'Inventory Stock',
    'Other',
  ];

  // Filtering
  const filtered = expenses.filter((e) => {
    if (timeFilter === 'today' && !isToday(e.date)) return false;
    if (timeFilter === 'week' && !isWithinDays(e.date, 7)) return false;
    if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return e.description.toLowerCase().includes(q) || e.category.toLowerCase().includes(q);
    }
    return true;
  });

  const totalExpense = filtered.reduce((sum, e) => sum + e.amount, 0);

  // Group by category for quick insights
  const categoryTotals: Record<string, number> = {};
  filtered.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  return (
    <div className="space-y-4 pb-20 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#0B192C] text-white p-5 rounded-3xl border border-[#1E3E62] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>
              {timeFilter === 'today'
                ? "Today's Business Expenses"
                : timeFilter === 'week'
                ? 'Past 7 Days Expenses'
                : 'All Recorded Expenses'}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-300 tabular-nums mt-0.5">
            {formatNaira(totalExpense)}
          </div>
          <div className="text-xs text-slate-300 mt-1">
            {filtered.length} expense items recorded
          </div>
        </div>

        <button
          onClick={onOpenAddExpense}
          className="h-12 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 active:scale-95 transition-transform shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by description (e.g. petrol, keke, generator)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Time range */}
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

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-1 text-xs text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Expense Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Breakdown Chips */}
      {Object.keys(categoryTotals).length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {Object.entries(categoryTotals).map(([cat, amt]) => (
            <div
              key={cat}
              className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs shrink-0 flex items-center gap-2"
            >
              <span className="text-xs font-medium text-slate-700">{cat}:</span>
              <span className="text-xs font-bold text-rose-600 tabular-nums">
                {formatNaira(amt)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Expense list */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0B192C]">Expense Log</h3>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filtered.length} entries
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <TrendingDown className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-700">No expenses recorded for this period</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Click "Record Expense" to add one</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((exp) => (
              <div
                key={exp.id}
                className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{exp.category}</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {exp.paymentMethod}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">{exp.description}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {formatDateTime(exp.date)}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm sm:text-base font-extrabold text-rose-600 tabular-nums">
                    -{formatNaira(exp.amount)}
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this expense?')) {
                        onDeleteExpense(exp.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 className="w-4 h-4" />
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
