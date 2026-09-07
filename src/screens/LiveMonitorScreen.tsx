import React from 'react';
import { Activity, Wifi, Cpu, HardDrive, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LiveMonitorScreen: React.FC = () => {
  const { orders, drawerAmount, products } = useApp();

  return (
    <div id="live-monitor-screen" className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
      <div>
        <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Terminal Live Monitor</h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Real-time hardware telemetry, peripheral heartbeats, and database synchronization
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase">System Status</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Wifi className="w-4 h-4 text-emerald-600" />
            <span>Online (5ms)</span>
          </div>
          <p className="text-[11px] text-zinc-400">All services operational</p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <span className="text-xs font-medium text-zinc-400 uppercase">Active Terminals</span>
          <div className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#6D5AE6]" />
            <span>Terminal 01 • Main</span>
          </div>
          <p className="text-[11px] text-zinc-400">Station Lane #01 (Jordan M.)</p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <span className="text-xs font-medium text-zinc-400 uppercase">Cash Float</span>
          <div className="text-base font-bold text-zinc-900 font-mono">
            ${drawerAmount.toFixed(2)}
          </div>
          <p className="text-[11px] text-zinc-400">Drawer sensor closed</p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <span className="text-xs font-medium text-zinc-400 uppercase">Catalog In-Memory</span>
          <div className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-blue-600" />
            <span>{products.length} Products</span>
          </div>
          <p className="text-[11px] text-zinc-400">Synced to offline cache</p>
        </div>
      </div>

      <div className="p-5 rounded-xl border border-zinc-200 bg-white space-y-4">
        <h3 className="text-sm font-bold text-zinc-900">Live POS Event Stream</h3>
        <div className="space-y-2.5 font-mono text-xs">
          {orders.map((o, idx) => (
            <div
              key={o.id}
              className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">200 OK</span>
                <span className="text-zinc-400">{o.timestamp}</span>
                <span className="text-zinc-800 font-bold">{o.orderNumber}</span>
                <span className="text-zinc-500">
                  {o.items.length} items • ${o.total.toFixed(2)} ({o.paymentMethod})
                </span>
              </div>
              <span className="text-[11px] text-zinc-400">Processed by {o.cashier}</span>
            </div>
          ))}
          <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center justify-between text-zinc-400">
            <span>[HEARTBEAT] Peripheral scanner & receipt thermal printer ready</span>
            <span>2s interval</span>
          </div>
        </div>
      </div>
    </div>
  );
};
