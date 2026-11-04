import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Package,
  Award,
  Printer,
  Download,
  PieChart,
} from 'lucide-react';
import { DailySummary, Expense, FinancialTotals, Product, Sale } from '../../types';
import { formatNaira, isToday, isWithinDays } from '../../utils/formatters';

interface ReportsViewProps {
  totals: FinancialTotals;
  dailySummaries: DailySummary[];
  sales: Sale[];
  expenses: Expense[];
  topProducts: Array<{
    id: string;
    name: string;
    quantitySold: number;
    totalRevenue: number;
    totalProfit: number;
  }>;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  totals,
  dailySummaries,
  sales,
  expenses,
  topProducts,
}) => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

  // Filtered dataset according to period
  const filteredSales = sales.filter((s) => {
    if (period === 'today') return isToday(s.date);
    if (period === 'week') return isWithinDays(s.date, 7);
    return isWithinDays(s.date, 30);
  });

  const filteredExpenses = expenses.filter((e) => {
    if (period === 'today') return isToday(e.date);
    if (period === 'week') return isWithinDays(e.date, 7);
    return isWithinDays(e.date, 30);
  });

  // Calculate strict deterministic financial math
  const periodRevenue = filteredSales.reduce((acc, s) => acc + s.totalAmount, 0);
  const periodCost = filteredSales.reduce((acc, s) => acc + s.totalCost, 0);
  const periodGrossProfit = periodRevenue - periodCost;
  const periodExpenses = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  const periodNetProfit = periodGrossProfit - periodExpenses;
  const periodMargin =
    periodRevenue > 0 ? ((periodNetProfit / periodRevenue) * 100).toFixed(1) : '0';

  // Expense categories breakdown
  const expenseCatMap: Record<string, number> = {};
  filteredExpenses.forEach((e) => {
    expenseCatMap[e.category] = (expenseCatMap[e.category] || 0) + e.amount;
  });
  const expenseBreakdown = Object.entries(expenseCatMap).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-4 pb-20 max-w-5xl mx-auto">
      {/* Header with period tabs */}
      <div className="bg-[#0B192C] text-white p-5 rounded-3xl border border-[#1E3E62] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-[#F5D061] uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Profit & Loss Financial Statement</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tabular-nums mt-0.5">
            {formatNaira(periodNetProfit)}
          </div>
          <div className="text-xs text-slate-300 mt-1">
            Net Profit for {period === 'today' ? 'Today' : period === 'week' ? 'Past 7 Days' : 'Past 30 Days'} (Margin: <span className="text-[#F5D061] font-bold">{periodMargin}%</span>)
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#1E3E62]/60 p-1 rounded-2xl border border-white/10 shrink-0">
          {(['today', 'week', 'month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                period === p
                  ? 'bg-[#D4AF37] text-[#0B192C] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {p === 'today' ? 'Today' : p === 'week' ? 'Past 7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* P&L Statement Grid Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-[#0B192C]">Profit & Loss Breakdown</h3>
          <span className="text-xs text-slate-400 font-mono">100% Deterministic Code Math</span>
        </div>

        <div className="space-y-2.5">
          {/* Revenue */}
          <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-slate-50 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="font-semibold text-slate-700">Total Sales Revenue (A)</span>
            </div>
            <span className="font-bold text-slate-900 tabular-nums">
              {formatNaira(periodRevenue)}
            </span>
          </div>

          {/* Cost of Goods Sold */}
          <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-slate-50 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span className="font-semibold text-slate-700">Cost of Goods Sold (B)</span>
            </div>
            <span className="font-bold text-slate-600 tabular-nums">
              -{formatNaira(periodCost)}
            </span>
          </div>

          {/* Gross Profit */}
          <div className="flex justify-between items-center py-2.5 px-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span className="font-bold text-emerald-950">Gross Trading Profit (A - B)</span>
            </div>
            <span className="font-extrabold text-emerald-800 tabular-nums">
              {formatNaira(periodGrossProfit)}
            </span>
          </div>

          {/* Operating Expenses */}
          <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-slate-50 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="font-semibold text-slate-700">Operating Expenses (Fuel, Rent, Transport) (C)</span>
            </div>
            <span className="font-bold text-rose-600 tabular-nums">
              -{formatNaira(periodExpenses)}
            </span>
          </div>

          {/* Net Profit Final */}
          <div className="flex justify-between items-center py-3 px-4 rounded-2xl bg-[#0B192C] text-white text-sm mt-3">
            <div>
              <div className="font-extrabold text-white">Net Business Profit (A - B - C)</div>
              <div className="text-[11px] text-[#F5D061]">Clean money in your pocket</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-[#F5D061] tabular-nums">
                {formatNaira(periodNetProfit)}
              </div>
              <div className="text-[10px] text-slate-300">
                Net Margin: {periodMargin}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Performance History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0B192C]">Daily Breakdown (Last 7 Days)</h3>
            <p className="text-xs text-slate-500">Day-by-day revenue, cost, and net gain</p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Day</th>
                <th className="py-2.5 px-3 text-right">Sales</th>
                <th className="py-2.5 px-3 text-right">Goods Cost</th>
                <th className="py-2.5 px-3 text-right">Expenses</th>
                <th className="py-2.5 px-3 text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dailySummaries.map((day) => {
                const isToday = day.dayName === 'Today';
                return (
                  <tr
                    key={day.date}
                    className={`hover:bg-slate-50/60 transition-colors ${
                      isToday ? 'bg-amber-50/40 font-semibold' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-900">{day.dayName}</span>
                      <span className="text-[10px] text-slate-400 block">{day.date}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold tabular-nums text-slate-800">
                      {formatNaira(day.totalSales)}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-500">
                      {formatNaira(day.totalCost)}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-rose-600">
                      {formatNaira(day.totalExpenses)}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-right font-extrabold tabular-nums ${
                        day.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {formatNaira(day.netProfit)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 5 Products & Expense Categories in 2 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Top Products */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Award className="w-4 h-4 text-[#D4AF37]" />
            <h4 className="text-xs font-bold text-[#0B192C]">Top Selling Products</h4>
          </div>

          {topProducts.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No sales recorded yet</p>
          ) : (
            <div className="space-y-2">
              {topProducts.map((p, idx) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-none"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-slate-900 truncate">
                      {idx + 1}. {p.name}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {p.quantitySold} units sold · Profit: +{formatNaira(p.totalProfit)}
                    </div>
                  </div>
                  <span className="font-extrabold text-[#0B192C] tabular-nums shrink-0">
                    {formatNaira(p.totalRevenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Operating Expenses Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <PieChart className="w-4 h-4 text-rose-500" />
            <h4 className="text-xs font-bold text-[#0B192C]">Expense Breakdown</h4>
          </div>

          {expenseBreakdown.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No expenses recorded for this period</p>
          ) : (
            <div className="space-y-2">
              {expenseBreakdown.map(([cat, amount]) => {
                const percent =
                  periodExpenses > 0 ? Math.round((amount / periodExpenses) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">{cat}</span>
                      <span className="font-bold text-rose-600 tabular-nums">
                        {formatNaira(amount)} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
