import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  Edit,
  Trash2,
  TrendingUp,
  Tag,
  ArrowUpRight,
} from 'lucide-react';
import { Product } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface InventoryViewProps {
  products: Product[];
  onOpenAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAdjustStock: (id: string, delta: number) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onOpenAddProduct,
  onEditProduct,
  onDeleteProduct,
  onAdjustStock,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  // Calculations
  const totalCostValue = products.reduce((acc, p) => acc + p.costPrice * p.quantity, 0);
  const totalSalesValue = products.reduce((acc, p) => acc + p.sellingPrice * p.quantity, 0);
  const potentialProfit = totalSalesValue - totalCostValue;
  const lowStockItems = products.filter((p) => p.quantity <= p.minStockLevel);

  // Filter
  const filteredProducts = products.filter((p) => {
    if (filterLowStockOnly && p.quantity > p.minStockLevel) return false;
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-20 max-w-5xl mx-auto">
      {/* Top Banner: Inventory Valuation */}
      <div className="bg-[#0B192C] text-white p-5 rounded-3xl border border-[#1E3E62] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-[#F5D061] uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" />
            <span>Total Stock Valuation</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tabular-nums mt-0.5">
            {formatNaira(totalSalesValue)}
          </div>
          <div className="text-xs text-slate-300 mt-1">
            Cost Value: <span className="font-semibold">{formatNaira(totalCostValue)}</span> ·
            Potential Profit:{' '}
            <span className="text-emerald-400 font-bold">{formatNaira(potentialProfit)}</span>
          </div>
        </div>

        <button
          onClick={onOpenAddProduct}
          className="h-12 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#0B192C] font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-transform shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Low Stock Banner Warning */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-950">
                {lowStockItems.length} Products Running Low on Stock
              </div>
              <div className="text-[11px] text-amber-800">
                Replenish soon to avoid losing sales to other shops
              </div>
            </div>
          </div>

          <button
            onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              filterLowStockOnly
                ? 'bg-[#0B192C] text-[#F5D061]'
                : 'bg-white text-slate-800 border border-amber-300 hover:bg-amber-100'
            }`}
          >
            {filterLowStockOnly ? 'Show All Products' : 'View Low Stock'}
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search product inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>

        {/* Category horizontal scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all capitalize ${
                selectedCategory === c
                  ? 'bg-[#0B192C] text-[#F5D061]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs text-slate-400">
            <Package className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No products found</p>
            <p className="text-xs text-slate-400 mt-0.5">Try searching for another item or add new stock</p>
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isLow = p.quantity <= p.minStockLevel;
            const profit = p.sellingPrice - p.costPrice;
            const margin = ((profit / p.sellingPrice) * 100).toFixed(0);

            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl border p-4 shadow-xs space-y-3 transition-all ${
                  isLow ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      {p.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 truncate">{p.name}</h4>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md shrink-0 ${
                      isLow ? 'bg-rose-100 text-rose-700 font-extrabold' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {p.quantity} {p.unit}
                    {isLow && ' (LOW)'}
                  </span>
                </div>

                {/* Price and Margin */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Cost</div>
                    <div className="text-xs font-semibold text-slate-700 tabular-nums">
                      {formatNaira(p.costPrice)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Selling</div>
                    <div className="text-xs font-black text-[#0B192C] tabular-nums">
                      {formatNaira(p.sellingPrice)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Profit</div>
                    <div className="text-xs font-bold text-emerald-700 tabular-nums">
                      +{formatNaira(profit)} ({margin}%)
                    </div>
                  </div>
                </div>

                {/* Quick Stock Adjustment Bar (1-tap quick buttons for fast restocking) */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">
                      Quick Stock:
                    </span>
                    <button
                      onClick={() => onAdjustStock(p.id, -1)}
                      disabled={p.quantity <= 0}
                      className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold disabled:opacity-40"
                      title="Sell 1"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => onAdjustStock(p.id, 1)}
                      className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                      title="Add 1"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => onAdjustStock(p.id, 5)}
                      className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                      title="Add 5"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => onAdjustStock(p.id, 10)}
                      className="px-2 py-1 rounded-md bg-[#0B192C] text-[#F5D061] text-xs font-bold hover:bg-[#1E3E62]"
                      title="Add 10"
                    >
                      +10
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditProduct(p)}
                      className="p-1.5 text-slate-500 hover:text-[#0B192C] hover:bg-slate-100 rounded-lg"
                      title="Edit Product"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${p.name} from inventory?`)) {
                          onDeleteProduct(p.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
