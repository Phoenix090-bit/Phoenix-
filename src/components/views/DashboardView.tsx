import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Clock,
  Package,
  Users,
  Plus,
  Sparkles,
  ArrowRight,
  ChevronRight,
  AlertTriangle,
  Receipt,
  DollarSign,
} from 'lucide-react';
import {
  AIInsight,
  BusinessProfile,
  DailySummary,
  DebtRecord,
  FinancialTotals,
  Product,
  Sale,
} from '../../types';
import { formatCompactNaira, formatDateTime, formatNaira } from '../../utils/formatters';

interface DashboardViewProps {
  business: BusinessProfile;
  totals: FinancialTotals;
  dailySummaries: DailySummary[];
  insights: AIInsight[];
  recentSales: Sale[];
  lowStockProducts: Product[];
  activeDebts: DebtRecord[];
  onOpenRecordSale: () => void;
  onOpenAddExpense: () => void;
  onOpenAddDebt: () => void;
  onOpenAddProduct: () => void;
  onNavigateTab: (tab: any) => void;
  onViewReceipt: (sale: Sale) => void;
  onOpenAdvisor: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  business,
  totals,
  dailySummaries,
  insights,
  recentSales,
  lowStockProducts,
  activeDebts,
  onOpenRecordSale,
  onOpenAddExpense,
  onOpenAddDebt,
  onOpenAddProduct,
  onNavigateTab,
  onViewReceipt,
  onOpenAdvisor,
}) => {
  const profitMarginPercent =
    totals.todaySales > 0 ? ((totals.todayNetProfit / totals.todaySales) * 100).toFixed(1) : '0';

  // Find max sales for chart scale
  const maxSale = Math.max(...dailySummaries.map((d) => d.totalSales), 1000);

  return (
    <div className="space-y-4 pb-20 max-w-5xl mx-auto">
      {/* Hero Financial Card in Professional Navy & Gold */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B192C] via-[#0F243E] to-[#1E3E62] text-white p-5 sm:p-6 shadow-xl border border-[#1E3E62]">
        {/* Subtle geometric gold ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <div className="text-[11px] font-semibold text-[#F5D061] tracking-wider uppercase flex items-center gap-1.5">
              <span>Today's Profit & Cash Flow</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tight mt-0.5">
              {formatNaira(totals.todayNetProfit)}
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              Clean Net Profit (Margin: <span className="text-[#F5D061] font-bold">{profitMarginPercent}%</span>)
            </div>
          </div>

          <button
            onClick={onOpenAdvisor}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#0B192C] font-bold text-xs shadow-md active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Advice</span>
          </button>
        </div>

        {/* 3 Metric Pills inside the card */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-2.5 backdrop-blur-xs border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-300 flex items-center gap-1">
              <ShoppingCart className="w-3 h-3 text-[#F5D061]" />
              <span>Sales ({totals.todaySalesCount})</span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-white tabular-nums mt-1">
              {formatNaira(totals.todaySales)}
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-2.5 backdrop-blur-xs border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-300 flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-rose-400" />
              <span>Expenses</span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-rose-300 tabular-nums mt-1">
              {formatNaira(totals.todayExpenses)}
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-2.5 backdrop-blur-xs border border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-300 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>Gross Gain</span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-emerald-300 tabular-nums mt-1">
              {formatNaira(totals.todayGrossProfit)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Grid (Large 48px hitboxes for Android phone thumbs) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={onOpenRecordSale}
          className="h-14 bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#0B192C] rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/15 active:scale-98 transition-transform"
        >
          <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
          <span>+ Record Sale</span>
        </button>

        <button
          onClick={onOpenAddExpense}
          className="h-14 bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-transform"
        >
          <TrendingDown className="w-4 h-4 text-rose-600" />
          <span>+ Add Expense</span>
        </button>

        <button
          onClick={onOpenAddDebt}
          className="h-14 bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-transform"
        >
          <Clock className="w-4 h-4 text-amber-600" />
          <span>+ Record Debt</span>
        </button>

        <button
          onClick={onOpenAddProduct}
          className="h-14 bg-[#0B192C] text-[#F5D061] hover:bg-[#1E3E62] rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-transform"
        >
          <Package className="w-4 h-4 text-[#D4AF37]" />
          <span>+ Stock Item</span>
        </button>
      </div>

      {/* Smart Business Insights Box */}
      {insights.length > 0 && (
        <div className="space-y-2">
          {insights.slice(0, 2).map((ins) => (
            <div
              key={ins.id}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 shadow-xs ${
                ins.type === 'inventory'
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : ins.type === 'debt'
                  ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  ins.type === 'inventory'
                    ? 'bg-amber-500 text-white'
                    : ins.type === 'debt'
                    ? 'bg-rose-500 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold">{ins.title}</div>
                <div className="text-[11px] text-slate-700 mt-0.5 leading-relaxed">
                  {ins.message}
                </div>
              </div>
              {ins.actionTab && (
                <button
                  onClick={() => onNavigateTab(ins.actionTab)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/90 hover:bg-white text-[#0B192C] text-[11px] font-bold shadow-xs whitespace-nowrap shrink-0 flex items-center gap-1 self-center"
                >
                  <span>{ins.actionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 7-Day Performance & Trends */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#0B192C]">7-Day Sales & Profit Overview</h3>
            <p className="text-xs text-slate-500">Weekly sales: {formatNaira(totals.weekSales)} · Profit: {formatNaira(totals.weekNetProfit)}</p>
          </div>
          <button
            onClick={() => onNavigateTab('reports')}
            className="text-xs font-bold text-[#0B192C] hover:text-[#D4AF37] flex items-center gap-0.5"
          >
            <span>Full Report</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Bar Graph */}
        <div className="flex items-end justify-between gap-2 h-36 pt-4 pb-1 px-1">
          {dailySummaries.map((day) => {
            const heightPercent = Math.max(10, Math.round((day.totalSales / maxSale) * 100));
            const isToday = day.dayName === 'Today';

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-bold text-slate-600 tabular-nums">
                  {formatCompactNaira(day.totalSales)}
                </span>
                <div className="w-full max-w-[28px] bg-slate-100 rounded-t-lg relative flex flex-col justify-end overflow-hidden" style={{ height: `${heightPercent}%` }}>
                  <div
                    className={`w-full transition-all ${
                      isToday
                        ? 'bg-gradient-to-t from-[#0B192C] to-[#D4AF37]'
                        : 'bg-[#1E3E62] hover:bg-[#0B192C]'
                    }`}
                    style={{ height: '100%' }}
                  />
                </div>
                <span
                  className={`text-[10px] font-semibold ${
                    isToday ? 'text-[#0B192C] font-black' : 'text-slate-400'
                  }`}
                >
                  {day.dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Quick Cards: Debts & Stock Warnings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Customer Debts Alert Card */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Pending Customer Debts</h4>
                  <p className="text-[11px] text-slate-500">{totals.debtorCount} customers owe you</p>
                </div>
              </div>
              <span className="text-sm font-black text-rose-600 tabular-nums">
                {formatNaira(totals.totalOutstandingDebt)}
              </span>
            </div>

            {activeDebts.length > 0 && (
              <div className="text-xs text-slate-600 space-y-1.5 my-2">
                {activeDebts.slice(0, 2).map((d) => (
                  <div key={d.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                    <span className="font-semibold text-slate-800 truncate max-w-[130px]">
                      {d.customerName}
                    </span>
                    <span className="font-bold text-rose-600 tabular-nums">
                      {formatNaira(d.remainingBalance)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateTab('debts')}
            className="w-full mt-2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1"
          >
            <span>Manage Debts & WhatsApp Reminders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stock & Inventory Valuation Card */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Inventory Health</h4>
                  <p className="text-[11px] text-slate-500">
                    {lowStockProducts.length > 0
                      ? `${lowStockProducts.length} items low on stock!`
                      : 'All stock healthy'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Stock Value</span>
                <span className="text-sm font-black text-[#0B192C] tabular-nums">
                  {formatNaira(totals.inventoryTotalSalesValue)}
                </span>
              </div>
            </div>

            {lowStockProducts.length > 0 ? (
              <div className="text-xs space-y-1.5 my-2">
                {lowStockProducts.slice(0, 2).map((p) => (
                  <div key={p.id} className="flex justify-between items-center bg-amber-50/60 p-2 rounded-xl border border-amber-200">
                    <span className="font-medium text-amber-950 truncate max-w-[140px]">{p.name}</span>
                    <span className="font-bold text-rose-600 text-[11px]">
                      {p.quantity} {p.unit} left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-xs text-emerald-700 bg-emerald-50 rounded-xl my-2">
                Stock is well replenished across all items.
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateTab('inventory')}
            className="w-full mt-2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1"
          >
            <span>View Full Inventory Stock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Today's Recent Sales Log */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-sm font-bold text-[#0B192C]">Recent Sales Today</h3>
          </div>
          <button
            onClick={() => onNavigateTab('sales')}
            className="text-xs font-bold text-[#0B192C] hover:text-[#D4AF37] flex items-center gap-0.5"
          >
            <span>All Sales</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentSales.length === 0 ? (
          <div className="py-6 text-center text-slate-400">
            <ShoppingCart className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-medium">No sales recorded yet today</p>
            <button
              onClick={onOpenRecordSale}
              className="mt-2 px-3 py-1.5 rounded-lg bg-[#0B192C] text-[#F5D061] text-xs font-bold"
            >
              Record First Sale
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentSales.slice(0, 5).map((sale) => (
              <div
                key={sale.id}
                className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl px-2 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">#{sale.saleNumber}</span>
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {sale.paymentMethod}
                    </span>
                    {sale.customerName && (
                      <span className="text-xs text-slate-600 truncate font-medium">
                        · {sale.customerName}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {sale.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {formatDateTime(sale.date)}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-extrabold text-[#0B192C] tabular-nums">
                    {formatNaira(sale.totalAmount)}
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-700">
                    +{formatNaira(sale.profit)} profit
                  </div>
                  <button
                    onClick={() => onViewReceipt(sale)}
                    className="mt-1 text-[11px] font-bold text-[#D4AF37] hover:underline"
                  >
                    Receipt
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
