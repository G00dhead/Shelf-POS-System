import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  Building2,
  Smartphone,
  Delete,
  RotateCcw,
  CheckCircle2,
  Coins,
  ArrowRight,
  Receipt,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatMoney } from '../utils/format';
import { PaymentMethod } from '../types';

export const ManualPaymentModal: React.FC = () => {
  const {
    isManualPaymentOpen,
    setIsManualPaymentOpen,
    total,
    cart,
    settings,
    processManualPayment
  } = useApp();

  const [inputDigits, setInputDigits] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('cash');
  const [isSyncedToPos, setIsSyncedToPos] = useState<boolean>(true);
  const [showOptionalDetails, setShowOptionalDetails] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [paymentNote, setPaymentNote] = useState<string>('');

  // By default, it is synced to the POS cart total
  useEffect(() => {
    if (isManualPaymentOpen) {
      if (cart.length > 0) {
        setInputDigits(Math.round(total).toString());
        setIsSyncedToPos(true);
        setPaymentNote('POS Cart Checkout');
      } else {
        setInputDigits('');
        setIsSyncedToPos(false);
        setPaymentNote('');
      }
      setShowOptionalDetails(false);
    }
  }, [isManualPaymentOpen, total, cart.length]);

  const numericValue = parseInt(inputDigits, 10) || 0;
  const hasCart = cart.length > 0;
  const posCartTotal = Math.round(total);

  // Sync back to POS total
  const handleSyncToPos = () => {
    setInputDigits(posCartTotal.toString());
    setIsSyncedToPos(true);
  };

  // Keypad actions
  const handleDigit = useCallback((d: string) => {
    setIsSyncedToPos(false);
    setInputDigits((prev) => {
      if (prev === '' && (d === '0' || d === '00')) return '';
      if (prev.length >= 10) return prev; // Up to 10 digits (billions)
      return prev + d;
    });
  }, []);

  const handleBackspace = useCallback(() => {
    setIsSyncedToPos(false);
    setInputDigits((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setIsSyncedToPos(false);
    setInputDigits('');
  }, []);

  const handleAddPreset = (addAmount: number) => {
    setIsSyncedToPos(false);
    setInputDigits((prev) => {
      const current = parseInt(prev, 10) || 0;
      return (current + addAmount).toString();
    });
  };

  const handleSubmit = () => {
    if (numericValue <= 0) return;

    processManualPayment({
      amount: numericValue,
      method: selectedMethod,
      notes: paymentNote.trim() || undefined,
      customerName: customerName.trim() || undefined
    });
  };

  // Physical keyboard support
  useEffect(() => {
    if (!isManualPaymentOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          setIsManualPaymentOpen(false);
        }
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsManualPaymentOpen(false);
      } else if (e.key === 'Enter' && numericValue > 0) {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isManualPaymentOpen, handleDigit, handleBackspace, numericValue, selectedMethod, paymentNote, customerName]);

  if (!isManualPaymentOpen) return null;

  // Change and remaining calculations
  const changeDue = hasCart && numericValue >= posCartTotal ? numericValue - posCartTotal : 0;
  const remainingDue = hasCart && numericValue < posCartTotal && numericValue > 0 ? posCartTotal - numericValue : 0;

  // Dynamic font size scaling so numbers show fully without clipping or wrapping
  const digitCount = inputDigits.length;
  const amountFontSize =
    digitCount <= 4
      ? 'text-4xl sm:text-5xl'
      : digitCount <= 6
      ? 'text-3xl sm:text-4xl'
      : digitCount <= 8
      ? 'text-2xl sm:text-3xl'
      : 'text-xl sm:text-2xl';

  const presets = [500, 1000, 2000, 5000, 10000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="manual-payment-modal"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200/90 overflow-hidden flex flex-col max-h-[96vh] animate-in zoom-in-95 duration-200"
      >
        {/* Compact Modal Header */}
        <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#6D5AE6]/10 text-[#6D5AE6] flex items-center justify-center font-bold shrink-0">
              <Coins className="w-4 h-4 text-[#6D5AE6]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-zinc-900 leading-tight">Keypad Pay</h2>
                <span className="text-[10px] font-semibold bg-[#6D5AE6]/10 text-[#6D5AE6] px-1.5 py-0.2 rounded-sm uppercase tracking-wider">
                  Cashier: Goodhead Golly
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                {hasCart ? 'Synced to active POS register order' : 'Standalone register charge'}
              </p>
            </div>
          </div>
          <button
            id="close-manual-payment-modal-btn"
            onClick={() => setIsManualPaymentOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/70 rounded-lg transition-colors cursor-pointer"
            aria-label="Close keypad payment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* POS Sync Status Bar */}
        <div className="px-4 py-2 bg-violet-50/70 border-b border-violet-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <Receipt className="w-3.5 h-3.5 text-[#6D5AE6] shrink-0" />
            <span className="text-zinc-600 truncate">
              {hasCart ? (
                <>
                  POS Cart: <strong className="text-zinc-900">{cart.length} item(s)</strong> • Total:{' '}
                  <strong className="font-mono text-[#6D5AE6]">{formatMoney(posCartTotal, settings.currency)}</strong>
                </>
              ) : (
                <span className="text-zinc-500">POS Cart is empty (manual charge mode)</span>
              )}
            </span>
          </div>

          {hasCart && (
            <button
              type="button"
              id="sync-to-pos-cart-btn"
              onClick={handleSyncToPos}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded-md flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                isSyncedToPos
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                  : 'bg-[#6D5AE6] text-white hover:bg-[#5b48db] shadow-2xs'
              }`}
              title="Sync keypad amount to exact POS cart total"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncedToPos ? 'text-emerald-700' : 'text-white'}`} />
              <span>{isSyncedToPos ? 'Synced' : 'Sync to POS'}</span>
            </button>
          )}
        </div>

        {/* Main Content Area */}
        <div className="p-3 sm:p-4 space-y-2.5 overflow-y-auto">
          {/* Big Amount Screen Display - Numbers Show Fully */}
          <div className="relative px-4 py-3 rounded-xl bg-zinc-900 text-white shadow-inner flex flex-col items-center justify-center border border-zinc-800">
            <div className="w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-0.5">
              <span>{isSyncedToPos ? 'POS Order Amount' : 'Amount Tendered'}</span>
              {isSyncedToPos ? (
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  POS Linked
                </span>
              ) : (
                numericValue > 0 && <span className="text-[#8B7CF8] font-bold">• Manual Input</span>
              )}
            </div>

            {/* High-visibility numbers screen */}
            <div
              id="keypad-screen-amount"
              className={`w-full font-mono font-black ${amountFontSize} tracking-tight text-white flex items-center justify-center gap-1.5 py-1 whitespace-nowrap overflow-hidden select-none`}
            >
              <span className="text-[#8B7CF8] font-semibold select-none opacity-90">
                {settings.currency}
              </span>
              <span className="tabular-nums">
                {numericValue > 0 ? numericValue.toLocaleString() : '0'}
              </span>
            </div>

            {/* Real-time Change / Remaining calculation */}
            {hasCart && (
              <div className="mt-1 text-xs font-semibold w-full flex items-center justify-center">
                {changeDue > 0 ? (
                  <span className="text-emerald-400 flex items-center gap-1 bg-emerald-950/70 border border-emerald-700/60 px-3 py-0.5 rounded-full text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Change Due: {formatMoney(changeDue, settings.currency)}
                  </span>
                ) : remainingDue > 0 ? (
                  <span className="text-amber-400 bg-amber-950/70 border border-amber-700/60 px-3 py-0.5 rounded-full text-xs font-bold">
                    Remaining: {formatMoney(remainingDue, settings.currency)}
                  </span>
                ) : (
                  <span className="text-emerald-400 text-[11px] font-medium">
                    Exact amount matches POS order
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quick Cash Presets Chips */}
          <div className="flex items-center justify-between gap-1">
            <div className="flex flex-wrap gap-1">
              {presets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleAddPreset(val)}
                  className="px-2 py-1 text-[11px] font-bold font-mono rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer border border-zinc-200/80 active:scale-95"
                >
                  +{settings.currency}{val >= 1000 ? `${val / 1000}k` : val}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="px-2 py-1 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer border border-red-200 flex items-center gap-1 active:scale-95 shrink-0"
              title="Clear all digits"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          {/* Big Tactile Keypad Grid - Full Display of Numbers */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                id={`keypad-btn-${digit}`}
                type="button"
                onClick={() => handleDigit(digit)}
                className="h-12 sm:h-14 text-2xl sm:text-3xl font-bold font-mono rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 transition-all flex items-center justify-center cursor-pointer select-none border border-zinc-200 shadow-2xs active:scale-95 active:bg-zinc-300"
              >
                {digit}
              </button>
            ))}

            {/* Row 4: 00, 0, Backspace */}
            <button
              id="keypad-btn-00"
              type="button"
              onClick={() => handleDigit('00')}
              className="h-12 sm:h-14 text-lg sm:text-xl font-bold font-mono rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-all flex items-center justify-center cursor-pointer select-none border border-zinc-200 shadow-2xs active:scale-95 active:bg-zinc-300"
            >
              00
            </button>

            <button
              id="keypad-btn-0"
              type="button"
              onClick={() => handleDigit('0')}
              className="h-12 sm:h-14 text-2xl sm:text-3xl font-bold font-mono rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 transition-all flex items-center justify-center cursor-pointer select-none border border-zinc-200 shadow-2xs active:scale-95 active:bg-zinc-300"
            >
              0
            </button>

            <button
              id="keypad-btn-backspace"
              type="button"
              onClick={handleBackspace}
              className="h-12 sm:h-14 text-lg font-bold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-all flex items-center justify-center cursor-pointer select-none border border-amber-200 shadow-2xs active:scale-95"
              aria-label="Backspace"
              title="Backspace"
            >
              <Delete className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            </button>
          </div>

          {/* Payment Method Selector */}
          <div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'cash' as PaymentMethod, label: 'Cash', icon: Banknote },
                { id: 'card' as PaymentMethod, label: 'Card / POS', icon: CreditCard },
                { id: 'split' as PaymentMethod, label: 'Transfer', icon: Building2 },
                { id: 'split' as PaymentMethod, label: 'USSD', icon: Smartphone }
              ].map((m, idx) => {
                const Icon = m.icon;
                const isSelected = selectedMethod === m.id && (idx === 0 ? selectedMethod === 'cash' : idx === 1 ? selectedMethod === 'card' : true);
                return (
                  <button
                    key={`${m.id}-${idx}`}
                    type="button"
                    onClick={() => setSelectedMethod(m.id)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#6D5AE6] text-white border-[#6D5AE6] shadow-2xs'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collapsible Customer / Note toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowOptionalDetails(!showOptionalDetails)}
              className="text-[11px] font-semibold text-[#6D5AE6] hover:text-[#5844d1] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{showOptionalDetails ? 'Hide Note & Customer' : '+ Add Customer Name / Note'}</span>
            </button>

            {showOptionalDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5 animate-in fade-in duration-150">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer name (optional)"
                  className="w-full px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#6D5AE6]/20 focus:border-[#6D5AE6]"
                />
                <input
                  type="text"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="Note / reference"
                  className="w-full px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#6D5AE6]/20 focus:border-[#6D5AE6]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer / Big Action Button */}
        <div className="p-3 border-t border-zinc-100 bg-zinc-50/80 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsManualPaymentOpen(false)}
            className="px-3.5 py-2.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Cancel
          </button>

          <button
            id="confirm-manual-payment-btn"
            type="button"
            disabled={numericValue <= 0}
            onClick={handleSubmit}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-white tracking-wide transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
              numericValue > 0
                ? 'bg-[#6D5AE6] hover:bg-[#5b48db] active:scale-[0.99]'
                : 'bg-zinc-300 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{hasCart ? 'Charge POS Order' : 'Complete Charge'}</span>
            <span className="font-mono bg-white/20 px-2 py-0.5 rounded-md text-xs font-bold whitespace-nowrap">
              {formatMoney(numericValue, settings.currency)}
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
