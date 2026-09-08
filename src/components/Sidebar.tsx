import React, { useEffect } from 'react';
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
  X,
  PanelLeftClose,
  PanelLeftOpen
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

interface SidebarProps {
  forceExpanded?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ forceExpanded = false }) => {
  const {
    currentScreen,
    setCurrentScreen,
    orders,
    products,
    setMobileMenuOpen,
    sidebarCollapsed,
    toggleSidebar
  } = useApp();

  const isCollapsed = sidebarCollapsed && !forceExpanded;

  const lowStockCount = products.filter(p => p.stock <= 15).length;
  const heldOrdersCount = orders.filter(o => o.status === 'held').length;

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

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
      className={`h-full bg-white border-r border-zinc-200 flex flex-col justify-between select-none shrink-0 transition-[width] duration-200 ease-in-out ${
        isCollapsed ? 'w-[68px]' : 'w-[260px]'
      }`}
    >
      {/* Top section */}
      <div className={`flex flex-col flex-1 overflow-y-auto ${isCollapsed ? 'px-2.5 py-4' : 'px-4 py-5'}`}>
        {/* Brand header */}
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2 mb-4">
            <button
              onClick={() => handleSelectScreen('pos')}
              className="w-9 h-9 rounded-lg bg-[#6D5AE6] flex items-center justify-center text-white font-bold text-sm shadow-xs hover:bg-[#5E4BD4] transition-colors cursor-pointer"
              title="Shelf POS (Switch to POS)"
              aria-label="Shelf POS"
            >
              S
            </button>
            <button
              id="sidebar-expand-btn"
              onClick={toggleSidebar}
              className="p-1.5 text-zinc-400 hover:text-[#6D5AE6] hover:bg-[#6D5AE6]/10 rounded-lg transition-colors cursor-pointer"
              title="Expand sidebar (Ctrl+B)"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-5">
            <div
              className="flex items-center gap-2.5 cursor-pointer group min-w-0"
              onClick={() => handleSelectScreen('pos')}
            >
              <div className="w-8 h-8 rounded-lg bg-[#6D5AE6] flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                S
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-zinc-900 text-sm tracking-tight leading-none group-hover:text-[#6D5AE6] transition-colors truncate">
                  Shelf POS
                </div>
                <div className="text-[11px] text-zinc-400 font-normal leading-tight mt-0.5 truncate">
                  Supermarket & Inventory OS
                </div>
              </div>
            </div>

            <div className="flex items-center gap-0.5 shrink-0">
              {/* Desktop collapse toggle */}
              <button
                id="sidebar-collapse-btn"
                onClick={toggleSidebar}
                className="hidden lg:flex p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                title="Collapse sidebar (Ctrl+B)"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>

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
          </div>
        )}

        {/* Navigation Sections */}
        <nav className="space-y-3">
          {NAV_GROUPS.map((group, groupIdx) => (
            <div key={group.label} className="space-y-1">
              {isCollapsed ? (
                groupIdx > 0 && <div className="w-6 h-px bg-zinc-100 mx-auto my-2" />
              ) : (
                <div className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase px-2 mb-1.5">
                  {group.label}
                </div>
              )}

              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  return (
                    <li key={item.id} className="relative group">
                      <button
                        id={`nav-item-${item.id}`}
                        onClick={() => handleSelectScreen(item.id)}
                        className={`w-full flex items-center ${
                          isCollapsed
                            ? 'justify-center p-2'
                            : 'justify-between px-2.5 py-1.5'
                        } rounded-lg text-xs font-medium transition-colors cursor-pointer relative ${
                          isActive
                            ? 'bg-[#6D5AE6] text-white shadow-xs'
                            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
                        }`}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5 min-w-0'}`}>
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-white' : 'text-zinc-400'
                            }`}
                          />
                          {!isCollapsed && <span className="truncate">{item.label}</span>}
                        </div>

                        {/* Badge */}
                        {item.badge !== undefined && (
                          isCollapsed ? (
                            <span
                              className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"
                              title={`${item.label}: ${item.badge}`}
                            />
                          ) : (
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold shrink-0 ml-1.5 ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )
                        )}
                      </button>

                      {/* Tooltip on hover when collapsed */}
                      {isCollapsed && (
                        <div className="fixed hidden group-hover:flex items-center gap-1.5 ml-14 -mt-8 px-2.5 py-1 bg-zinc-900 text-white text-[11px] font-medium rounded-md shadow-xl whitespace-nowrap z-50 pointer-events-none animate-in fade-in-50 zoom-in-95 duration-100">
                          <span>{item.label}</span>
                          {item.badge !== undefined && (
                            <span className="px-1.5 py-0.2 bg-amber-400 text-zinc-950 font-bold text-[9px] rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
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
        {isCollapsed ? (
          <div className="flex justify-center">
            <div
              className="relative cursor-pointer group"
              title="Active Staff: Goodhead Golly (Head Cashier) - Online"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6D5AE6] to-[#8B7CF8] text-white font-bold text-xs flex items-center justify-center ring-1 ring-zinc-200 shadow-2xs group-hover:ring-[#6D5AE6] transition-all select-none">
                GG
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6D5AE6] to-[#8B7CF8] text-white font-bold text-xs flex items-center justify-center ring-1 ring-zinc-200 shadow-2xs select-none">
                  GG
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-zinc-900 truncate group-hover:text-[#6D5AE6] transition-colors leading-tight">
                  Goodhead Golly
                </div>
                <div className="text-[10px] text-zinc-400 truncate leading-tight mt-0.5">
                  goodheadgolly@gmail.com
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
