import React, { useState } from 'react';
import {
  Banknote,
  ShoppingBag,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Receipt,
  Eye,
  Check,
  Package,
  Boxes,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatMoney } from '../utils/format';
import { DEFAULT_PRODUCT_IMAGE } from '../mockData';

export const OverviewScreen: React.FC = () => {
  const { orders, products, setProducts, setCurrentScreen, setSelectedOrderForModal, settings, drawerAmount, stockAlerts } =
    useApp();
  const [activeChartPoint, setActiveChartPoint] = useState<number | null>(null);
  const [velocityPeriod, setVelocityPeriod] = useState<'today' | '7days'>('today');
  const [reorderedIds, setReorderedIds] = useState<Record<string, boolean>>({});

  const completedOrders = orders.filter((o) => o.status === 'completed');
  const todayRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const transactionCount = completedOrders.length;
  const avgBasket = transactionCount > 0 ? todayRevenue / transactionCount : 0;
  
  // Sorted items with active alerts or lowest stock for reorder queue
  const lowStockItems = stockAlerts.length > 0
    ? stockAlerts.slice(0, 4).map(alert => products.find(p => p.id === alert.productId)!).filter(Boolean)
    : [...products].sort((a, b) => a.stock - b.stock).slice(0, 4);

  // Hourly velocity bar data (Nigeria Naira) matching Image 2
  const TODAY_VELOCITY = [
    { label: '8 AM', amount: 24000, orders: 2, height: 16 },
    { label: '9 AM', amount: 48000, orders: 4, height: 38 },
    { label: '10 AM', amount: 82000, orders: 7, height: 60 },
    { label: '11 AM', amount: 115000, orders: 9, height: 82 },
    { label: '12 PM', amount: 145000, orders: 12, height: 98 },
    { label: '1 PM', amount: 142000, orders: 11, height: 96 },
    { label: '2 PM', amount: 89000, orders: 7, height: 64 },
    {
      label: '3 PM',
      amount: todayRevenue > 100000 ? todayRevenue : 110000,
      orders: transactionCount || 8,
      height: 78
    }
  ];

  const SEVEN_DAYS_VELOCITY = [
    { label: 'Mon', amount: 320000, orders: 28, height: 50 },
    { label: 'Tue', amount: 410000, orders: 35, height: 65 },
    { label: 'Wed', amount: 380000, orders: 31, height: 60 },
    { label: 'Thu', amount: 490000, orders: 42, height: 78 },
    { label: 'Fri', amount: 620000, orders: 54, height: 95 },
    { label: 'Sat', amount: 680000, orders: 60, height: 100 },
    { label: 'Sun', amount: 510000, orders: 46, height: 82 }
  ];

  const currentVelocityData = velocityPeriod === 'today' ? TODAY_VELOCITY : SEVEN_DAYS_VELOCITY;

  const handleReorder = (productId: string) => {
    setReorderedIds(prev => ({ ...prev, [productId]: true }));
    // Increment stock in context
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, stock: p.stock + 24 } : p))
    );
    setTimeout(() => {
      setReorderedIds(prev => ({ ...prev, [productId]: false }));
    }, 2500);
  };

  return (
    <div id="overview-screen" className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Revenue */}
        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Today's Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#6D5AE6]/10 text-[#6D5AE6] flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold font-mono text-zinc-900">
              {formatMoney(todayRevenue, settings.currency)}
            </h2>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +14.8%
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            From {transactionCount} completed orders today
          </p>
        </div>

        {/* Transaction Count */}
        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Transactions
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold font-mono text-zinc-900">{transactionCount}</h2>
            <span className="text-[11px] font-medium text-zinc-500">Terminal #01</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Avg basket: {formatMoney(avgBasket, settings.currency)}
          </p>
        </div>

        {/* Low Stock Alert Count */}
        <div
          onClick={() => setCurrentScreen('alerts')}
          className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2 cursor-pointer hover:border-amber-400 transition-colors group"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Low Stock Warnings
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold font-mono text-zinc-900">
              {stockAlerts.length}
            </h2>
            <span className="text-[11px] font-medium text-amber-600 group-hover:underline inline-flex items-center gap-1">
              <span>View Alerts</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            {stockAlerts.length > 0 ? `${stockAlerts.length} products below reorder point` : 'All items above reorder thresholds'}
          </p>
        </div>

        {/* Shift Drawer Amount */}
        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Shift Drawer Float
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold font-mono text-zinc-900">
              {formatMoney(drawerAmount, settings.currency)}
            </h2>
            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active Shift
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Opening float: {formatMoney(settings.startingDrawerFloat, settings.currency)}
          </p>
        </div>
      </div>

      {/* Revenue Hourly Velocity Chart & Stock Reorder Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue Hourly Velocity Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-zinc-200 bg-white flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Revenue Hourly Velocity</h3>
              <p className="text-xs text-zinc-400">Real-time point-of-sale sales volume</p>
            </div>
            
            {/* Today / 7 Days Toggle */}
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/70">
              <button
                type="button"
                onClick={() => setVelocityPeriod('today')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  velocityPeriod === 'today'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setVelocityPeriod('7days')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  velocityPeriod === '7days'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                7 Days
              </button>
            </div>
          </div>

          {/* Bar Chart Canvas Area */}
          <div className="relative pt-6 pb-2">
            {/* Active Tooltip */}
            {activeChartPoint !== null && currentVelocityData[activeChartPoint] && (
              <div className="absolute top-0 right-4 bg-zinc-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-md pointer-events-none z-10 flex items-center gap-1.5">
                <span className="text-zinc-300 font-medium">
                  {currentVelocityData[activeChartPoint].label}:
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatMoney(currentVelocityData[activeChartPoint].amount, settings.currency)}
                </span>
                <span className="text-zinc-400 text-[10px]">
                  ({currentVelocityData[activeChartPoint].orders} tickets)
                </span>
              </div>
            )}

            {/* Vertical Bars */}
            <div className="flex items-end justify-between gap-2.5 sm:gap-4 h-44 px-2 border-b border-zinc-100">
              {currentVelocityData.map((bar, idx) => {
                const isHovered = activeChartPoint === idx;
                return (
                  <div
                    key={bar.label}
                    onMouseEnter={() => setActiveChartPoint(idx)}
                    onMouseLeave={() => setActiveChartPoint(null)}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  >
                    <div className="w-full max-w-[38px] flex flex-col justify-end h-full">
                      <div
                        style={{ height: `${bar.height}%` }}
                        className={`w-full rounded-t-lg rounded-b-xs transition-all duration-300 ${
                          isHovered
                            ? 'bg-[#6D5AE6] shadow-sm'
                            : 'bg-[#6D5AE6]/20 group-hover:bg-[#6D5AE6]/35'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-Axis Labels */}
            <div className="flex items-center justify-between gap-2.5 sm:gap-4 px-2 pt-2.5">
              {currentVelocityData.map((bar, idx) => (
                <div
                  key={bar.label}
                  className={`flex-1 text-center text-[11px] font-medium transition-colors ${
                    activeChartPoint === idx ? 'text-zinc-900 font-bold' : 'text-zinc-400'
                  }`}
                >
                  {bar.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Stock Reorder Queue */}
        <div className="p-5 rounded-xl border border-zinc-200 bg-white flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900">Stock Reorder Queue</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentScreen('alerts')}
                className="text-xs font-semibold text-amber-600 hover:underline cursor-pointer"
              >
                Alerts Center
              </button>
              <span className="text-zinc-300">•</span>
              <button
                onClick={() => setCurrentScreen('catalog')}
                className="text-xs font-semibold text-[#6D5AE6] hover:underline cursor-pointer"
              >
                Catalog
              </button>
            </div>
          </div>

          {/* List of low stock items ready for reorder */}
          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[220px] pr-1">
            {lowStockItems.length === 0 ? (
              <div className="text-center py-6 text-zinc-400 text-xs">
                <Package className="w-6 h-6 mx-auto mb-1 text-zinc-300" />
                All supermarket stock levels healthy
              </div>
            ) : (
              lowStockItems.map((item) => {
                const isReordered = !!reorderedIds[item.id];
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2.5 p-2 rounded-lg border border-zinc-100 bg-zinc-50/70 hover:bg-zinc-100/60 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.image || DEFAULT_PRODUCT_IMAGE}
                        alt={item.name}
                        className="w-9 h-9 rounded-md object-cover bg-white border border-zinc-200/80 shrink-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = DEFAULT_PRODUCT_IMAGE;
                        }}
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-zinc-900 truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono">
                          <span>{item.sku}</span>
                          <span>•</span>
                          <span className="font-bold text-amber-600 font-sans">
                            {item.stock} left
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleReorder(item.id)}
                      disabled={isReordered}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                        isReordered
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 shadow-2xs'
                      }`}
                    >
                      {isReordered ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Queued</span>
                        </>
                      ) : (
                        <span>+24 Units</span>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Automated Replenishment Banner Matching Image 2 */}
          <div className="p-3 bg-[#6D5AE6]/5 border border-[#6D5AE6]/20 rounded-xl text-xs flex items-center gap-2 mt-auto">
            <div className="w-2 h-2 rounded-full bg-[#6D5AE6] animate-pulse shrink-0" />
            <p className="text-zinc-600 text-[11px] leading-tight">
              <strong className="text-zinc-900 font-semibold">Automated Replenishment:</strong>{' '}
              Purchase order drafts ready for supplier dispatch.
            </p>
          </div>
        </div>
      </div>

      {/* Feed of Recent Transactions */}
      <div className="p-5 rounded-xl border border-zinc-200 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Recent Supermarket Transactions</h3>
            <p className="text-xs text-zinc-400">
              Live receipts registered across checkout registers
            </p>
          </div>
          <button
            onClick={() => setCurrentScreen('orders')}
            className="text-xs font-medium text-[#6D5AE6] hover:underline cursor-pointer inline-flex items-center gap-1"
          >
            <span>View all queue</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* High-density Responsive Data Table (Zero Horizontal Scrolling) */}
        <div className="w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Order & Shopper</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="hidden sm:table-cell py-2.5 px-3">Payment & Items</th>
                <th className="py-2.5 px-3 text-right">Total</th>
                <th className="py-2.5 px-2 text-right w-11 shrink-0">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orders.slice(0, 6).map((order) => {
                const totalItemsCount = order.items.reduce((s, i) => s + i.quantity, 0);
                return (
                  <tr
                    key={order.id}
                    className="even:bg-zinc-50/70 odd:bg-white hover:bg-zinc-100/80 transition-colors"
                  >
                    {/* Primary Identifier & Stacked Metadata */}
                    <td className="py-3 px-3 min-w-0">
                      <div className="font-mono font-bold text-zinc-900 text-xs sm:text-sm">
                        {order.orderNumber}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <span className="font-medium text-zinc-700 truncate max-w-[120px] sm:max-w-none">
                          {order.customerName || 'Walk-in Shopper'}
                        </span>
                        <span className="text-zinc-300">•</span>
                        <span className="font-mono text-zinc-400 text-[10px]">
                          {order.timestamp}
                        </span>
                      </div>
                    </td>

                    {/* Status with Color-coded Dot */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          order.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : order.status === 'held'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            order.status === 'completed'
                              ? 'bg-emerald-500 ring-2 ring-emerald-100'
                              : order.status === 'held'
                              ? 'bg-amber-500 ring-2 ring-amber-100'
                              : 'bg-red-500 ring-2 ring-red-100'
                          }`}
                        />
                        <span className="capitalize">{order.status}</span>
                      </span>
                    </td>

                    {/* Secondary Payment & Items (Tablet/Desktop) */}
                    <td className="hidden sm:table-cell py-3 px-3 text-zinc-500">
                      <div className="flex items-center gap-2">
                        <span className="capitalize px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-100 text-zinc-700">
                          {order.paymentMethod}
                        </span>
                        <span className="font-mono text-zinc-400 text-[11px]">
                          {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                    </td>

                    {/* Right-Aligned Stacked Total */}
                    <td className="py-3 px-3 text-right shrink-0">
                      <div className="font-bold font-mono text-zinc-900 text-xs sm:text-sm">
                        {formatMoney(order.total, settings.currency)}
                      </div>
                      <div className="sm:hidden text-[10px] text-zinc-400 capitalize font-mono mt-0.5">
                        {order.paymentMethod} • {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                      </div>
                    </td>

                    {/* Action with 40px Touch Target */}
                    <td className="py-3 px-2 text-right w-11 shrink-0">
                      <button
                        onClick={() => setSelectedOrderForModal(order)}
                        className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-zinc-400 hover:text-[#6D5AE6] hover:bg-[#6D5AE6]/10 rounded-lg transition-colors cursor-pointer ml-auto"
                        title="View Full Receipt"
                        aria-label="View Full Receipt"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
