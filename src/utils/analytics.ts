/**
 * Deterministic Financial Calculations & Business Analytics for Phoenix PocketBiz AI
 * All calculations are 100% computed via deterministic application logic.
 */

import {
  AIInsight,
  Customer,
  DailySummary,
  DebtRecord,
  Expense,
  FinancialTotals,
  Product,
  Sale,
} from '../types';
import { isToday, isWithinDays } from './formatters';

export function calculateFinancialTotals(
  sales: Sale[],
  expenses: Expense[],
  debts: DebtRecord[],
  products: Product[]
): FinancialTotals {
  // Today's metrics
  const todaySalesList = sales.filter((s) => isToday(s.date));
  const todayExpensesList = expenses.filter((e) => isToday(e.date));

  const todaySales = todaySalesList.reduce((sum, s) => sum + s.totalAmount, 0);
  const todayCost = todaySalesList.reduce((sum, s) => sum + s.totalCost, 0);
  const todayGrossProfit = todaySales - todayCost;
  const todayExpenses = todayExpensesList.reduce((sum, e) => sum + e.amount, 0);
  const todayNetProfit = todayGrossProfit - todayExpenses;
  const todaySalesCount = todaySalesList.length;

  // Last 7 days (Week)
  const weekSalesList = sales.filter((s) => isWithinDays(s.date, 7));
  const weekExpensesList = expenses.filter((e) => isWithinDays(e.date, 7));

  const weekSales = weekSalesList.reduce((sum, s) => sum + s.totalAmount, 0);
  const weekCost = weekSalesList.reduce((sum, s) => sum + s.totalCost, 0);
  const weekGrossProfit = weekSales - weekCost;
  const weekExpenses = weekExpensesList.reduce((sum, e) => sum + e.amount, 0);
  const weekNetProfit = weekGrossProfit - weekExpenses;

  // Last 30 days (Month)
  const monthSalesList = sales.filter((s) => isWithinDays(s.date, 30));
  const monthExpensesList = expenses.filter((e) => isWithinDays(e.date, 30));

  const monthSales = monthSalesList.reduce((sum, s) => sum + s.totalAmount, 0);
  const monthCost = monthSalesList.reduce((sum, s) => sum + s.totalCost, 0);
  const monthGrossProfit = monthSales - monthCost;
  const monthExpenses = monthExpensesList.reduce((sum, e) => sum + e.amount, 0);
  const monthNetProfit = monthGrossProfit - monthExpenses;

  // Debts
  const activeDebts = debts.filter((d) => d.status !== 'cleared' && d.remainingBalance > 0);
  const totalOutstandingDebt = activeDebts.reduce((sum, d) => sum + d.remainingBalance, 0);
  const debtorCount = activeDebts.length;

  // Inventory
  const inventoryTotalCostValue = products.reduce((sum, p) => sum + p.costPrice * p.quantity, 0);
  const inventoryTotalSalesValue = products.reduce(
    (sum, p) => sum + p.sellingPrice * p.quantity,
    0
  );
  const inventoryPotentialProfit = inventoryTotalSalesValue - inventoryTotalCostValue;
  const lowStockCount = products.filter((p) => p.quantity <= p.minStockLevel).length;

  return {
    todaySales,
    todayExpenses,
    todayGrossProfit,
    todayNetProfit,
    todaySalesCount,

    weekSales,
    weekExpenses,
    weekGrossProfit,
    weekNetProfit,

    monthSales,
    monthExpenses,
    monthGrossProfit,
    monthNetProfit,

    totalOutstandingDebt,
    debtorCount,

    inventoryTotalCostValue,
    inventoryTotalSalesValue,
    inventoryPotentialProfit,
    lowStockCount,
  };
}

/**
 * Calculates daily breakdown for the past 7 days
 */
export function calculateDailySummaries(sales: Sale[], expenses: Expense[]): DailySummary[] {
  const summaries: DailySummary[] = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const nextDay = new Date(d);
    nextDay.setDate(nextDay.getDate() + 1);

    const daySales = sales.filter((s) => {
      const saleDate = new Date(s.date);
      return saleDate >= d && saleDate < nextDay;
    });

    const dayExpenses = expenses.filter((e) => {
      const expDate = new Date(e.date);
      return expDate >= d && expDate < nextDay;
    });

    const totalSales = daySales.reduce((acc, s) => acc + s.totalAmount, 0);
    const totalCost = daySales.reduce((acc, s) => acc + s.totalCost, 0);
    const grossProfit = totalSales - totalCost;
    const totalExp = dayExpenses.reduce((acc, e) => acc + e.amount, 0);
    const netProfit = grossProfit - totalExp;

    summaries.push({
      date: d.toISOString().split('T')[0],
      dayName: i === 0 ? 'Today' : i === 1 ? 'Yest' : daysOfWeek[d.getDay()],
      totalSales,
      totalCost,
      grossProfit,
      totalExpenses: totalExp,
      netProfit,
      salesCount: daySales.length,
    });
  }

  return summaries;
}

/**
 * Calculates top selling products by sales volume & revenue
 */
