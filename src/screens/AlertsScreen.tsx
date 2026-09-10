import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  ArrowRight,
  RefreshCw,
  Plus,
  Sliders,
  Check,
  PackageCheck,
  ShieldCheck,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatMoney } from '../utils/format';

export const AlertsScreen: React.FC = () => {
  const {
    products,
    stockAlerts,
    lastInventoryScan,
    isScanningInventory,
    runCatalogBackgroundCheck,
    quickRestockProduct,
    updateReorderThreshold,
    acknowledgeAlert,
    setCurrentScreen,
    settings,
    drawerAmount
  } = useApp();

  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'acknowledged'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [editingThresholdId, setEditingThresholdId] = useState<string | null>(null);
  const [tempThresholdValue, setTempThresholdValue] = useState<string>('15');
  const [restockSuccessId, setRestockSuccessId] = useState<string | null>(null);

  // Filter alerts
  const filteredAlerts = stockAlerts.filter((alert) => {
    if (filterSeverity === 'critical' && alert.severity !== 'critical') return false;
    if (filterSeverity === 'warning' && alert.severity !== 'warning') return false;
    if (filterSeverity === 'acknowledged' && alert.status !== 'acknowledged') return false;
    if (filterSeverity !== 'acknowledged' && alert.status === 'acknowledged') return false;

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchName = alert.productName.toLowerCase().includes(q);
      const matchSku = alert.sku.toLowerCase().includes(q);
      const matchCategory = alert.category.toLowerCase().includes(q);
      return matchName || matchSku || matchCategory;
    }
    return true;
  });

  const criticalCount = stockAlerts.filter((a) => a.severity === 'critical' && a.status === 'active').length;
  const warningCount = stockAlerts.filter((a) => a.severity === 'warning' && a.status === 'active').length;
  const acknowledgedCount = stockAlerts.filter((a) => a.status === 'acknowledged').length;
  const totalActive = criticalCount + warningCount;

  const totalDeficitUnits = stockAlerts
    .filter((a) => a.status === 'active')
    .reduce((sum, a) => sum + a.deficit, 0);

  const healthyProductsCount = products.length - totalActive;
  const healthPercentage = products.length > 0 ? Math.round((healthyProductsCount / products.length) * 100) : 100;

  const handleQuickRestock = (productId: string, qty: number) => {
    quickRestockProduct(productId, qty);
    setRestockSuccessId(productId);
    setTimeout(() => {
      setRestockSuccessId(null);
    }, 1800);
  };

  const handleSaveThreshold = (productId: string) => {
    const val = parseInt(tempThresholdValue, 10);
    if (!isNaN(val) && val >= 0) {
      updateReorderThreshold(productId, val);
    }
    setEditingThresholdId(null);
  };

  return (
    <div id="alerts-screen" className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-zinc-50/50">
      {/* Top Banner & Background Daemon Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-zinc-900 tracking-tight">
                Catalog Inventory & System Alerts
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Automated background process checks catalog data and triggers warnings when quantities drop below defined reorder points.
              </p>
            </div>
          </div>
        </div>

        {/* Daemon Heartbeat & Scan Trigger */}
        <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/60">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="text-[11px] font-medium text-emerald-800">
              <span>Background Daemon: </span>
              <span className="font-semibold font-mono">
                {lastInventoryScan ? `Checked ${lastInventoryScan}` : 'Monitoring'}
              </span>
            </div>
          </div>

          <button
            onClick={() => runCatalogBackgroundCheck()}
            disabled={isScanningInventory}
            className="px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            title="Force immediate catalog scan against all thresholds"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanningInventory ? 'animate-spin text-[#6D5AE6]' : ''}`} />
            <span>{isScanningInventory ? 'Scanning...' : 'Scan Catalog Now'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-medium">
            <span>Reorder Triggers</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-900">{totalActive}</span>
            <span className="text-xs text-zinc-400 font-medium">of {products.length} items</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            {totalActive === 0 ? 'All catalog stock is optimal' : 'Stock fallen ≤ reorder threshold'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-medium">
            <span>Critical Deficits</span>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-red-600">{criticalCount}</span>
            <span className="text-xs text-red-600/70 font-medium">urgent restocks</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Stock ≤ 50% of threshold or empty</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-medium">
            <span>Units Replenishment Deficit</span>
            <Plus className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-900">{totalDeficitUnits}</span>
            <span className="text-xs text-zinc-400 font-medium">units needed</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">To reach target threshold levels</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-medium">
            <span>Catalog Health Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-600">{healthPercentage}%</span>
            <span className="text-xs text-emerald-700/70 font-medium">stocked</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">{healthyProductsCount} products above reorder point</p>
        </div>
      </div>

      {/* Catalog Stock Reorder Alerts Section */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/40">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filterSeverity === 'all'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-zinc-200/60'
              }`}
            >
              All Active Alerts ({totalActive})
            </button>
            <button
              onClick={() => setFilterSeverity('critical')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filterSeverity === 'critical'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-red-700 hover:bg-red-50'
              }`}
            >
              Critical Deficits ({criticalCount})
            </button>
            <button
              onClick={() => setFilterSeverity('warning')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filterSeverity === 'warning'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              Low Stock Warnings ({warningCount})
            </button>
            {acknowledgedCount > 0 && (
              <button
                onClick={() => setFilterSeverity('acknowledged')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  filterSeverity === 'acknowledged'
                    ? 'bg-zinc-700 text-white shadow-xs'
                    : 'text-zinc-500 hover:bg-zinc-100'
                }`}
              >
                Acknowledged ({acknowledgedCount})
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Filter by name, SKU, or category..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:border-[#6D5AE6] bg-white"
            />
          </div>
        </div>

        {/* Alerts List */}
        <div className="divide-y divide-zinc-100">
          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900">
                {filterSeverity === 'all'
                  ? 'Catalog Stock is in Optimal Condition'
                  : `No ${filterSeverity} alerts detected`}
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mt-1">
                {filterSeverity === 'all'
                  ? 'Every product in the supermarket catalog is currently above its configured reorder threshold.'
                  : 'Change filter tabs or scan catalog data to view other inventory statuses.'}
              </p>
              <button
                onClick={() => setCurrentScreen('catalog')}
                className="mt-4 px-4 py-2 text-xs font-semibold text-[#6D5AE6] bg-[#6D5AE6]/10 hover:bg-[#6D5AE6]/20 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Browse Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isCritical = alert.severity === 'critical';
              const percentOfThreshold = Math.min(
                100,
                Math.round((alert.currentStock / Math.max(1, alert.reorderThreshold)) * 100)
              );

              return (
                <div
                  key={alert.id}
                  className={`p-4 sm:p-5 transition-colors ${
                    isCritical ? 'bg-red-50/20 hover:bg-red-50/40' : 'bg-amber-50/15 hover:bg-amber-50/30'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Product info and reason */}
                    <div className="flex items-start gap-3.5">
                      <div className="relative shrink-0">
                        <img
                          src={alert.image}
                          alt={alert.productName}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-cover border border-zinc-200 bg-white"
                        />
                        <div
                          className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-xs ${
                            isCritical ? 'bg-red-500' : 'bg-amber-500'
                          }`}
                        >
                          {isCritical ? (
                            <AlertCircle className="w-3 h-3" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                              isCritical
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isCritical ? 'Critical Depletion' : 'Reorder Threshold Triggered'}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-400">
                            {alert.sku}
                          </span>
                          <span className="text-[11px] text-zinc-400">·</span>
                          <span className="text-[11px] text-zinc-500">{alert.category}</span>
                        </div>

                        <h3 className="text-sm font-bold text-zinc-900 leading-snug">
                          {alert.productName}
                        </h3>

                        <p className="text-xs text-zinc-600">
                          Background catalog check triggered at{' '}
                          <span className="font-mono text-zinc-700">{alert.triggeredAt}</span>. Current
                          quantity{' '}
                          <span className="font-bold font-mono text-zinc-900">
                            {alert.currentStock} units
                          </span>{' '}
                          is below the defined reorder point of{' '}
                          <span className="font-bold font-mono text-zinc-900">
                            {alert.reorderThreshold} units
                          </span>
                          .
                        </p>
                      </div>
                    </div>

                    {/* Middle: Stock vs Threshold Gauge Bar */}
                    <div className="w-full lg:w-72 shrink-0 bg-white p-3 rounded-xl border border-zinc-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Current / Target:</span>
                        <span className="font-mono font-bold text-zinc-900">
                          {alert.currentStock} / {alert.reorderThreshold} units
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCritical ? 'bg-red-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${percentOfThreshold}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400">
                          Deficit: <span className="font-bold font-mono text-red-600">-{alert.deficit} units</span>
                        </span>
                        <span className="font-medium text-zinc-500">{percentOfThreshold}% of threshold</span>
                      </div>
                    </div>

                    {/* Right: Inline Quick Actions */}
                    <div className="flex items-center gap-2 self-end lg:self-center shrink-0 flex-wrap">
                      {/* Restock Success Feedback */}
                      {restockSuccessId === alert.productId ? (
                        <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Restocked!</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleQuickRestock(alert.productId, 20)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#6D5AE6] hover:bg-[#5B48D9] rounded-lg transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                            title="Add +20 units immediately to catalog inventory"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Quick +20</span>
                          </button>

                          <button
                            onClick={() => handleQuickRestock(alert.productId, 50)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
                            title="Add +50 units to stock"
                          >
                            <span>+50</span>
                          </button>
                        </div>
                      )}

                      {/* Threshold adjust modal toggle */}
                      {editingThresholdId === alert.productId ? (
                        <div className="flex items-center gap-1 bg-white p-1 border border-zinc-300 rounded-lg shadow-xs">
                          <input
                            type="number"
                            min="1"
                            value={tempThresholdValue}
                            onChange={(e) => setTempThresholdValue(e.target.value)}
                            className="w-14 px-1.5 py-0.5 text-xs font-mono border border-zinc-200 rounded text-center focus:outline-none focus:border-[#6D5AE6]"
                          />
                          <button
                            onClick={() => handleSaveThreshold(alert.productId)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Save new threshold"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingThresholdId(alert.productId);
                            setTempThresholdValue(alert.reorderThreshold.toString());
                          }}
                          className="px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="Change defined reorder threshold"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Set Point</span>
                        </button>
                      )}

                      {alert.status === 'active' && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-2.5 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                          title="Acknowledge alert"
                        >
                          Acknowledge
                        </button>
                      )}

                      <button
                        onClick={() => setCurrentScreen('catalog')}
                        className="p-1.5 text-zinc-400 hover:text-[#6D5AE6] hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                        title="View item in catalog"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Secondary Hardware & Settlement System Notices */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-wider">
          Store Operations & Compliance Monitors
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Cash Drawer Float Sensor */}
          <div className="p-4 rounded-xl border border-zinc-200/80 bg-white flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900">
                  Cash Drawer Float Sensor
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Current cash in drawer:{' '}
                  <span className="font-bold font-mono text-zinc-800">
                    {formatMoney(drawerAmount, settings.currency)}
                  </span>
                  . Standard operational float is ₦50,000.00.
                </p>
              </div>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded font-mono bg-emerald-50 text-emerald-700 font-semibold shrink-0">
              Optimal
            </span>
          </div>

          {/* Daily Payout Scheduled */}
          <div className="p-4 rounded-xl border border-zinc-200/80 bg-white flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900">
                  Automated Bank Settlement Batch
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Automated batch settlement scheduled for tonight to Access Bank / Zenith Bank merchant account.
                </p>
              </div>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded font-mono bg-blue-50 text-blue-700 font-semibold shrink-0">
              Scheduled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
