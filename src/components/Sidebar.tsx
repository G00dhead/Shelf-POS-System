import React from 'react';
import {
  LayoutGrid,
  Activity,
  Bell,
  ShoppingBag,
  Package,
  Tag,
  Users,
  Star,
  BarChart3,
  CreditCard,
  Receipt,
  Store,
  Settings,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../types';

interface NavItem {
  id: ScreenId;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    orders,
    products,
    setMobileMenuOpen
  } = useApp();

  const lowStockCount = products.filter(p => p.stock <= 15).length;
  const heldOrdersCount = orders.filter(o => o.status === 'held').length;

  const NAV_GROUPS: NavGroup[] = [
    {
      label: 'COMMAND',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutGrid },
        { id: 'live-monitor', label: 'Live Monitor', icon: Activity },
        { id: 'alerts', label: 'Alerts', icon: Bell, badge: lowStockCount > 0 ? lowStockCount : undefined }
      ]
    },
    {
      label: 'COMMERCE',
      items: [
        { id: 'orders', label: 'Order Queue', icon: ShoppingBag, badge: heldOrdersCount > 0 ? heldOrdersCount : undefined },
        { id: 'catalog', label: 'Catalog', icon: Package },
        { id: 'pricing', label: 'Pricing Engine', icon: Tag },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'reviews', label: 'Reviews', icon: Star }
      ]
    },
    {
      label: 'FINANCE',
      items: [
        { id: 'revenue', label: 'Revenue Desk', icon: BarChart3 },
        { id: 'payouts', label: 'Payouts', icon: CreditCard },
        { id: 'tax', label: 'Tax Engine', icon: Receipt }
      ]
    },
    {
      label: 'PLATFORM',
      items: [
        { id: 'marketplace', label: 'Marketplace', icon: Store },
        { id: 'pos', label: 'POS', icon: Tag },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  const handleSelectScreen = (id: ScreenId) => {
    setCurrentScreen(id);
    setMobileMenuOpen(false);
  };

  return (
    <aside
      id="app-sidebar"
      className="w-[260px] h-full bg-white border-r border-zinc-200 flex flex-col justify-between select-none shrink-0"
    >
      {/* Top section */}
      <div className="flex flex-col flex-1 overflow-y-auto px-4 py-5">
        {/* Brand header */}
        <div className="flex items-center justify-between mb-5">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => handleSelectScreen('pos')}
          >
            <div className="w-8 h-8 rounded-lg bg-[#6D5AE6] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              C
            </div>
            <div>
              <div className="font-semibold text-zinc-900 text-sm tracking-tight leading-none group-hover:text-[#6D5AE6] transition-colors">
                Confidency OS
              </div>
              <div className="text-[11px] text-zinc-400 font-normal leading-tight mt-0.5">
                Business Operations Platform
              </div>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            id="sidebar-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1 text-zinc-400 hover:text-zinc-600 rounded-md"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="space-y-1">
              <div className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase px-2 mb-1.5">
                {group.label}
              </div>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        id={`nav-item-${item.id}`}
                        onClick={() => handleSelectScreen(item.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-[#6D5AE6] text-white shadow-xs'
                            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-white' : 'text-zinc-400'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Cashier / Manager User Card */}
      <div className="p-3 border-t border-zinc-200 bg-white">
        <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                alt="Jhon Doe"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-zinc-900 truncate group-hover:text-[#6D5AE6] transition-colors leading-tight">
                Jhon Doe
              </div>
              <div className="text-[10px] text-zinc-400 truncate leading-tight mt-0.5">
                john.example@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
