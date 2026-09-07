import React, { useState } from 'react';
import {
  Store,
  Check,
  ShoppingBag,
  FileSpreadsheet,
  CreditCard,
  MessageSquare,
  Award,
  Truck,
  Layers,
  Settings,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Integration } from '../types';

export const MarketplaceScreen: React.FC = () => {
  const { integrations, toggleIntegration } = useApp();
  const [selectedConfig, setSelectedConfig] = useState<Integration | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingBag': return ShoppingBag;
      case 'FileSpreadsheet': return FileSpreadsheet;
      case 'CreditCard': return CreditCard;
      case 'MessageSquare': return MessageSquare;
      case 'Award': return Award;
      case 'Truck': return Truck;
      default: return Layers;
    }
  };

  return (
    <div id="marketplace-screen" className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Marketplace & App Extensions</h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Connect your supermarket registers to accounting engines, contactless card terminals, and delivery fleets
        </p>
      </div>

      {/* Grid of Add-ons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((item) => {
          const Icon = getIcon(item.iconName);

          return (
            <div
              key={item.id}
              className="p-5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700">
                    <Icon className="w-5 h-5 text-[#6D5AE6]" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-900">{item.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.connected ? 'bg-emerald-500' : 'bg-zinc-300'
                    }`}
                  />
                  <span className={item.connected ? 'text-zinc-700 font-medium' : 'text-zinc-400'}>
                    {item.connected ? 'Active' : 'Offline'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.connected && (
                    <button
                      onClick={() => setSelectedConfig(item)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                      title="Configure Integration"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => toggleIntegration(item.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      item.connected
                        ? 'bg-zinc-100 hover:bg-red-50 text-zinc-700 hover:text-red-600 border border-zinc-200'
                        : 'bg-[#6D5AE6] hover:bg-[#5E4BD4] text-white shadow-xs'
                    }`}
                  >
                    {item.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration Modal */}
      {selectedConfig && (
        <div className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-zinc-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900">
                Configure {selectedConfig.name}
              </h3>
              <button
                onClick={() => setSelectedConfig(null)}
                className="text-zinc-400 hover:text-zinc-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg border border-emerald-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Sync status: Healthy • {selectedConfig.statusText}</span>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Webhook URL</label>
                <input
                  type="text"
                  readOnly
                  value={`https://api.confidency.store/v1/integrations/${selectedConfig.id}`}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg font-mono text-zinc-600 bg-zinc-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">API Key / Access Token</label>
                <input
                  type="password"
                  readOnly
                  value="conf_live_98142791834912"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg font-mono text-zinc-600 bg-zinc-50"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedConfig(null)}
                  className="px-4 py-2 bg-[#6D5AE6] text-white font-semibold rounded-lg text-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
