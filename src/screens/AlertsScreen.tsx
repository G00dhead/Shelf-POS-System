import React from 'react';
import { Bell, AlertTriangle, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AlertsScreen: React.FC = () => {
  const { products, setCurrentScreen, drawerAmount } = useApp();

  const lowStock = products.filter((p) => p.stock <= 15);

  return (
    <div id="alerts-screen" className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
      <div>
        <h2 className="text-lg font-bold text-zinc-900 tracking-tight">System Alerts & Notifications</h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Automated warnings regarding low inventory, cash floats, and compliance events
        </p>
      </div>

      <div className="space-y-3">
        {lowStock.map((prod) => (
          <div
            key={prod.id}
            className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-950">
                  Low Stock Warning: {prod.name}
                </h4>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Only <span className="font-bold font-mono">{prod.stock}</span> units remaining in inventory ({prod.sku}).
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('catalog')}
              className="px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Restock</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}

        <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900">
                Cash Drawer Sensor
              </h4>
              <p className="text-[11px] text-zinc-600 mt-0.5">
                Current float: ${drawerAmount.toFixed(2)}. Safe limit is $1,000.00.
              </p>
            </div>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">Status: Normal</span>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900">
                Daily Payout Scheduled
              </h4>
              <p className="text-[11px] text-zinc-600 mt-0.5">
                Auto-batch BATCH-2026-0907 scheduled for settlement to JPMorgan Chase.
              </p>
            </div>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Scheduled</span>
        </div>
      </div>
    </div>
  );
};
