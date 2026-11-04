/**
 * Local Storage persistence and initial seed data for Phoenix PocketBiz AI
 */

import {
  BusinessProfile,
  Customer,
  DebtRecord,
  Expense,
  Product,
  Sale,
} from '../types';

const STORAGE_KEYS = {
  BUSINESS: 'phoenix_pocketbiz_business',
  PRODUCTS: 'phoenix_pocketbiz_products',
  SALES: 'phoenix_pocketbiz_sales',
  EXPENSES: 'phoenix_pocketbiz_expenses',
  DEBTS: 'phoenix_pocketbiz_debts',
  CUSTOMERS: 'phoenix_pocketbiz_customers',
  INITIALIZED: 'phoenix_pocketbiz_init_v1',
};

export const defaultBusinessProfile: BusinessProfile = {
  name: 'Phoenix Amaka Stores',
  ownerName: 'Amaka Eze',
  phone: '0803 456 7890',
  email: 'amakastores.yaba@gmail.com',
  address: 'Shop 18, Block B, Tejuosho Market, Yaba, Lagos',
  currency: '₦',
  tagline: 'Your Trusted Provisions & Wholesale Cold Drinks Partner',
  bankDetails: {
    bankName: 'Access Bank',
    accountNumber: '0124589921',
    accountName: 'Amaka Eze Enterprise',
  },
};

export const defaultProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Indomie Super Pack (Carton of 40)',
    category: 'Foodstuff',
    costPrice: 11500,
    sellingPrice: 13800,
    quantity: 24,
    minStockLevel: 5,
    unit: 'Carton',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Golden Penny Spaghetti (Carton of 20)',
    category: 'Foodstuff',
    costPrice: 14200,
    sellingPrice: 16500,
    quantity: 18,
    minStockLevel: 5,
    unit: 'Carton',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Dangote Sugar (50kg Bag)',
    category: 'Grains & Sugar',
    costPrice: 72000,
    sellingPrice: 78500,
    quantity: 3, // LOW STOCK
    minStockLevel: 5,
    unit: 'Bag',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Milo Beverage Powder (Tin 400g)',
    category: 'Beverages',
    costPrice: 3100,
    sellingPrice: 3800,
    quantity: 16,
    minStockLevel: 6,
    unit: 'Tin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    name: 'Peak Milk Full Cream (Tin 400g)',
    category: 'Beverages',
    costPrice: 3400,
    sellingPrice: 4100,
    quantity: 22,
    minStockLevel: 6,
    unit: 'Tin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    name: 'Mamador Pure Vegetable Oil (5 Litres)',
    category: 'Oils & Spices',
    costPrice: 13500,
    sellingPrice: 15800,
    quantity: 8,
    minStockLevel: 4,
    unit: 'Gallon',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-7',
    name: 'Eva Table Water 75cl (Pack of 12)',
    category: 'Drinks & Water',
    costPrice: 2200,
    sellingPrice: 2900,
    quantity: 35,
    minStockLevel: 10,
    unit: 'Pack',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-8',
    name: 'Coca-Cola 50cl Pet (Pack of 12)',
    category: 'Drinks & Water',
    costPrice: 3300,
    sellingPrice: 4200,
    quantity: 19,
    minStockLevel: 6,
    unit: 'Pack',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-9',
    name: 'Ariel Multi-Care Washing Powder (2kg)',
    category: 'Toiletries & Cleaning',
    costPrice: 4800,
    sellingPrice: 5600,
    quantity: 4, // LOW STOCK
    minStockLevel: 6,
    unit: 'Pcs',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-10',
    name: 'Gino Tomato Paste Sachet (Roll of 10)',
    category: 'Oils & Spices',
    costPrice: 2800,
    sellingPrice: 3500,
    quantity: 20,
    minStockLevel: 5,
    unit: 'Roll',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-11',
    name: 'Honeywell Semolina (10kg Bag)',
    category: 'Grains & Sugar',
    costPrice: 14500,
    sellingPrice: 17000,
    quantity: 9,
    minStockLevel: 4,
    unit: 'Bag',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-12',
    name: 'Dano Cool Cow Milk Sachet (Pack of 20)',
    category: 'Beverages',
    costPrice: 2600,
    sellingPrice: 3200,
    quantity: 2, // LOW STOCK
    minStockLevel: 5,
    unit: 'Pack',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const defaultCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Alhaji Musa Ibrahim',
    phone: '0802 311 4455',
    email: 'musa.grain@lagosbiz.ng',
    address: 'Stall 44, Foodstuff Section, Tejuosho Market',
    category: 'wholesale',
    notes: 'Takes sugar and spaghetti in bulk. Pays promptly via bank transfer.',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'cust-2',
    name: 'Mama Chinedu (Madam Blessing)',
    phone: '0803 556 7788',
    email: 'blessing.catering@gmail.com',
    address: 'No 14 Commercial Avenue, Sabo, Yaba',
    category: 'credit',
    notes: 'Runs a popular canteen in Sabo. Takes inventory on credit every Monday.',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: 'cust-3',
    name: 'Emeka Okonkwo',
    phone: '0814 998 8221',
    address: 'Block C, Line 2, Tejuosho Plaza',
    category: 'regular',
    notes: 'Fellow shop owner nearby, regularly buys cold drinks and energy snacks.',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'cust-4',
    name: 'Mrs. Aisha Bello',
    phone: '0807 665 5443',
    email: 'aisha.bello@yaba.org',
    address: 'Plot 7, Montgomery Road, Yaba',
    category: 'vip',
    notes: 'Monthly provisions buyer for home and staff.',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'cust-5',
    name: 'Brother Tunde Balogun',
    phone: '0901 223 3445',
    address: 'Akoka Campus Gate, UNILAG Axis',
    category: 'regular',
    notes: 'Student fellowship coordinator, buys bottled Eva water and Milo in cartons.',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

