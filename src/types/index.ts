/**
 * Phoenix PocketBiz AI - Types and Domain Models
 */

export interface BusinessProfile {
  name: string;
  ownerName: string;
  phone: string;
  email?: string;
  address: string;
  currency: string; // '₦'
  tagline?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export type CustomerCategory = 'regular' | 'vip' | 'wholesale' | 'credit';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  category: CustomerCategory;
  notes?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  costPrice: number;    // In Nigerian Naira (₦)
  sellingPrice: number; // In Nigerian Naira (₦)
  quantity: number;     // Current stock
  minStockLevel: number; // Threshold for low stock warning
  unit: string;         // 'Pcs', 'Carton', 'Bag', 'Bottle', 'Roll', 'Kg'
  barcode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  productId?: string;
  name: string;
  quantity: number;
  costPrice: number;
  unitPrice: number;
  total: number;
}

export type PaymentMethod = 'cash' | 'transfer' | 'pos' | 'credit';

export interface Sale {
  id: string;
  saleNumber: string; // e.g. "REC-024"
  date: string;       // ISO format YYYY-MM-DDTHH:mm:ss
  items: SaleItem[];
  totalAmount: number;
  totalCost: number;
  profit: number;     // Deterministic: totalAmount - totalCost
  paymentMethod: PaymentMethod;
  customerId?: string;
  customerName?: string;
  notes?: string;
  debtId?: string;    // If paymentMethod is credit
}

export type ExpenseCategory =
  | 'Generator & Fuel'
  | 'Shop Rent & Levies'
  | 'Transport & Delivery'
  | 'Inventory Stock'
  | 'Staff Wages'
  | 'PHCN / Light Bill'
  | 'Repairs & Shop Maintenance'
  | 'Market Security & Cleaning'
  | 'Packaging & Nylon'
  | 'Personal / Owner Drawing'
  | 'Other';

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  paymentMethod: 'cash' | 'transfer' | 'pos';
}

export interface DebtRepayment {
  id: string;
  amount: number;
  date: string;
  paymentMethod: 'cash' | 'transfer' | 'pos';
  notes?: string;
}

export interface DebtRecord {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  saleId?: string;
  initialAmount: number;
  amountPaid: number;
  remainingBalance: number; // initialAmount - amountPaid
  dateCreated: string;
  dueDate?: string;
  status: 'unpaid' | 'partial' | 'cleared';
  itemsDescription: string;
  repayments: DebtRepayment[];
}

export interface DailySummary {
  date: string;
  dayName: string;
  totalSales: number;
  totalCost: number;
  grossProfit: number;
  totalExpenses: number;
  netProfit: number;
  salesCount: number;
}

export interface FinancialTotals {
  todaySales: number;
  todayExpenses: number;
  todayGrossProfit: number;
  todayNetProfit: number;
  todaySalesCount: number;
  
  weekSales: number;
  weekExpenses: number;
  weekGrossProfit: number;
  weekNetProfit: number;
  
  monthSales: number;
  monthExpenses: number;
  monthGrossProfit: number;
  monthNetProfit: number;
  
  totalOutstandingDebt: number;
  debtorCount: number;
  
  inventoryTotalCostValue: number;
  inventoryTotalSalesValue: number;
  inventoryPotentialProfit: number;
  lowStockCount: number;
}

export interface AIInsight {
  id: string;
  type: 'profit' | 'inventory' | 'debt' | 'tip';
  priority: 'high' | 'medium' | 'info';
  title: string;
  message: string;
  actionLabel?: string;
  actionTab?: string;
}
