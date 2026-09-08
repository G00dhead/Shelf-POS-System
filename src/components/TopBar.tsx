import React, { useState, useEffect } from 'react';
import {
  Menu,
  ShoppingBag,
  Clock,
  Banknote,
  User,
  RotateCw,
  LogOut,
  ChevronRight,
  Store,
  Wifi,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatMoney } from '../utils/format';

export const TopBar: React.FC = () => {
  const {
    currentScreen,
    settings,
    drawerAmount,
    setIsEndShiftOpen,
    setMobileMenuOpen,
    setMobileCartOpen,
    cart,
    sidebarCollapsed,
    toggleSidebar
  } = useApp();

  const [livePulse, setLivePulse] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');

  // 1s live clock & 2s auto-refresh pulse
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };

    updateTime();
    const clockTimer = setInterval(updateTime, 1000);
    const pulseTimer = setInterval(() => {
      setLivePulse((prev) => !prev);
    }, 2000);

    return () => {
      clearInterval(clockTimer);
      clearInterval(pulseTimer);
    };
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatScreenTitle = (screen: string) => {
    switch (screen) {
      case 'pos':
        return 'POS Register';
      case 'overview':
        return 'Store Overview';
      case 'orders':
        return 'Order Queue';
      case 'catalog':
        return 'Product Catalog';
      case 'pricing':
        return 'Pricing Engine';
      case 'customers':
        return 'Shoppers';
      case 'reviews':
        return 'Customer Reviews';
      case 'revenue':
        return 'Revenue Desk';
      case 'payouts':
        return 'Bank Payouts';
      case 'tax':
        return 'FIRS VAT Engine';
      case 'marketplace':
        return 'Integrations';
      case 'settings':
        return 'Admin Settings';
      case 'live-monitor':
        return 'Live Scanner Monitor';
      case 'alerts':
        return 'Stock Alerts';
      default:
        return screen.toUpperCase();
    }
  };

  return (
    <header
      id="app-topbar"
      className="bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-6 py-2.5 min-h-[58px] flex flex-col justify-center shrink-0 z-20"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Screen breadcrumb */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Mobile menu trigger */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1.5 -ml-1 text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 cursor-pointer transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop sidebar toggle button */}
          <button
            id="desktop-topbar-sidebar-toggle-btn"
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center p-1.5 -ml-1 text-zinc-400 hover:text-zinc-800 rounded-lg hover:bg-zinc-100 cursor-pointer transition-colors"
            title={sidebarCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
            aria-label="Toggle sidebar collapse state"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-[#6D5AE6]" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {/* Breadcrumb Context */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live Terminal Signal */}
            <div className="relative flex items-center justify-center w-2.5 h-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </div>

            <div className="flex items-center gap-1.5 text-xs shrink-0">
              <div className="hidden 2xl:flex items-center gap-1 text-zinc-500 bg-zinc-100/90 px-2 py-0.5 rounded-md text-[11px] font-medium border border-zinc-200/50 shrink-0">
                <Store className="w-3 h-3 text-zinc-400" />
                <span className="truncate max-w-[130px]">{settings.storeName}</span>
              </div>

              <ChevronRight className="w-3.5 h-3.5 text-zinc-300 hidden 2xl:inline shrink-0" />

              <h1 className="text-sm font-bold text-zinc-900 tracking-tight whitespace-nowrap shrink-0">
                {formatScreenTitle(currentScreen)}
              </h1>
            </div>
          </div>
        </div>

        {/* Center: Register Status Badges (Shown when space permits on wide screens) */}
        <div className="hidden 2xl:flex items-center gap-2.5 text-xs shrink-0">
          {/* Cashier Chip */}
          <div className="flex items-center gap-1.5 bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/80 rounded-lg px-2.5 py-1 text-zinc-700 transition-colors">
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400 font-normal">Cashier:</span>
            <span className="font-semibold text-zinc-900">{settings.cashierName}</span>
          </div>

          {/* Shift & Clock */}
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200/80 rounded-lg px-2.5 py-1 text-zinc-600 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-zinc-500 font-sans">Shift {settings.shiftStartTime}</span>
            <span className="text-zinc-300 font-sans">•</span>
            <span className="font-semibold text-zinc-800">{currentTime || '--:--:--'}</span>
          </div>

          {/* Drawer Float Badge */}
          <div className="flex items-center gap-1.5 bg-emerald-50/70 border border-emerald-200/80 rounded-lg px-2.5 py-1 text-emerald-900">
            <Banknote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-emerald-700/80 text-[11px] font-medium font-sans">Float:</span>
            <span className="font-mono font-bold text-xs">
              {formatMoney(drawerAmount, settings.currency)}
            </span>
          </div>
        </div>

        {/* Right: Cloud Sync, End Shift & Mobile Cart */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Cloud Sync Status Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-50 border border-zinc-200/70 text-[11px] text-zinc-500 font-medium">
            <Wifi className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="hidden xl:inline">Live POS Sync</span>
            <RotateCw
              className={`w-3 h-3 text-emerald-600 transition-transform duration-700 ${
                livePulse ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </div>

          {/* End Shift Button */}
          <button
            id="end-shift-topbar-btn"
            onClick={() => setIsEndShiftOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-red-700 bg-zinc-50 hover:bg-red-50/80 rounded-lg border border-zinc-200 hover:border-red-200/80 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            title="End shift and reconcile register cash drawer"
          >
            <LogOut className="w-3.5 h-3.5 text-zinc-500 group-hover:text-red-600" />
            <span>End Shift</span>
          </button>

          {/* Mobile Cart Trigger */}
          <button
            id="mobile-cart-toggle-btn"
            onClick={() => setMobileCartOpen(true)}
            className="lg:hidden relative p-2 text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg cursor-pointer transition-colors"
            aria-label="View cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#6D5AE6] text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Sub-bar for cashier and register drawer context */}
      <div className="xl:hidden flex items-center justify-between text-xs text-zinc-500 mt-2 pt-2 border-t border-zinc-100">
        <div className="flex items-center gap-2 text-[11px] truncate">
          <span className="font-semibold text-zinc-800 truncate">{settings.cashierName}</span>
          <span className="text-zinc-300">•</span>
          <span className="text-zinc-500 whitespace-nowrap">Shift {settings.shiftStartTime}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50/80 border border-emerald-200/70 rounded-md px-2 py-0.5 text-[11px] font-mono text-emerald-900 shrink-0">
          <span className="text-emerald-700/80 font-sans text-[10px]">Float:</span>
          <span className="font-bold">
            {formatMoney(drawerAmount, settings.currency)}
          </span>
        </div>
      </div>
    </header>
  );
};