export function calculateTopProducts(
  sales: Sale[],
  products: Product[],
  limit = 5
): Array<{
  id: string;
  name: string;
  quantitySold: number;
  totalRevenue: number;
  totalProfit: number;
}> {
  const map: Record<
    string,
    { id: string; name: string; quantitySold: number; totalRevenue: number; totalProfit: number }
  > = {};

  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      const key = item.productId || item.name;
      if (!map[key]) {
        map[key] = {
          id: key,
          name: item.name,
          quantitySold: 0,
          totalRevenue: 0,
          totalProfit: 0,
        };
      }
      map[key].quantitySold += item.quantity;
      map[key].totalRevenue += item.total;
      map[key].totalProfit += (item.unitPrice - item.costPrice) * item.quantity;
    });
  });

  return Object.values(map)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, limit);
}

/**
 * Customer CRM Analytics: compiles customer spend, debts, and history
 */
export interface CustomerWithMetrics extends Customer {
  totalSpend: number;
  totalProfitGenerated: number;
  ordersCount: number;
  activeDebt: number;
  lastOrderDate?: string;
  salesHistory: Sale[];
  debtsHistory: DebtRecord[];
}

export function calculateCustomerMetrics(
  customers: Customer[],
  sales: Sale[],
  debts: DebtRecord[]
): CustomerWithMetrics[] {
  return customers.map((customer) => {
    // Linked sales: match by customerId or exact customerName
    const customerSales = sales.filter(
      (s) => s.customerId === customer.id || (s.customerName && s.customerName.toLowerCase() === customer.name.toLowerCase())
    );

    const totalSpend = customerSales.reduce((acc, s) => acc + s.totalAmount, 0);
    const totalProfitGenerated = customerSales.reduce((acc, s) => acc + s.profit, 0);
    const ordersCount = customerSales.length;

    // Sort sales descending by date
    const sortedSales = [...customerSales].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const lastOrderDate = sortedSales[0]?.date;

    // Linked debts
    const customerDebts = debts.filter(
      (d) => d.customerId === customer.id || (d.customerName && d.customerName.toLowerCase() === customer.name.toLowerCase())
    );
    const activeDebt = customerDebts
      .filter((d) => d.status !== 'cleared')
      .reduce((acc, d) => acc + d.remainingBalance, 0);

    return {
      ...customer,
      totalSpend,
      totalProfitGenerated,
      ordersCount,
      activeDebt,
      lastOrderDate,
      salesHistory: sortedSales,
      debtsHistory: customerDebts,
    };
  });
}

/**
 * Generates Smart Phoenix AI Business Insights based on real deterministic data
 */
export function generatePhoenixInsights(
  totals: FinancialTotals,
  products: Product[],
  debts: DebtRecord[],
  topProducts: Array<{ name: string; totalRevenue: number }>
): AIInsight[] {
  const insights: AIInsight[] = [];

  // 1. Profit & Loss Health
  if (totals.todayNetProfit > 0) {
    const margin = totals.todaySales > 0 ? (totals.todayNetProfit / totals.todaySales) * 100 : 0;
    insights.push({
      id: 'ins-1',
      type: 'profit',
      priority: 'high',
      title: 'Profitable Trading Day! 🎉',
      message: `Your net profit today is ₦${totals.todayNetProfit.toLocaleString('en-NG')} (${margin.toFixed(1)}% margin). Keep up the momentum!`,
      actionLabel: 'View Sales',
      actionTab: 'sales',
    });
  } else if (totals.todayExpenses > totals.todayGrossProfit && totals.todaySalesCount > 0) {
    insights.push({
      id: 'ins-2',
      type: 'profit',
      priority: 'high',
      title: 'Expenses Exceeding Profit Today',
      message: `Today's expenses (₦${totals.todayExpenses.toLocaleString('en-NG')}) exceed your gross margin. Review operating costs like fuel and dispatch.`,
      actionLabel: 'Check Expenses',
      actionTab: 'expenses',
    });
  }

  // 2. Inventory Alerts
  const lowStock = products.filter((p) => p.quantity <= p.minStockLevel);
  if (lowStock.length > 0) {
    const names = lowStock.map((p) => p.name).slice(0, 2).join(', ');
    const countRest = lowStock.length > 2 ? ` and ${lowStock.length - 2} more` : '';
    insights.push({
      id: 'ins-3',
      type: 'inventory',
      priority: 'high',
      title: `${lowStock.length} Items Running Low on Stock ⚠️`,
      message: `${names}${countRest} are below safety levels. Restock soon to prevent missed sales.`,
      actionLabel: 'Manage Stock',
      actionTab: 'inventory',
    });
  }

  // 3. Customer Debt Recovery
  if (totals.totalOutstandingDebt > 0) {
    insights.push({
      id: 'ins-4',
      type: 'debt',
      priority: 'medium',
      title: `₦${totals.totalOutstandingDebt.toLocaleString('en-NG')} Pending in Customer Credit`,
      message: `You have ${totals.debtorCount} customers owing. Send gentle WhatsApp reminders in Pidgin or English to recover your cash flow.`,
      actionLabel: 'Recover Debts',
      actionTab: 'debts',
    });
  }

  // 4. Best Seller Tip
  if (topProducts.length > 0) {
    insights.push({
      id: 'ins-5',
      type: 'tip',
      priority: 'info',
      title: `Top Star Product: ${topProducts[0].name}`,
      message: `Generated ₦${topProducts[0].totalRevenue.toLocaleString('en-NG')} in sales. Consider stocking up or offering a bundle discount.`,
      actionLabel: 'View Inventory',
      actionTab: 'inventory',
    });
  }

  return insights;
}
