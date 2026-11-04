import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign } from 'lucide-react';
import { Product } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => void;
}

const UNITS = ['Carton', 'Bag', 'Pcs', 'Pack', 'Bottle', 'Gallon', 'Roll', 'Tin', 'Kg'];
const POPULAR_CATEGORIES = [
  'Foodstuff',
  'Beverages',
  'Grains & Sugar',
  'Drinks & Water',
  'Oils & Spices',
  'Toiletries & Cleaning',
  'Snacks & Confectionery',
  'General Goods',
];

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSaveProduct,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Foodstuff');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [quantity, setQuantity] = useState('10');
  const [minStockLevel, setMinStockLevel] = useState('5');
  const [unit, setUnit] = useState('Carton');

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setCostPrice(product.costPrice.toString());
      setSellingPrice(product.sellingPrice.toString());
      setQuantity(product.quantity.toString());
      setMinStockLevel(product.minStockLevel.toString());
      setUnit(product.unit);
    } else {
      setName('');
      setCategory('Foodstuff');
      setCostPrice('');
      setSellingPrice('');
      setQuantity('10');
      setMinStockLevel('5');
      setUnit('Carton');
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const cost = parseFloat(costPrice) || 0;
  const selling = parseFloat(sellingPrice) || 0;
  const profitPerUnit = selling - cost;
  const marginPercent = selling > 0 ? ((profitPerUnit / selling) * 100).toFixed(1) : '0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selling <= 0) return;

    onSaveProduct(
      {
        name: name.trim(),
        category,
        costPrice: cost,
        sellingPrice: selling,
        quantity: parseInt(quantity, 10) || 0,
        minStockLevel: parseInt(minStockLevel, 10) || 3,
        unit,
      },
      product ? product.id : undefined
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-[#0B192C] text-white px-5 py-4 flex items-center justify-between border-b border-[#1E3E62] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center text-[#0B192C]">
              <Package className="w-4 h-4 font-bold" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {product ? 'Edit Product Stock' : 'Add New Product'}
              </h2>
              <p className="text-xs text-slate-300">Inventory item, cost and selling pricing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto max-h-[80vh]">
          {/* Name */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dangote Sugar (50kg Bag)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          {/* Category & Unit */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden"
              >
                {POPULAR_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Unit of Measure
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cost Price & Selling Price */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Cost Price (₦)
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="0"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Selling Price (₦) *
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="0"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {/* Profit Preview */}
          {selling > 0 && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
              <span className="text-slate-600">Expected Profit per unit:</span>
              <div className="text-right">
                <span className={`font-bold tabular-nums ${profitPerUnit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {formatNaira(profitPerUnit)} ({marginPercent}%)
                </span>
              </div>
            </div>
          )}

          {/* Stock Quantity & Alert Level */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Current Stock Count
              </label>
              <input
                type="number"
                required
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Low Stock Warning Level
              </label>
              <input
                type="number"
                required
                min="1"
                value={minStockLevel}
                onChange={(e) => setMinStockLevel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-[#0B192C] hover:bg-[#1E3E62] text-[#F5D061] rounded-xl font-bold text-sm shadow-md active:scale-98 transition-transform mt-2"
          >
            {product ? 'Update Stock Item' : 'Add Product to Stock'}
          </button>
        </form>
      </div>
    </div>
  );
};