// Helper to make dates relative to today
const getDateAgo = (daysAgo: number, hours = 10, minutes = 15): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

export const defaultSales: Sale[] = [
  // Today's Sales
  {
    id: 'sale-1',
    saleNumber: 'REC-101',
    date: getDateAgo(0, 9, 30),
    items: [
      {
        productId: 'prod-1',
        name: 'Indomie Super Pack (Carton of 40)',
        quantity: 2,
        costPrice: 11500,
        unitPrice: 13800,
        total: 27600,
      },
      {
        productId: 'prod-7',
        name: 'Eva Table Water 75cl (Pack of 12)',
        quantity: 3,
        costPrice: 2200,
        unitPrice: 2900,
        total: 8700,
      },
    ],
    totalAmount: 36300,
    totalCost: 29600,
    profit: 6700,
    paymentMethod: 'transfer',
    customerId: 'cust-1',
    customerName: 'Alhaji Musa Ibrahim',
    notes: 'Morning wholesale order',
  },
  {
    id: 'sale-2',
    saleNumber: 'REC-102',
    date: getDateAgo(0, 11, 45),
    items: [
      {
        productId: 'prod-4',
        name: 'Milo Beverage Powder (Tin 400g)',
        quantity: 2,
        costPrice: 3100,
        unitPrice: 3800,
        total: 7600,
      },
      {
        productId: 'prod-5',
        name: 'Peak Milk Full Cream (Tin 400g)',
        quantity: 2,
        costPrice: 3400,
        unitPrice: 4100,
        total: 8200,
      },
      {
        productId: 'prod-10',
        name: 'Gino Tomato Paste Sachet (Roll of 10)',
        quantity: 1,
        costPrice: 2800,
        unitPrice: 3500,
        total: 3500,
      },
    ],
    totalAmount: 19300,
    totalCost: 15800,
    profit: 3500,
    paymentMethod: 'cash',
    customerId: 'cust-4',
    customerName: 'Mrs. Aisha Bello',
  },
  {
    id: 'sale-3',
    saleNumber: 'REC-103',
    date: getDateAgo(0, 14, 20),
    items: [
      {
        productId: 'prod-8',
        name: 'Coca-Cola 50cl Pet (Pack of 12)',
        quantity: 2,
        costPrice: 3300,
        unitPrice: 4200,
        total: 8400,
      },
    ],
    totalAmount: 8400,
    totalCost: 6600,
    profit: 1800,
    paymentMethod: 'pos',
    customerId: 'cust-3',
    customerName: 'Emeka Okonkwo',
  },
  // Yesterday's Sales
  {
    id: 'sale-4',
    saleNumber: 'REC-098',
    date: getDateAgo(1, 10, 15),
    items: [
      {
        productId: 'prod-2',
        name: 'Golden Penny Spaghetti (Carton of 20)',
        quantity: 3,
        costPrice: 14200,
        unitPrice: 16500,
        total: 49500,
      },
      {
        productId: 'prod-6',
        name: 'Mamador Pure Vegetable Oil (5 Litres)',
        quantity: 1,
        costPrice: 13500,
        unitPrice: 15800,
        total: 15800,
      },
    ],
    totalAmount: 65300,
    totalCost: 56100,
    profit: 9200,
    paymentMethod: 'transfer',
    customerId: 'cust-2',
    customerName: 'Mama Chinedu (Madam Blessing)',
  },
  // 2 Days Ago
  {
    id: 'sale-5',
    saleNumber: 'REC-095',
    date: getDateAgo(2, 13, 10),
    items: [
      {
        productId: 'prod-3',
        name: 'Dangote Sugar (50kg Bag)',
        quantity: 1,
        costPrice: 72000,
        unitPrice: 78500,
        total: 78500,
      },
    ],
    totalAmount: 78500,
    totalCost: 72000,
    profit: 6500,
    paymentMethod: 'transfer',
    customerId: 'cust-1',
    customerName: 'Alhaji Musa Ibrahim',
  },
  // 3 Days Ago
  {
    id: 'sale-6',
    saleNumber: 'REC-090',
    date: getDateAgo(3, 16, 40),
    items: [
      {
        productId: 'prod-1',
        name: 'Indomie Super Pack (Carton of 40)',
        quantity: 4,
        costPrice: 11500,
        unitPrice: 13800,
        total: 55200,
      },
      {
        productId: 'prod-7',
        name: 'Eva Table Water 75cl (Pack of 12)',
        quantity: 5,
        costPrice: 2200,
        unitPrice: 2900,
        total: 14500,
      },
    ],
    totalAmount: 69700,
    totalCost: 57000,
    profit: 12700,
    paymentMethod: 'transfer',
    customerId: 'cust-5',
    customerName: 'Brother Tunde Balogun',
  },
  // 4 Days Ago
  {
    id: 'sale-7',
    saleNumber: 'REC-088',
    date: getDateAgo(4, 11, 20),
    items: [
      {
        productId: 'prod-11',
        name: 'Honeywell Semolina (10kg Bag)',
        quantity: 2,
        costPrice: 14500,
        unitPrice: 17000,
        total: 34000,
      },
      {
        productId: 'prod-9',
        name: 'Ariel Multi-Care Washing Powder (2kg)',
        quantity: 2,
        costPrice: 4800,
        unitPrice: 5600,
        total: 11200,
      },
    ],
    totalAmount: 45200,
    totalCost: 38600,
    profit: 6600,
    paymentMethod: 'cash',
  },
  // 5 Days Ago
  {
    id: 'sale-8',
    saleNumber: 'REC-082',
    date: getDateAgo(5, 15, 0),
    items: [
      {
        productId: 'prod-2',
        name: 'Golden Penny Spaghetti (Carton of 20)',
        quantity: 2,
        costPrice: 14200,
        unitPrice: 16500,
        total: 33000,
      },
      {
        productId: 'prod-8',
        name: 'Coca-Cola 50cl Pet (Pack of 12)',
        quantity: 3,
        costPrice: 3300,
        unitPrice: 4200,
        total: 12600,
      },
    ],
    totalAmount: 45600,
    totalCost: 38300,
    profit: 7300,
    paymentMethod: 'pos',
  },
];

