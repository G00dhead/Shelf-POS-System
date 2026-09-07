import React, { useState } from 'react';
import { LogOut, Banknote, Check, X, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatMoney } from '../utils/format';

export const EndShiftModal: React.FC = () => {
  const { isEndShiftOpen, setIsEndShiftOpen, drawerAmount, settings, orders } = useApp();
  const [actualCount, setActualCount] = useState<string>(drawerAmount.toString());
  const [reconciled, setReconciled] = useState(false);

  if (!isEndShiftOpen) return null;

  const actualNum = parseFloat(actualCount) || 0;
  const variance = actualNum - drawerAmount;

  const handleCloseShift = () => {
    setReconciled(true);
    setTimeout(() => {
      setReconciled(false);
      setIsEndShiftOpen(false);
    }, 1500);
  };

  const todayCompletedOrders = orders.filter((o) => o.status === 'completed');
  const cashOrders = todayCompletedOrders.filter((o) => o.paymentMethod === 'cash');
  const cashSalesTotal = cashOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div
      id="end-shift-modal-backdrop"
      className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="end-shift-modal-card"
        className="bg-white w-full max-w-md rounded-2xl border border-zinc-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogOut className="w-5 h-5 text-[#6D5AE6]" />
            <h3 className="text-sm font-semibold text-zinc-900">
              End Shift & Reconcile Register Drawer
            </h3>
          </div>
          <button
            onClick={() => setIsEndShiftOpen(false)}
            className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>Cashier</span>
              <span className="font-semibold text-zinc-900">{settings.cashierName}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Shift Started</span>
              <span className="font-medium text-zinc-700">{settings.shiftStartTime}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Starting Cash Float</span>
              <span className="font-mono text-zinc-700 font-medium">
                {formatMoney(settings.startingDrawerFloat, settings.currency)}
              </span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Cash Sales Collected</span>
              <span className="font-mono text-emerald-700 font-medium">
                +{formatMoney(cashSalesTotal, settings.currency)}
              </span>
            </div>
            <div className="pt-2 border-t border-zinc-200 flex justify-between font-semibold text-zinc-900">
              <span>Expected in Drawer</span>
              <span className="font-mono text-[#6D5AE6]">
                {formatMoney(drawerAmount, settings.currency)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Physical Cash Count in Drawer (₦)
            </label>
            <div className="relative">
              <span className="text-zinc-400 font-mono font-bold absolute left-3 top-1/2 -translate-y-1/2">
                ₦
              </span>
              <input
                type="number"
                step="50"
                value={actualCount}
                onChange={(e) => setActualCount(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-zinc-200 rounded-xl text-sm font-mono font-medium text-zinc-900 focus:outline-none focus:border-[#6D5AE6]"
              />
            </div>
          </div>

          {/* Discrepancy indicator */}
          <div
            className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
              variance === 0
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : variance > 0
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {variance === 0 ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              )}
              <span className="font-medium">
                {variance === 0
                  ? 'Perfect match — drawer is balanced'
                  : variance > 0
                  ? 'Drawer is over'
                  : 'Drawer is short'}
              </span>
            </div>
            <span className="font-mono font-bold">
              {variance >= 0 ? '+' : ''}
              {formatMoney(variance, settings.currency)}
            </span>
          </div>
        </div>

        <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-end gap-2">
          <button
            onClick={() => setIsEndShiftOpen(false)}
            className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCloseShift}
            disabled={reconciled}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#6D5AE6] hover:bg-[#5E4BD4] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {reconciled ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Shift Reconciled!</span>
              </>
            ) : (
              <span>Finalize & Print Z-Report</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
