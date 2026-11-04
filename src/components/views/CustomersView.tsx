import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShoppingCart,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  Edit,
  Trash2,
  DollarSign,
  Tag,
} from 'lucide-react';
import { CustomerWithMetrics } from '../../utils/analytics';
import { CustomerCategory } from '../../types';
import { formatNaira, getWhatsAppLink } from '../../utils/formatters';

interface CustomersViewProps {
  customers: CustomerWithMetrics[];
  onOpenAddCustomer: () => void;
  onSelectCustomer: (customer: CustomerWithMetrics) => void;
  onEditCustomer: (customer: CustomerWithMetrics) => void;
  onDeleteCustomer: (id: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onOpenAddCustomer,
  onSelectCustomer,
  onEditCustomer,
  onDeleteCustomer,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Customers' },
    { id: 'wholesale', label: 'Wholesale' },
    { id: 'regular', label: 'Regular' },
    { id: 'vip', label: 'VIP' },
    { id: 'credit', label: 'Credit Trust' },
  ];

  // Totals
  const totalVolume = customers.reduce((sum, c) => sum + c.totalSpend, 0);
  const activeDebtorsCount = customers.filter((c) => c.activeDebt > 0).length;

  const filtered = customers.filter((c) => {
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchPhone = c.phone.includes(q);
      const matchAddress = c.address?.toLowerCase().includes(q) || false;
      return matchName || matchPhone || matchAddress;
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-20 max-w-5xl mx-auto">
      {/* Top Banner: CRM Overview */}
      <div className="bg-[#0B192C] text-white p-5 rounded-3xl border border-[#1E3E62] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-[#F5D061] uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Customer Relationship Management (CRM)</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tabular-nums mt-0.5">
            {customers.length} Customers
          </div>
          <div className="text-xs text-slate-300 mt-1">
            Total Customer Purchases:{' '}
            <span className="text-[#F5D061] font-bold">{formatNaira(totalVolume)}</span> ·{' '}
            <span className={activeDebtorsCount > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {activeDebtorsCount} with pending debts
            </span>
          </div>
        </div>

        <button
          onClick={onOpenAddCustomer}
          className="h-12 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#0B192C] font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-transform shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search customer by name, phone number, or market stall..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat.id
                  ? 'bg-[#0B192C] text-[#F5D061]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs text-slate-400">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No customers found</p>
            <p className="text-xs text-slate-400 mt-0.5">Add a new customer to keep track of their debts and purchase history</p>
          </div>
        ) : (
          filtered.map((c) => {
            const whatsappUrl = getWhatsAppLink(c.phone, `Hello ${c.name}, greeting from Phoenix PocketBiz!`);
            const initials = c.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('');

            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Customer Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0B192C] to-[#1E3E62] text-[#F5D061] flex items-center justify-center font-bold text-sm shrink-0 border border-[#D4AF37]/30">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{c.name}</h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase bg-slate-100 text-slate-700">
                            {c.category}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-[#D4AF37]" />
                          <span>{c.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`tel:${c.phone}`}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Address / stall */}
                  {c.address && (
                    <div className="text-xs text-slate-600 mt-2 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{c.address}</span>
                    </div>
                  )}

                  {/* Financial Stats strip */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center mt-3">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Total Spend</div>
                      <div className="text-xs font-black text-[#0B192C] tabular-nums mt-0.5">
                        {formatNaira(c.totalSpend)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Orders</div>
                      <div className="text-xs font-bold text-slate-700 tabular-nums mt-0.5">
                        {c.ordersCount} sales
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Debt Balance</div>
                      <div
                        className={`text-xs font-black tabular-nums mt-0.5 ${
                          c.activeDebt > 0 ? 'text-rose-600' : 'text-emerald-700'
                        }`}
                      >
                        {c.activeDebt > 0 ? formatNaira(c.activeDebt) : '₦0 (Clean)'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer action buttons */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onSelectCustomer(c)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-[#0B192C] hover:text-[#F5D061] text-slate-800 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>View Profile & History</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditCustomer(c)}
                      className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                      title="Edit Customer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete customer profile for ${c.name}?`)) {
                          onDeleteCustomer(c.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete Customer"
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
