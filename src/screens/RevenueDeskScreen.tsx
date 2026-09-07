import React, { useState } from 'react';
import { DollarSign, TrendingUp, BarChart3, CreditCard, Banknote, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEFAULT_PRODUCT_IMAGE } from '../mockData';

export const RevenueDeskScreen: React.FC = () => {
  const { orders, products } = useApp();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const completedOrders = orders.filter((o) => o.status === 'completed');
  const liveRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

  // Revenue metrics depending on timeframe
  const metrics = {
    daily: { revenue: liveRevenue, orders: completedOrders.length, avg: liveRevenue / (completedOrders.length || 1), growth: '+12.4%' },
    weekly: { revenue: 14820.50 + liveRevenue, orders: 184 + completedOrders.length, avg: 80.50, growth: '+18.2%' },
    monthly: { revenue: 62450.00 + liveRevenue, orders: 742 + completedOrders.length, avg: 84.15, growth: '+23.8%' }
  }[period];

  // Top selling products computation
  const topProducts = [
    { product: products[0], unitsSold: 42, revenue: 2604.00, share: '24%' }, // Everyday Backpack
    { product: products[1], unitsSold: 18, revenue: 2322.00, share: '21%' }, // Chelsea Boots
    { product: products[3], unitsSold: 24, revenue: 2136.00, share: '19%' }, // Running Sneakers
    { product: products[2], unitsSold: 38, revenue: 1216.00, share: '11%' }, // Canvas Tote Bag
    { product: products[6], unitsSold: 12, revenue: 1152.00, share: '10%' }  // Denim Jacket
  ];

  // Chart data based on selected period
  const chartBars = period === 'daily'
    ? [
        { label: '8 AM', value: 340 },
        { label: '10 AM', value: 890 },
        { label: '12 PM', value: 1420 },
        { label: '2 PM', value: 980 },
        { label: '4 PM', value: 1200 },
        { label: '6 PM', value: 650 }
      ]
    : period === 'weekly'
    ? [
        { label: 'Mon', value: 1840 },
        { label: 'Tue', value: 2120 },
        { label: 'Wed', value: 1950 },
        { label: 'Thu', value: 2450 },
        { label: 'Fri', value: 3100 },
        { label: 'Sat', value: 3850 },
        { label: 'Sun', value: 2900 }
      ]
    : [
        { label: 'Week 1', value: 14200 },
        { label: 'Week 2', value: 15800 },
        { label: 'Week 3', value: 16900 },
        { label: 'Week 4', value: 18200 }
      ];

  const maxBarValue = Math.max(...chartBars.map((b) => b.value));

  return (
    <div id="revenue-desk-screen" className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
      {/* Header with Period Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Revenue Desk</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Store performance metrics, financial gross yields, and volume velocity
          </p>
        </div>

        {/* Period Selector Pills */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200/80">
          {(['daily', 'weekly', 'monthly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                period === p
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Total Net Revenue</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-zinc-900">
              ${metrics.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600">{metrics.growth}</span>
          </div>
          <p className="text-[11px] text-zinc-400">Total processed revenue</p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Sales Volume</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-zinc-900">
              {metrics.orders}
            </span>
            <span className="text-[11px] font-medium text-zinc-500">Tickets</span>
          </div>
          <p className="text-[11px] text-zinc-400">Successful checkout transactions</p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Average Order Value</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-zinc-900">
              ${metrics.avg.toFixed(2)}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600">+8.5%</span>
          </div>
          <p className="text-[11px] text-zinc-400">Per basket customer spend</p>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="p-5 rounded-xl border border-zinc-200 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Sales Volume Distribution</h3>
            <p className="text-xs text-zinc-400">Period revenue volume bars (${period})</p>
          </div>
          <div className="text-xs font-medium text-zinc-500 font-mono">
            Peak: ${maxBarValue.toLocaleString()}
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-6 pb-2 flex items-end justify-between gap-3 h-48 border-b border-zinc-100 px-2">
          {chartBars.map((bar, idx) => {
            const heightPercent = Math.max(12, (bar.value / maxBarValue) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-[10px] font-mono text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  ${bar.value.toLocaleString()}
                </div>
                <div className="w-full max-w-[48px] bg-zinc-100 rounded-t-lg overflow-hidden flex items-end h-32">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-[#6D5AE6] hover:bg-[#5E4BD4] transition-all rounded-t-lg"
                  />
                </div>
                <span className="text-[11px] text-zinc-500 font-medium">
                  {bar.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Selling Products Ranking */}
      <div className="p-5 rounded-xl border border-zinc-200 bg-white space-y-4">
        <h3 className="text-sm font-bold text-zinc-900">Top Selling Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">Units Sold</th>
                <th className="py-2.5 px-3">Gross Revenue</th>
                <th className="py-2.5 px-3 text-right">Revenue Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {topProducts.map((item, index) => (
                <tr
                  key={item.product.id}
                  className="even:bg-zinc-50/70 odd:bg-white hover:bg-zinc-100/80 transition-colors"
                >
                  <td className="py-3 px-3 font-mono font-bold text-zinc-400">
                    0{index + 1}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.image || DEFAULT_PRODUCT_IMAGE}
                        alt={item.product.name}
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                        }}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-lg object-cover border border-zinc-200"
                      />
                      <div>
                        <div className="font-semibold text-zinc-900">{item.product.name}</div>
                        <div className="text-[11px] text-zinc-400">{item.product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-zinc-800">
                    {item.unitsSold} units
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-zinc-900">
                    ${item.revenue.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full bg-[#6D5AE6]/10 text-[#6D5AE6] font-bold text-[10px]">
                      {item.share}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
