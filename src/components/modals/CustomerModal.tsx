import React, { useState, useEffect } from 'react';
import { X, UserPlus, Phone, Mail, MapPin, Tag, FileText } from 'lucide-react';
import { Customer, CustomerCategory } from '../../types';

interface CustomerModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomer: (customerData: Omit<Customer, 'id' | 'createdAt'>, id?: string) => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  customer,
  isOpen,
  onClose,
  onSaveCustomer,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<CustomerCategory>('regular');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setPhone(customer.phone);
      setEmail(customer.email || '');
      setAddress(customer.address || '');
      setCategory(customer.category);
      setNotes(customer.notes || '');
    } else {
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setCategory('regular');
      setNotes('');
    }
  }, [customer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    onSaveCustomer(
      {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        category,
        notes: notes.trim() || undefined,
      },
      customer ? customer.id : undefined
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-[#0B192C] text-white px-5 py-4 flex items-center justify-between border-b border-[#1E3E62] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center text-[#0B192C]">
              <UserPlus className="w-4 h-4 font-bold" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {customer ? 'Edit Customer' : 'Add New Customer'}
              </h2>
              <p className="text-xs text-slate-300">Customer directory & CRM profile</p>
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
          {/* Full Name */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Customer Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alhaji Musa Ibrahim / Mama Chinedu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#D4AF37]" />
              Phone Number (WhatsApp) *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 0803 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" />
              Email Address (Optional)
            </label>
            <input
              type="email"
              placeholder="customer@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#D4AF37]"
            />
          </div>

          {/* Address / Market Stall */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              Shop / Home Address / Market Stall
            </label>
            <input
              type="text"
              placeholder="e.g. Stall 14 Foodstuff line, Tejuosho Market / Sabo Yaba"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#D4AF37]"
            />
          </div>

          {/* Customer Group / Category */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" />
              Customer Type:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'regular', label: 'Regular' },
                { id: 'wholesale', label: 'Wholesale' },
                { id: 'vip', label: 'VIP' },
                { id: 'credit', label: 'Credit Trust' },
              ].map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as CustomerCategory)}
                    className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                      isSelected
                        ? 'border-[#0B192C] bg-[#0B192C] text-[#F5D061]'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-400" />
              Customer Preferences & Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Buys cartons of spaghetti every Friday, pays by OPay transfer"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#D4AF37]"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:opacity-95 text-[#0B192C] rounded-xl font-bold text-sm shadow-md active:scale-98 transition-transform mt-2"
          >
            {customer ? 'Update Customer Profile' : 'Save Customer Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};
