/**
 * Phoenix PocketBiz AI - Main Application
 * Mobile-first business management application for Nigerian entrepreneurs
 */

import React, { useState, useEffect } from 'react';
import {
  BusinessProfile,
  Customer,
  DebtRecord,
  DebtRepayment,
  Expense,
  Product,
  Sale,
} from './types';
import { storage } from './utils/storage';
import {
  calculateCustomerMetrics,
  calculateDailySummaries,
  calculateFinancialTotals,
  calculateTopProducts,
  generatePhoenixInsights,
} from './utils/analytics';
import { Navbar } from './components/Navbar';
import { BottomNav, TabType } from './components/BottomNav';

// Views
import { DashboardView } from './components/views/DashboardView';
import { SalesView } from './components/views/SalesView';
import { ExpensesView } from './components/views/ExpensesView';
import { DebtsView } from './components/views/DebtsView';
import { InventoryView } from './components/views/InventoryView';
import { CustomersView } from './components/views/CustomersView';
import { ReportsView } from './components/views/ReportsView';

// Modals
import { RecordSaleModal } from './components/modals/RecordSaleModal';
import { AddExpenseModal } from './components/modals/AddExpenseModal';
import { AddDebtModal } from './components/modals/AddDebtModal';
import { RepayDebtModal } from './components/modals/RepayDebtModal';
import { DebtReminderModal } from './components/modals/DebtReminderModal';
import { ProductModal } from './components/modals/ProductModal';
import { CustomerModal } from './components/modals/CustomerModal';
import { CustomerDetailModal } from './components/modals/CustomerDetailModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { BusinessProfileModal } from './components/modals/BusinessProfileModal';
import { PhoenixAdvisorModal } from './components/modals/PhoenixAdvisorModal';

