import React, { useState, useMemo } from 'react';
import {
  Search,
  ShoppingBag,
  RotateCcw,
  CheckCircle2,
  Clock,
  Play,
  Eye,
  FileText,
  Download,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus, Order } from '../types';
import { formatMoney } from '../utils/format';
import { DEFAULT_PRODUCT_IMAGE } from '../mockData';

export const OrderQueueScreen: React.FC = () => {
  const {
    orders,
    refundOrder,
    resumeOrder,
    setSelectedOrderForModal,
    settings
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');
  const [search, setSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesTab = activeTab === 'all' || o.status === activeTab;
      const matchesSearch =
        search.trim() === '' ||
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        (o.customerName && o.customerName.toLowerCase().includes(search.toLowerCase())) ||
        o.cashier.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, search]);

  const counts = {
    all: orders.length,
    completed: orders.filter((o) => o.status === 'completed').length,
    held: orders.filter((o) => o.status === 'held').length,
    refunded: orders.filter((o) => o.status === 'refunded').length
  };

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) return;

    const headers = [
      'Order ID',
      'Date & Time',
      'Status',
      'Customer Name',
      'Total Items Count',
      'Purchased Items Breakdown',
      'Subtotal (NGN)',
      'VAT Rate (%)',
      'VAT Amount (NGN)',
      'Discount (NGN)',
      'Total Amount (NGN)',
      'Payment Method',
      'Cashier',
      'Notes'
    ];

    const rows = filteredOrders.map((order) => {
      const itemsCount = order.items.reduce((s, i) => s + i.quantity, 0);
      const itemsSummary = order.items
        .map((i) => `${i.productName} (Qty: ${i.quantity}, Unit: ₦${i.unitPrice}, Sub: ₦${i.lineTotal})`)
        .join('; ');

      return [
        order.orderNumber,
        order.timestamp,
        order.status.toUpperCase(),
        order.customerName || 'Walk-in Shopper',
        itemsCount.toString(),
        itemsSummary,
        order.subtotal.toFixed(2),
        `${((order.taxRate ?? 0.075) * 100).toFixed(1)}%`,
        order.tax.toFixed(2),
        order.discount.toFixed(2),
        order.total.toFixed(2),
        order.paymentMethod.toUpperCase(),
        order.cashier,
        order.notes || ''
      ];
    });

    const csvContent =
      '\uFEFF' +
      [
        headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
        ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))
      ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `supermarket_transactions_${activeTab}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2500);
  };

  return (
    <div id="order-queue-screen" className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Supermarket Order Queue</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Monitor, resume held checkout tickets, and process customer thermal receipts or returns
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search order #, customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 focus:bg-white text-zinc-900 placeholder:text-zinc-400 rounded-lg border border-zinc-200 focus:outline-none focus:border-[#6D5AE6] transition-colors"
            />
          </div>

          {/* Export CSV Button */}
          <button
            id="export-orders-csv-btn"
            onClick={handleExportCSV}
            disabled={filteredOrders.length === 0}
            title={
              filteredOrders.length === 0
                ? 'No transactions available to export'
                : `Export ${filteredOrders.length} transaction${filteredOrders.length === 1 ? '' : 's'} as CSV`
            }
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs ${
              isExporting
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 border-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {isExporting ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Exported!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-zinc-500" />
                <span>Export CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-3 overflow-x-auto no-scrollbar">
        {(
          [
            { id: 'all', label: 'All Orders', count: counts.all },
            { id: 'completed', label: 'Completed', count: counts.completed },
            { id: 'held', label: 'Held in Register', count: counts.held },
            { id: 'refunded', label: 'Refunded', count: counts.refunded }
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#6D5AE6] text-white shadow-xs'
                : 'bg-white text-zinc-600 hover:bg-zinc-100/70 border border-zinc-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List / Cards */}
      {filteredOrders.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center text-zinc-400 border border-dashed border-zinc-200 rounded-xl p-8">
          <FileText className="w-8 h-8 text-zinc-300 mb-2" />
          <p className="text-xs font-semibold text-zinc-700">No orders in this view</p>
          <p className="text-[11px] text-zinc-400 mt-1">
            Orders processed from POS will appear here instantly.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const totalItemsCount = order.items.reduce((s, i) => s + i.quantity, 0);

            return (
              <div
                key={order.id}
                id={`order-card-${order.id}`}
                className="bg-white border border-zinc-200 rounded-xl p-4 hover:border-zinc-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-zinc-900">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        order.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : order.status === 'held'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          order.status === 'completed'
                            ? 'bg-emerald-500'
                            : order.status === 'held'
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                      />
                      {order.status.toUpperCase()}
                    </span>

                    <span className="text-xs text-zinc-400">•</span>
                    <span className="text-xs text-zinc-500">{order.timestamp}</span>
                    <span className="text-xs text-zinc-400">•</span>
                    <span className="text-xs text-zinc-600 font-medium">{order.cashier}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-medium">Customer:</span>
                    <span className="text-xs font-semibold text-zinc-800">
                      {order.customerName || 'Walk-in Shopper'}
                    </span>
                  </div>
                </div>

                {/* Items Thumbnails Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-zinc-100">
                  <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-zinc-50 border border-zinc-200/70 rounded-lg p-1.5 pr-2.5 shrink-0"
                      >
                        <img
                          src={item.image || DEFAULT_PRODUCT_IMAGE}
                          alt={item.productName}
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                          }}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded object-cover"
                        />
                        <div className="text-[11px] leading-tight">
                          <p className="font-semibold text-zinc-800 max-w-[140px] truncate">
                            {item.productName}
                          </p>
                          <p className="text-zinc-400 font-mono">
                            {item.quantity} × {formatMoney(item.unitPrice, settings.currency)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Total & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] sm:text-xs text-zinc-400 capitalize">
                        {order.paymentMethod} • {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                      </div>
                      <div className="text-sm sm:text-base font-bold font-mono text-zinc-900 leading-tight">
                        {formatMoney(order.total, settings.currency)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {order.status === 'held' && (
                        <button
                          onClick={() => resumeOrder(order.id)}
                          className="min-h-[38px] px-3.5 py-1.5 text-xs font-semibold text-white bg-[#6D5AE6] hover:bg-[#5E4BD4] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                          title="Resume this sale in POS"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Resume Sale</span>
                        </button>
                      )}

                      {order.status === 'completed' && (
                        <button
                          onClick={() => refundOrder(order.id)}
                          className="min-h-[38px] px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Refund this transaction"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Refund</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedOrderForModal(order)}
                        className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg border border-zinc-200 transition-colors cursor-pointer"
                        title="View Full Thermal Receipt"
                        aria-label="View Full Thermal Receipt"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {order.notes && (
                  <div className="text-[11px] text-amber-700 bg-amber-50/70 p-2 rounded-lg border border-amber-100">
                    <span className="font-semibold">Note: </span>
                    {order.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
