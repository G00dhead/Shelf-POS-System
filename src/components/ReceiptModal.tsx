import React from 'react';
import { CheckCircle2, Printer, Mail, X, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { formatMoney } from '../utils/format';
import { BarcodeView } from './BarcodeView';

export const ReceiptModal: React.FC<{ order: Order; onClose: () => void }> = ({
  order,
  onClose
}) => {
  const { settings } = useApp();

  return (
    <div
      id="receipt-modal-backdrop"
      className="fixed inset-0 z-50 bg-zinc-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="receipt-modal-card"
        className="bg-white w-full max-w-md rounded-2xl border border-zinc-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Header */}
        <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-semibold text-emerald-950 leading-tight">
                Payment Completed
              </h3>
              <p className="text-[11px] text-emerald-700">
                Order {order.orderNumber} recorded in Register Ledger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Paper Receipt Simulation */}
        <div className="p-6 bg-white space-y-4">
          <div className="text-center pb-3 border-b border-dashed border-zinc-200">
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">
              {settings.storeName}
            </h2>
            <p className="text-xs text-zinc-500 whitespace-pre-line mt-1 leading-relaxed">
              {settings.receiptHeader}
            </p>
            <div className="mt-2 text-[11px] text-zinc-400 flex justify-center gap-3">
              <span>{order.timestamp}</span>
              <span>•</span>
              <span>Cashier: {order.cashier}</span>
            </div>
          </div>

          {/* Line items */}
          <div className="space-y-2 py-1 max-h-48 overflow-y-auto">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-xs">
                <div className="flex-1 pr-2">
                  <div className="font-medium text-zinc-900">{item.productName}</div>
                  <div className="text-[11px] text-zinc-400">
                    {item.quantity} × {formatMoney(item.unitPrice, settings.currency)}
                  </div>
                </div>
                <div className="font-mono text-zinc-800 font-semibold">
                  {formatMoney(item.lineTotal, settings.currency)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals breakdown */}
          <div className="pt-3 border-t border-dashed border-zinc-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span className="font-mono text-zinc-800">
                {formatMoney(order.subtotal, settings.currency)}
              </span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>FIRS VAT ({order.taxRate}%)</span>
              <span className="font-mono text-zinc-800">
                {formatMoney(order.tax, settings.currency)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount</span>
                <span className="font-mono">
                  -{formatMoney(order.discount, settings.currency)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-zinc-100 text-sm font-bold text-zinc-900">
              <span>Total Paid ({order.paymentMethod.toUpperCase()})</span>
              <span className="font-mono text-base text-[#6D5AE6]">
                {formatMoney(order.total, settings.currency)}
              </span>
            </div>
          </div>

          {/* Real SVG barcode on receipt */}
          <div className="pt-3 text-center border-t border-dashed border-zinc-200 flex flex-col items-center">
            <BarcodeView
              value={order.orderNumber.replace(/[^0-9]/g, '') || '1049'}
              height={32}
              showText={false}
            />
            <p className="text-[10px] text-zinc-400 mt-1 font-mono">
              AUTH: 99482-NG-{order.orderNumber.replace('#', '')}
            </p>
            <p className="text-[11px] text-zinc-500 mt-2 italic whitespace-pre-line">
              {settings.receiptFooter}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              window.print();
            }}
            className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            onClick={() => alert(`Receipt dispatched via SMS & Email to customer!`)}
            className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold text-white bg-[#6D5AE6] hover:bg-[#5E4BD4] rounded-lg transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>New Sale</span>
          </button>
        </div>
      </div>
    </div>
  );
};
