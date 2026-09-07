import React, { useState } from 'react';
import { Receipt, Percent, Check, ShieldCheck, Landmark } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TaxEngineScreen: React.FC = () => {
  const { taxSettings, updateTaxRate, taxLogs } = useApp();
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const totalCollected = taxLogs.reduce((sum, log) => sum + log.taxCollected, 0);
  const totalTaxable = taxLogs.reduce((sum, log) => sum + log.taxableSales, 0);

  const handleRateChange = (id: string, newRate: number, category: string) => {
    updateTaxRate(id, newRate);
    setSuccessNotice(`Updated ${category} sales tax rate to ${newRate}%`);
    setTimeout(() => setSuccessNotice(null), 2500);
  };

  return (
    <div id="tax-engine-screen" className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Tax Engine & Compliance</h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Define category tax rules, exemptions (e.g. food staples), and audit collected sales levies
        </p>
      </div>

      {successNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Total Tax Remitted</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-zinc-900">
              ${totalCollected.toFixed(2)}
            </span>
            <span className="text-[11px] font-semibold text-zinc-500">Live Period</span>
          </div>
          <p className="text-[11px] text-zinc-400">Escrowed for municipal remittance</p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Taxable Sales Base</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-zinc-900">
              ${totalTaxable.toFixed(2)}
            </span>
            <span className="text-[11px] font-medium text-emerald-600">Reconciled</span>
          </div>
          <p className="text-[11px] text-zinc-400">Across eligible merchandise categories</p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Tax Jurisdiction</span>
          <div className="flex items-center gap-2 pt-1">
            <Landmark className="w-5 h-5 text-[#6D5AE6]" />
            <div>
              <div className="text-xs font-bold text-zinc-900">New York State & NYC</div>
              <div className="text-[11px] text-zinc-400">Combined Local Rate (8.0%)</div>
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">Compliance: Active</p>
        </div>
      </div>

      {/* Category Tax Rate Settings */}
      <div className="p-5 rounded-xl border border-zinc-200 bg-white space-y-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">Tax Rates by Department</h3>
          <p className="text-xs text-zinc-400">
            Set custom percentage levies per merchandise class. 0% represents tax-exempt status.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {taxSettings.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 transition-all flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-zinc-900">{item.category}</h4>
                  {item.rate === 0 && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      Exempt
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500">{item.description}</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 bg-white border border-zinc-200 rounded-lg px-2 py-1">
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  max="35"
                  value={item.rate}
                  onChange={(e) =>
                    handleRateChange(item.id, parseFloat(e.target.value) || 0, item.category)
                  }
                  className="w-12 text-right font-mono font-bold text-xs text-zinc-900 focus:outline-none"
                />
                <span className="text-xs font-bold text-zinc-400">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log of Tax Collected */}
      <div className="p-5 rounded-xl border border-zinc-200 bg-white space-y-4">
        <h3 className="text-sm font-bold text-zinc-900">Sales Tax Audit Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase">
                <th className="py-2.5 px-3">Date / Batch</th>
                <th className="py-2.5 px-3">Tax Category</th>
                <th className="py-2.5 px-3">Taxable Sales</th>
                <th className="py-2.5 px-3 text-right">Tax Collected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {taxLogs.map((log) => (
                <tr
                  key={log.id}
                  className="even:bg-zinc-50/70 odd:bg-white hover:bg-zinc-100/80 transition-colors"
                >
                  <td className="py-3 px-3 font-medium text-zinc-800">{log.date}</td>
                  <td className="py-3 px-3 text-zinc-600">{log.category}</td>
                  <td className="py-3 px-3 font-mono text-zinc-800">
                    ${log.taxableSales.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-700 text-right">
                    ${log.taxCollected.toFixed(2)}
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