export default function App() {
  // Initialize storage on first load
  useEffect(() => {
    storage.initStorage();
  }, []);

  // Main App State
  const [business, setBusiness] = useState<BusinessProfile>(() => storage.getBusinessProfile());
  const [products, setProducts] = useState<Product[]>(() => storage.getProducts());
  const [customers, setCustomers] = useState<Customer[]>(() => storage.getCustomers());
  const [sales, setSales] = useState<Sale[]>(() => storage.getSales());
  const [expenses, setExpenses] = useState<Expense[]>(() => storage.getExpenses());
  const [debts, setDebts] = useState<DebtRecord[]>(() => storage.getDebts());

  // Active View Tab
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Modals Visibility
  const [isRecordSaleOpen, setIsRecordSaleOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);
  const [isRepayDebtOpen, setIsRepayDebtOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isCustomerDetailOpen, setIsCustomerDetailOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  // Active Selected Entity for Modals
  const [selectedDebt, setSelectedDebt] = useState<DebtRecord | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Sync state changes to localStorage
  const updateBusiness = (b: BusinessProfile) => {
    setBusiness(b);
    storage.setBusinessProfile(b);
  };

  const updateProducts = (prods: Product[]) => {
    setProducts(prods);
    storage.setProducts(prods);
  };

  const updateCustomers = (custs: Customer[]) => {
    setCustomers(custs);
    storage.setCustomers(custs);
  };

  const updateSales = (s: Sale[]) => {
    setSales(s);
    storage.setSales(s);
  };

  const updateExpenses = (e: Expense[]) => {
    setExpenses(e);
    storage.setExpenses(e);
  };

  const updateDebts = (d: DebtRecord[]) => {
    setDebts(d);
    storage.setDebts(d);
  };

  // Deterministic Analytics & Computed Data
  const totals = calculateFinancialTotals(sales, expenses, debts, products);
  const dailySummaries = calculateDailySummaries(sales, expenses);
  const topProducts = calculateTopProducts(sales, products, 5);
  const customersWithMetrics = calculateCustomerMetrics(customers, sales, debts);
  const insights = generatePhoenixInsights(totals, products, debts, topProducts);

  const lowStockProducts = products.filter((p) => p.quantity <= p.minStockLevel);
  const activeDebts = debts.filter((d) => d.status !== 'cleared');

  // Handlers for Transactions & CRUD
  const handleSaveSale = (
    saleData: Omit<Sale, 'id' | 'saleNumber'>,
    createDebt?: { dueDate?: string; notes?: string }
  ): Sale => {
    const saleId = `sale-${Date.now()}`;
    const saleNumber = `REC-${(sales.length + 101).toString().padStart(3, '0')}`;

    let debtId: string | undefined = undefined;

    // If payment method is Credit, record a customer debt automatically!
    if (saleData.paymentMethod === 'credit') {
      const dId = `debt-${Date.now()}`;
      debtId = dId;

      const customerObj = customers.find((c) => c.id === saleData.customerId);
      const custName = customerObj?.name || saleData.customerName || 'Walk-in Customer';
      const custPhone = customerObj?.phone || 'N/A';
      const itemsSummary = saleData.items.map((i) => `${i.quantity}x ${i.name}`).join(', ');

      const newDebt: DebtRecord = {
        id: dId,
        customerId: saleData.customerId || `cust-temp-${Date.now()}`,
        customerName: custName,
        customerPhone: custPhone,
        saleId,
        initialAmount: saleData.totalAmount,
        amountPaid: 0,
        remainingBalance: saleData.totalAmount,
        dateCreated: saleData.date,
        dueDate: createDebt?.dueDate,
        status: 'unpaid',
        itemsDescription: itemsSummary,
        repayments: [],
      };

      updateDebts([newDebt, ...debts]);
    }

    const newSale: Sale = {
      ...saleData,
      id: saleId,
      saleNumber,
      debtId,
    };

    // Update stock levels for catalog products
    const updatedProducts = products.map((prod) => {
      const inCart = saleData.items.find((item) => item.productId === prod.id);
      if (inCart) {
        return {
          ...prod,
          quantity: Math.max(0, prod.quantity - inCart.quantity),
          updatedAt: new Date().toISOString(),
        };
      }
      return prod;
    });

    updateProducts(updatedProducts);
    updateSales([newSale, ...sales]);
    return newSale;
  };

  const handleSaveExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    updateExpenses([newExpense, ...expenses]);
  };

  const handleDeleteExpense = (id: string) => {
    updateExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleSaveDebt = (
    debtData: Omit<DebtRecord, 'id' | 'status' | 'amountPaid' | 'remainingBalance' | 'repayments'>
  ) => {
    const newDebt: DebtRecord = {
      ...debtData,
      id: `debt-${Date.now()}`,
      amountPaid: 0,
      remainingBalance: debtData.initialAmount,
      status: 'unpaid',
      repayments: [],
    };
    updateDebts([newDebt, ...debts]);
  };

  const handleRecordRepayment = (debtId: string, repaymentData: Omit<DebtRepayment, 'id'>) => {
    const repId = `rep-${Date.now()}`;
    const newRepayment: DebtRepayment = {
      ...repaymentData,
      id: repId,
    };

    const updatedDebts = debts.map((d) => {
      if (d.id === debtId) {
        const newPaid = d.amountPaid + repaymentData.amount;
        const newRemaining = Math.max(0, d.initialAmount - newPaid);
        return {
          ...d,
          amountPaid: newPaid,
          remainingBalance: newRemaining,
          status: newRemaining === 0 ? ('cleared' as const) : ('partial' as const),
          repayments: [newRepayment, ...d.repayments],
        };
      }
      return d;
    });

    updateDebts(updatedDebts);
  };

  const handleDeleteDebt = (id: string) => {
    updateDebts(debts.filter((d) => d.id !== id));
  };

  const handleSaveProduct = (
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => {
    const now = new Date().toISOString();
    if (id) {
      updateProducts(
        products.map((p) =>
          p.id === id ? { ...p, ...productData, updatedAt: now } : p
        )
      );
    } else {
      const newProduct: Product = {
        ...productData,
        id: `prod-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      updateProducts([newProduct, ...products]);
    }
  };

  const handleDeleteProduct = (id: string) => {
    updateProducts(products.filter((p) => p.id !== id));
  };

  const handleAdjustStock = (id: string, delta: number) => {
    updateProducts(
      products.map((p) =>
        p.id === id
          ? {
              ...p,
              quantity: Math.max(0, p.quantity + delta),
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
  };

  const handleSaveCustomer = (
    customerData: Omit<Customer, 'id' | 'createdAt'>,
    id?: string
  ) => {
    if (id) {
      updateCustomers(
        customers.map((c) => (c.id === id ? { ...c, ...customerData } : c))
      );
    } else {
      const newCust: Customer = {
        ...customerData,
        id: `cust-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      updateCustomers([newCust, ...customers]);
    }
  };

  const handleDeleteCustomer = (id: string) => {
    updateCustomers(customers.filter((c) => c.id !== id));
  };

  const handleExportData = () => {
    const dataStr = storage.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phoenix_pocketbiz_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonStr: string): boolean => {
    const success = storage.importData(jsonStr);
    if (success) {
      setBusiness(storage.getBusinessProfile());
      setProducts(storage.getProducts());
      setCustomers(storage.getCustomers());
      setSales(storage.getSales());
      setExpenses(storage.getExpenses());
      setDebts(storage.getDebts());
    }
    return success;
  };

  const handleResetData = () => {
    storage.resetToDefault();
    setBusiness(storage.getBusinessProfile());
    setProducts(storage.getProducts());
    setCustomers(storage.getCustomers());
    setSales(storage.getSales());
    setExpenses(storage.getExpenses());
    setDebts(storage.getDebts());
  };

  // Find customer object for receipt if applicable
  const receiptCustomer = selectedSale?.customerId
    ? customers.find((c) => c.id === selectedSale.customerId)
    : undefined;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col antialiased selection:bg-[#D4AF37] selection:text-[#0B192C]">
      {/* Top Navbar */}
      <Navbar
        business={business}
        onOpenSettings={() => setIsProfileOpen(true)}
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
        activeTab={activeTab}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            business={business}
            totals={totals}
            dailySummaries={dailySummaries}
            insights={insights}
            recentSales={sales}
            lowStockProducts={lowStockProducts}
            activeDebts={activeDebts}
            onOpenRecordSale={() => setIsRecordSaleOpen(true)}
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            onOpenAddDebt={() => setIsAddDebtOpen(true)}
            onOpenAddProduct={() => {
              setSelectedProduct(null);
              setIsProductModalOpen(true);
            }}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onViewReceipt={(sale) => {
              setSelectedSale(sale);
              setIsReceiptOpen(true);
            }}
            onOpenAdvisor={() => setIsAdvisorOpen(true)}
          />
        )}

        {activeTab === 'sales' && (
          <SalesView
            sales={sales}
            onOpenRecordSale={() => setIsRecordSaleOpen(true)}
            onViewReceipt={(sale) => {
              setSelectedSale(sale);
              setIsReceiptOpen(true);
            }}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesView
            expenses={expenses}
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {activeTab === 'debts' && (
          <DebtsView
            debts={debts}
            onOpenAddDebt={() => setIsAddDebtOpen(true)}
            onOpenRepayModal={(debt) => {
              setSelectedDebt(debt);
              setIsRepayDebtOpen(true);
            }}
            onOpenReminderModal={(debt) => {
              setSelectedDebt(debt);
              setIsReminderModalOpen(true);
            }}
            onDeleteDebt={handleDeleteDebt}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryView
            products={products}
            onOpenAddProduct={() => {
              setSelectedProduct(null);
              setIsProductModalOpen(true);
            }}
            onEditProduct={(prod) => {
              setSelectedProduct(prod);
              setIsProductModalOpen(true);
            }}
            onDeleteProduct={handleDeleteProduct}
            onAdjustStock={handleAdjustStock}
          />
        )}

        {activeTab === 'customers' && (
          <CustomersView
            customers={customersWithMetrics}
            onOpenAddCustomer={() => {
              setSelectedCustomer(null);
              setIsCustomerModalOpen(true);
            }}
            onSelectCustomer={(cust) => {
              setSelectedCustomer(cust);
              setIsCustomerDetailOpen(true);
            }}
            onEditCustomer={(cust) => {
              setSelectedCustomer(cust);
              setIsCustomerModalOpen(true);
            }}
            onDeleteCustomer={handleDeleteCustomer}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            totals={totals}
            dailySummaries={dailySummaries}
            sales={sales}
            expenses={expenses}
            topProducts={topProducts}
          />
        )}
      </main>

      {/* Android Thumb Ergonomics Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        debtsCount={activeDebts.length}
        lowStockCount={lowStockProducts.length}
      />

      {/* Modals & Dialogs */}
      <RecordSaleModal
        isOpen={isRecordSaleOpen}
        onClose={() => setIsRecordSaleOpen(false)}
        products={products}
        customers={customers}
        onSaveSale={handleSaveSale}
        onViewReceipt={(sale) => {
          setSelectedSale(sale);
          setIsReceiptOpen(true);
        }}
      />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSaveExpense={handleSaveExpense}
      />

      <AddDebtModal
        isOpen={isAddDebtOpen}
        onClose={() => setIsAddDebtOpen(false)}
        customers={customers}
        onSaveDebt={handleSaveDebt}
      />

      <RepayDebtModal
        debt={selectedDebt}
        isOpen={isRepayDebtOpen}
        onClose={() => {
          setIsRepayDebtOpen(false);
          setSelectedDebt(null);
        }}
        onRecordRepayment={handleRecordRepayment}
      />

      <DebtReminderModal
        debt={selectedDebt}
        business={business}
        isOpen={isReminderModalOpen}
        onClose={() => {
          setIsReminderModalOpen(false);
          setSelectedDebt(null);
        }}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        onSaveProduct={handleSaveProduct}
      />

      <CustomerModal
        customer={selectedCustomer}
        isOpen={isCustomerModalOpen}
        onClose={() => {
          setIsCustomerModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSaveCustomer={handleSaveCustomer}
      />

      <CustomerDetailModal
        customer={
          selectedCustomer
            ? customersWithMetrics.find((c) => c.id === selectedCustomer.id) || null
            : null
        }
        isOpen={isCustomerDetailOpen}
        onClose={() => {
          setIsCustomerDetailOpen(false);
          setSelectedCustomer(null);
        }}
        onEditCustomer={(c) => {
          setSelectedCustomer(c);
          setIsCustomerModalOpen(true);
        }}
        onOpenRepayModal={(d) => {
          setSelectedDebt(d);
          setIsRepayDebtOpen(true);
        }}
        onOpenReminderModal={(d) => {
          setSelectedDebt(d);
          setIsReminderModalOpen(true);
        }}
        onViewReceipt={(s) => {
          setSelectedSale(s);
          setIsReceiptOpen(true);
        }}
      />

      <ReceiptModal
        sale={selectedSale}
        business={business}
        customer={receiptCustomer}
        isOpen={isReceiptOpen}
        onClose={() => {
          setIsReceiptOpen(false);
          setSelectedSale(null);
        }}
      />

      <BusinessProfileModal
        business={business}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSaveProfile={updateBusiness}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onResetData={handleResetData}
      />

      <PhoenixAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        totals={totals}
        insights={insights}
        business={business}
        products={products}
        debts={debts}
        onNavigateTab={(tab) => {
          setIsAdvisorOpen(false);
          setActiveTab(tab);
        }}
      />
    </div>
  );
}
