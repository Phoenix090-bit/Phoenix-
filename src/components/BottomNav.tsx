import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  TrendingDown,
  Clock,
  Package,
  Users,
  BarChart3,
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'sales'
  | 'expenses'
  | 'debts'
  | 'inventory'
  | 'customers'
  | 'reports';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  debtsCount?: number;
  lowStockCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  debtsCount = 0,
  lowStockCount = 0,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales', icon: ShoppingCart },
    { id: 'expenses', label: 'Expenses', icon: TrendingDown },
    {
      id: 'debts',
      label: 'Debts',
      icon: Clock,
      badge: debtsCount > 0 ? debtsCount : undefined,
    },
    {
      id: 'inventory',
      label: 'Stock',
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-amber-500',
    },
    { id: 'customers', label: 'CRM', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B192C] border-t border-[#1E3E62] shadow-2xl pb-safe">
      <div className="max-w-3xl mx-auto flex items-center justify-around px-1 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id as TabType)}
              className={`relative flex flex-col items-center justify-center min-h-[52px] min-w-[46px] py-1 px-1 rounded-lg transition-all ${
                isActive
                  ? 'text-[#F5D061] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.3]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full text-[9px] font-bold text-white flex items-center justify-center ${
                      tab.badgeColor || 'bg-rose-500'
                    }`}
                  >
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-[#D4AF37] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