export const defaultExpenses: Expense[] = [
  {
    id: 'exp-1',
    date: getDateAgo(0, 8, 30),
    amount: 11500,
    category: 'Generator & Fuel',
    description: '10 Litres Petrol (PMS) for shop generator',
    paymentMethod: 'cash',
  },
  {
    id: 'exp-2',
    date: getDateAgo(1, 14, 0),
    amount: 3500,
    category: 'Transport & Delivery',
    description: 'Keke dispatch to deliver cartons to Sabo',
    paymentMethod: 'transfer',
  },
  {
    id: 'exp-3',
    date: getDateAgo(2, 9, 0),
    amount: 2000,
    category: 'Market Security & Cleaning',
    description: 'Weekly market security and refuse levy',
    paymentMethod: 'cash',
  },
  {
    id: 'exp-4',
    date: getDateAgo(4, 16, 30),
    amount: 4500,
    category: 'Packaging & Nylon',
    description: 'Roll of black wholesale nylon and heavy masking tape',
    paymentMethod: 'cash',
  },
  {
    id: 'exp-5',
    date: getDateAgo(6, 12, 0),
    amount: 15000,
    category: 'Staff Wages',
    description: 'Weekly shop assistant stipend (Chidera)',
    paymentMethod: 'transfer',
  },
];

