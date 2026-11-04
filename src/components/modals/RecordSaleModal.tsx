import React, { useState, useId } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  User,
  CreditCard,
  Banknote,
  Send,
  Sparkles,
  Search,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Customer, PaymentMethod, Product, Sale, SaleItem } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface RecordSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  customers: Customer[];
  onSaveSale: (
    sale: Omit<Sale, 'id' | 'saleNumber'>,
    createDebt?: { dueDate?: string; notes?: string }
  ) => Sale;
  onViewReceipt: (sale: Sale) => void;
  onAddNewCustomer?: (name: string, phone: string) => Customer;
}

export const RecordSaleModal: React.FC<RecordSaleModalProps> = ({
  isOpen,
  onClose,
  products,
  customers,
  onSaveSale,
  onViewReceipt,
  onAddNewCustomer,
}) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [manualCustomerName, setManualCustomerName] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [creditDueDate, setCreditDueDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showCustomItem, setShowCustomItem] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customCost, setCustomCost] = useState('');
  const [customQty, setCustomQty] = useState('1');

  if (!isOpen) return null;

  // Categories for product catalog filter
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.unitPrice,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          quantity: 1,
          costPrice: product.costPrice,
          unitPrice: product.sellingPrice,
          total: product.sellingPrice,
        },
      ];
    });
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const item = prev[index];
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      return prev.map((it, i) =>
        i === index
          ? {
              ...it,
              quantity: newQty,
              total: newQty * it.unitPrice,
            }
          : it
      );
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    const sell = parseFloat(customPrice) || 0;
    const cost = parseFloat(customCost) || sell * 0.8; // estimate 20% margin if not entered
    const qty = parseInt(customQty, 10) || 1;

    if (!customName || sell <= 0) return;

    setCart((prev) => [
      ...prev,
      {
        name: customName,
        quantity: qty,
        costPrice: cost,
        unitPrice: sell,
        total: sell * qty,
      },
    ]);

    setCustomName('');
    setCustomPrice('');
    setCustomCost('');
    setCustomQty('1');
    setShowCustomItem(false);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);
  const totalCost = cart.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);
  const profit = totalAmount - totalCost;

  const handleCompleteSale = () => {
    if (cart.length === 0) return;

    const selectedCust = customers.find((c) => c.id === selectedCustomerId);
    const finalCustomerName = selectedCust ? selectedCust.name : manualCustomerName || undefined;

    const savedSale = onSaveSale(
      {
        date: new Date().toISOString(),
        items: cart,
        totalAmount,
        totalCost,
        profit,
        paymentMethod,
        customerId: selectedCustomerId || undefined,
        customerName: finalCustomerName,
        notes: notes || undefined,
      },
      paymentMethod === 'credit'
        ? {
            dueDate: creditDueDate || undefined,
            notes: notes || undefined,
          }
        : undefined
    );

    // Trigger celebratory confetti for winning sale
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#0B192C', '#10B981'],
      });
    } catch {
      // ignore
    }

    onClose();
    // Prompt to view receipt
    onViewReceipt(savedSale);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-xl max-h-[92vh] sm:max-h-[88vh] rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#0B192C] text-white px-5 py-4 flex items-center justify-between border-b border-[#1E3E62] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center text-[#0B192C]">
              <ShoppingCart className="w-4 h-4 font-bold" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Record New Sale</h2>
              <p className="text-xs text-slate-300">Quick cash, transfer, or credit recording</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Customer Selection (CRM Integration) */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
              <User className="w-3.5 h-3.5 text-[#D4AF37]" />
              Customer (Optional / Required for Debt):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={selectedCustomerId}
                onChange={(e) => {
                  setSelectedCustomerId(e.target.value);
                  if (e.target.value) setManualCustomerName('');
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="">-- Select Saved Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>

              {!selectedCustomerId && (
                <input
                  type="text"
                  placeholder="Or type customer name / phone"
                  value={manualCustomerName}
                  onChange={(e) => setManualCustomerName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
                />
              )}
            </div>
          </div>

          {/* Current Cart */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Cart Items ({cart.length})
              </span>
              <button
                type="button"
                onClick={() => setShowCustomItem(!showCustomItem)}
                className="text-xs font-semibold text-[#0B192C] hover:text-[#D4AF37] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {showCustomItem ? 'Hide Custom Item' : '+ Custom Item'}
              </button>
            </div>

            {/* Custom Item Form */}
            {showCustomItem && (
              <form
                onSubmit={handleAddCustomItem}
                className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl mb-3 space-y-2"
              >
                <div className="text-xs font-semibold text-amber-900">Add Quick Non-Catalog Item</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Item name (e.g. Cold Malt)"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    required
                    className="col-span-2 bg-white border border-amber-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-amber-500"
                  />
                  <input
                    type="number"
                    placeholder="Selling Price (₦)"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    required
                    className="bg-white border border-amber-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-amber-500"
                  />
                  <input
                    type="number"
                    placeholder="Cost Price (₦)"
                    value={customCost}
                    onChange={(e) => setCustomCost(e.target.value)}
                    className="bg-white border border-amber-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#0B192C] text-[#F5D061] py-1.5 rounded-lg text-xs font-semibold hover:bg-[#1E3E62]"
                >
                  Add to Cart
                </button>
              </form>
            )}

            {cart.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-600">Cart is empty</p>
                <p className="text-[11px] text-slate-400">Tap products below to add them to this sale</p>
              </div>
            ) : (
              <div className="space-y-2 border border-slate-200 rounded-xl p-2 bg-white divide-y divide-slate-100">
                {cart.map((item, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-800 truncate">{item.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {formatNaira(item.unitPrice)} each · Margin:{' '}
                        <span className="text-emerald-700 font-medium">
                          +{formatNaira(item.unitPrice - item.costPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, -1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-l-lg"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-r-lg"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="w-20 text-right text-xs font-bold text-slate-900 tabular-nums">
                        {formatNaira(item.total)}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeFromCart(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Quick Picker */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pick from Stock
              </span>
              <div className="relative flex-1 max-w-[180px]">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            </div>

            {/* Category horizontal scroller */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-[#0B192C] text-[#F5D061]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const inCart = cart.find((item) => item.productId === p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => addToCart(p)}
                    className={`text-left p-2 rounded-xl border transition-all relative ${
                      inCart
                        ? 'border-[#D4AF37] bg-amber-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-semibold text-slate-800 line-clamp-1">{p.name}</div>
                    <div className="flex items-center justify-between text-[11px] mt-1">
                      <span className="font-bold text-[#0B192C]">{formatNaira(p.sellingPrice)}</span>
                      <span className={`text-[10px] ${p.quantity <= p.minStockLevel ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                        {p.quantity} {p.unit}
                      </span>
                    </div>
                    {inCart && (
                      <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-[#0B192C] font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                        {inCart.quantity}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Payment Method:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'cash', label: 'Cash', icon: Banknote },
                { id: 'transfer', label: 'Transfer', icon: Send },
                { id: 'pos', label: 'POS Card', icon: CreditCard },
                { id: 'credit', label: 'Debt (Credit)', icon: User },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border text-center transition-all ${
                      isSelected
                        ? m.id === 'credit'
                          ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold'
                          : 'border-[#0B192C] bg-[#0B192C] text-[#F5D061] font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span className="text-[11px] whitespace-nowrap">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Credit Warning & Due Date */}
            {paymentMethod === 'credit' && (
              <div className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                <div className="text-xs text-rose-800 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  This sale will be recorded as a customer debt.
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-rose-900 font-medium whitespace-nowrap">
                    Due Date:
                  </label>
                  <input
                    type="date"
                    value={creditDueDate}
                    onChange={(e) => setCreditDueDate(e.target.value)}
                    className="flex-1 bg-white border border-rose-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Pinned Footer with Real Math Totals & Confirm */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 shrink-0 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>
              Items Cost: <span className="font-semibold">{formatNaira(totalCost)}</span>
            </span>
            <span>
              Expected Profit:{' '}
              <span className={`font-bold ${profit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                {formatNaira(profit)}
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Total Amount
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#0B192C] tabular-nums">
                {formatNaira(totalAmount)}
              </div>
            </div>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={handleCompleteSale}
              className={`h-12 px-6 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 ${
                cart.length === 0
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#0B192C] hover:opacity-95 shadow-amber-500/20'
              }`}
            >
              <span>Record Sale</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
