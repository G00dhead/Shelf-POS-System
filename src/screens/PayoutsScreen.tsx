import React, { useState } from 'react';
import { CreditCard, Download, ArrowUpRight, CheckCircle2, Clock, Landmark } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PayoutsScreen: React.FC = () => {
  const { payouts } = useApp();
  const [toast, setToast] = useState<string | null>(null);

  const totalPaidOut = payouts
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayout = payouts.find((p) => p.status === 'In Transit');

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Batch ID,Date,Account,Transactions,Amount,Status\n' +
      payouts
        .map(
          (p) =>
            `${p.batchNumber},${p.date},"${p.bankAccount}",${p.transactionsCount},${p.amount},${p.status}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'payout_batches_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast('Payout reconciliation report downloaded as CSV');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div id="payouts-screen" className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Direct Deposit Payouts</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Settlement schedules and automatic depository transfers to linked banking accounts
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Payouts CSV</span>
        </button>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Total Settled (Month)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-zinc-900">
              ${totalPaidOut.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> Auto-daily
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">Successfully wired to primary checking</p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Next Scheduled Payout</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-zinc-900">
              ${pendingPayout ? pendingPayout.amount.toFixed(2) : '1,948.80'}
            </span>
            <span className="text-[11px] font-medium text-amber-600 flex items-center gap-1">
              <Clock className="w-3 h-3" /> In Transit
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">Arrives by 5:00 PM EST today</p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Primary Bank Account</span>
          <div className="flex items-center gap-2 pt-1">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">JPMorgan Chase NA</div>
              <div className="text-[11px] text-zinc-400 font-mono">•••• 4821 (Checking)</div>
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">Verified & Active</p>
        </div>
      </div>

      {/* Payout Batches Table */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              <th className="py-3 px-4">Batch ID</th>
              <th className="py-3 px-4">Settlement Date</th>
              <th className="py-3 px-4">Destination Account</th>
              <th className="py-3 px-4">Orders Cleared</th>
              <th className="py-3 px-4">Net Transfer Amount</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {payouts.map((batch) => (
              <tr
                key={batch.id}
                className="even:bg-zinc-50/70 odd:bg-white hover:bg-zinc-100/80 transition-colors"
              >
                <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                  {batch.batchNumber}
                </td>
                <td className="py-3 px-4 text-zinc-600 font-medium">{batch.date}</td>
                <td className="py-3 px-4 text-zinc-700">{batch.bankAccount}</td>
                <td className="py-3 px-4 font-mono text-zinc-600">
                  {batch.transactionsCount} tickets
                </td>
                <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                  ${batch.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      batch.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        batch.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    {batch.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