export const defaultDebts: DebtRecord[] = [
  {
    id: 'debt-1',
    customerId: 'cust-2',
    customerName: 'Mama Chinedu (Madam Blessing)',
    customerPhone: '0803 556 7788',
    initialAmount: 32000,
    amountPaid: 17500,
    remainingBalance: 14500,
    dateCreated: getDateAgo(3, 11, 0),
    dueDate: getDateAgo(-2, 17, 0), // Due in 2 days
    status: 'partial',
    itemsDescription: '2 Cartons Indomie Super Pack + 1 Pack Eva Water',
    repayments: [
      {
        id: 'rep-1',
        amount: 17500,
        date: getDateAgo(1, 15, 30),
        paymentMethod: 'transfer',
        notes: 'Transferred through OPay after lunch peak',
      },
    ],
  },
  {
    id: 'debt-2',
    customerId: 'cust-3',
    customerName: 'Emeka Okonkwo',
    customerPhone: '0814 998 8221',
    initialAmount: 8400,
    amountPaid: 0,
    remainingBalance: 8400,
    dateCreated: getDateAgo(1, 16, 20),
    dueDate: getDateAgo(-1, 18, 0), // Due tomorrow
    status: 'unpaid',
    itemsDescription: '2 Packs Coca-Cola 50cl',
    repayments: [],
  },
  {
    id: 'debt-3',
    customerId: 'cust-5',
    customerName: 'Brother Tunde Balogun',
    customerPhone: '0901 223 3445',
    initialAmount: 18500,
    amountPaid: 18500,
    remainingBalance: 0,
    dateCreated: getDateAgo(6, 10, 0),
    status: 'cleared',
    itemsDescription: '1 Carton Spaghetti + 2 Packs Water',
    repayments: [
      {
        id: 'rep-2',
        amount: 18500,
        date: getDateAgo(2, 16, 0),
        paymentMethod: 'cash',
        notes: 'Paid cash in full at shop',
      },
    ],
  },
];

/**
 * Storage API
 */
export const storage = {
  getBusinessProfile(): BusinessProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUSINESS);
      return data ? JSON.parse(data) : defaultBusinessProfile;
    } catch {
      return defaultBusinessProfile;
    }
  },

  setBusinessProfile(profile: BusinessProfile): void {
    localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(profile));
  },

  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : defaultProducts;
    } catch {
      return defaultProducts;
    }
  },

  setProducts(products: Product[]): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  getCustomers(): Customer[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return data ? JSON.parse(data) : defaultCustomers;
    } catch {
      return defaultCustomers;
    }
  },

  setCustomers(customers: Customer[]): void {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },

  getSales(): Sale[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SALES);
      return data ? JSON.parse(data) : defaultSales;
    } catch {
      return defaultSales;
    }
  },

  setSales(sales: Sale[]): void {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  },

  getExpenses(): Expense[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return data ? JSON.parse(data) : defaultExpenses;
    } catch {
      return defaultExpenses;
    }
  },

  setExpenses(expenses: Expense[]): void {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  },

  getDebts(): DebtRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEBTS);
      return data ? JSON.parse(data) : defaultDebts;
    } catch {
      return defaultDebts;
    }
  },

  setDebts(debts: DebtRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(debts));
  },

  initStorage(): void {
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      this.setBusinessProfile(defaultBusinessProfile);
      this.setProducts(defaultProducts);
      this.setCustomers(defaultCustomers);
      this.setSales(defaultSales);
      this.setExpenses(defaultExpenses);
      this.setDebts(defaultDebts);
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  },

  resetToDefault(): void {
    this.setBusinessProfile(defaultBusinessProfile);
    this.setProducts(defaultProducts);
    this.setCustomers(defaultCustomers);
    this.setSales(defaultSales);
    this.setExpenses(defaultExpenses);
    this.setDebts(defaultDebts);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  },

  exportAllData(): string {
    const backup = {
      business: this.getBusinessProfile(),
      products: this.getProducts(),
      customers: this.getCustomers(),
      sales: this.getSales(),
      expenses: this.getExpenses(),
      debts: this.getDebts(),
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(backup, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.products) this.setProducts(parsed.products);
      if (parsed.customers) this.setCustomers(parsed.customers);
      if (parsed.sales) this.setSales(parsed.sales);
      if (parsed.expenses) this.setExpenses(parsed.expenses);
      if (parsed.debts) this.setDebts(parsed.debts);
      if (parsed.business) this.setBusinessProfile(parsed.business);
      return true;
    } catch (e) {
      console.error('Failed to import backup', e);
      return false;
    }
  },
};
