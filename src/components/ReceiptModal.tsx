import React, { useState, useEffect, useRef } from 'react';
import {
  ReceiptPrinter,
  ReceiptPrinterStage,
} from './ReceiptPrinter';
import { Printer, Mail, X, ShoppingBag, Check, RotateCcw } from './icons';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { formatMoney } from '../utils/format';
import { BarcodeView } from './BarcodeView';

// Lightweight mechanical buzzer sound synthesizer for thermal printer feed
const playPrinterSound = () => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Small series of rapid clicks/stepper pulses
    const pulseCount = 10;
    const now = ctx.currentTime;
    for (let i = 0; i < pulseCount; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240 + (i % 3) * 60, now + i * 0.15);
      gain.gain.setValueAtTime(0.04, now + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.08);
    }
  } catch {
    // Audio context may be restricted before user gesture; gracefully ignore
  }
};

export const ReceiptModal: React.FC<{ order: Order; onClose: () => void }> = ({
  order,
  onClose,
}) => {
  const { settings } = useApp();
  const [stage, setStage] = useState<ReceiptPrinterStage>('processing');
  const [emailSent, setEmailSent] = useState(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const startPrintCycle = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setStage('processing');

    const t1 = setTimeout(() => {
      setStage('printing');
      playPrinterSound();
    }, 550);

    const t2 = setTimeout(() => {
      setStage('complete');
    }, 2450);

    timersRef.current = [t1, t2];
  };

  useEffect(() => {
    startPrintCycle();
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [order.id]);

  const handleSendEmail = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const handleRePrint = () => {
    startPrintCycle();
  };

  return (
    <div
      id="receipt-modal-backdrop"
      className="fixed inset-0 z-[70] bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <div
        id="receipt-modal-card"
        className="w-full max-w-md my-auto flex flex-col max-h-[96vh] sm:max-h-[92vh] bg-zinc-900 rounded-2xl sm:rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Control Bar */}
        <div className="bg-zinc-900/90 px-4 sm:px-5 py-3 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="text-xs font-semibold text-zinc-100 tracking-tight block">
                Receipt
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                Order {order.orderNumber}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printer Stage */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 flex flex-col items-center bg-radial from-zinc-900 via-zinc-950 to-black">
          <ReceiptPrinter.Root stage={stage} feedMotion="stepped" forceMotion={true} className="w-full">
            {/* The Hardware Machine */}
            <ReceiptPrinter.Machine className="w-full">
              <ReceiptPrinter.Header>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>ESC/POS 80mm</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRePrint}
                    className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-emerald-400 transition-colors bg-zinc-800/60 hover:bg-zinc-800 px-2 py-0.5 rounded cursor-pointer font-mono"
                    title="Feed again / replay animation"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>FEED</span>
                  </button>
                </div>
              </ReceiptPrinter.Header>

              <ReceiptPrinter.Screen>
                <ReceiptPrinter.Status />
              </ReceiptPrinter.Screen>
            </ReceiptPrinter.Machine>

            {/* Emerging Paper Slot & Slip */}
            <ReceiptPrinter.Output className="w-full">
              <ReceiptPrinter.Paper className="rounded-b-none">
                {/* Store Header */}
                <div className="text-center pb-3 border-b border-dashed border-zinc-300">
                  <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
                    {settings.storeName}
                  </h2>
                  <p className="text-[11px] text-zinc-600 whitespace-pre-line mt-0.5 leading-relaxed">
                    {settings.receiptHeader}
                  </p>
                  <div className="mt-2 text-[10px] text-zinc-500 flex justify-between px-1">
                    <span>{order.timestamp}</span>
                    <span>OP: {order.cashier}</span>
                  </div>
                </div>

                {/* Line Items List */}
                <div className="py-2.5 border-b border-dashed border-zinc-300 space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase border-b border-zinc-200 pb-1">
                    <span>Item</span>
                    <span>Qty × Price</span>
                    <span>Total</span>
                  </div>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-baseline text-[11px] text-zinc-800">
                      <div className="flex-1 pr-1 truncate font-medium">
                        {item.productName}
                      </div>
                      <div className="text-zinc-500 text-[10px] px-1 shrink-0">
                        {item.quantity} × {formatMoney(item.unitPrice, settings.currency)}
                      </div>
                      <div className="font-semibold shrink-0 text-right">
                        {formatMoney(item.lineTotal, settings.currency)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals & Taxes */}
                <div className="py-2 border-b border-dashed border-zinc-300 space-y-1 text-xs">
                  <div className="flex justify-between text-zinc-600 text-[11px]">
                    <span>SUBTOTAL</span>
                    <span>{formatMoney(order.subtotal, settings.currency)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 text-[11px]">
                    <span>FIRS VAT ({order.taxRate}%)</span>
                    <span>{formatMoney(order.tax, settings.currency)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold text-[11px]">
                      <span>DISCOUNT APPLIED</span>
                      <span>-{formatMoney(order.discount, settings.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-1.5 border-t border-zinc-300 text-sm font-black text-zinc-900">
                    <span className="tracking-tight">TOTAL ({order.paymentMethod.toUpperCase()})</span>
                    <span className="font-mono text-base text-zinc-950 font-black">
                      {formatMoney(order.total, settings.currency)}
                    </span>
                  </div>
                </div>

                {/* Barcode & Authentication */}
                <div className="pt-3 text-center flex flex-col items-center">
                  <BarcodeView
                    value={order.orderNumber.replace(/[^0-9]/g, '') || '8049102'}
                    height={32}
                    showText={false}
                  />
                  <div className="text-[10px] text-zinc-500 font-mono tracking-wider mt-1">
                    TRX: {order.orderNumber} • AUTH-99482
                  </div>
                  <p className="text-[11px] text-zinc-600 mt-2 italic whitespace-pre-line leading-relaxed">
                    {settings.receiptFooter || 'Thank you for your patronage!'}
                  </p>
                  <p className="text-[9px] text-zinc-400 mt-2 font-mono uppercase">
                    *** CUSTOMER COPY ***
                  </p>
                </div>
              </ReceiptPrinter.Paper>
            </ReceiptPrinter.Output>
          </ReceiptPrinter.Root>
        </div>

        {/* Modal Bottom Action Controls */}
        <div className="p-3.5 bg-zinc-900 border-t border-zinc-800 grid grid-cols-3 gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-400" />
            <span>Print System</span>
          </button>

          <button
            onClick={handleSendEmail}
            disabled={emailSent}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium border rounded-xl transition-colors cursor-pointer ${
              emailSent
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600'
                : 'text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700'
            }`}
          >
            {emailSent ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sent!</span>
              </>
            ) : (
              <>
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                <span>Email</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>New Sale</span>
          </button>
        </div>
      </div>
    </div>
  );
};
