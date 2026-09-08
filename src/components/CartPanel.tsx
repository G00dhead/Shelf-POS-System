import React from 'react';
import {
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  Split,
  RotateCcw,
  ShoppingBag,
  Calculator
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';
import { formatMoney } from '../utils/format';
import { playCashDrawerChime, playScanErrorBeep } from '../utils/audio';
import { DEFAULT_PRODUCT_IMAGE } from '../mockData';

export const CartPanel: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    resetCart,
    subtotal,
    tax,
    discountAmount,
    total,
    paymentMethod,
    setPaymentMethod,
    chargeCurrentOrder,
    settings,
    setMobileCartOpen,
    setIsManualPaymentOpen
  } = useApp();

  const handleCharge = () => {
    if (cart.length === 0) return;
    playCashDrawerChime();
    chargeCurrentOrder();
    if (isMobile) {
      setMobileCartOpen(false);
    }
  };

  return (
    <div
      id="cart-panel"
      className={`bg-white flex flex-col justify-between h-full ${
        isMobile ? 'w-full' : 'w-[320px] border-l border-zinc-200 shrink-0'
      }`}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 tracking-tight">
            Register Cart
          </h2>
          <p className="text-[11px] text-zinc-400">
            {cart.reduce((s, i) => s + i.quantity, 0)}{' '}
            {cart.reduce((s, i) => s + i.quantity, 0) === 1 ? 'item' : 'items'} in current ticket
          </p>
        </div>
        {cart.length > 0 && (
          <button
            id="reset-order-btn"
            onClick={resetCart}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-600 transition-colors font-medium px-2 py-1 rounded hover:bg-red-50 cursor-pointer"
            title="Clear all items in cart"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3.5">
        {cart.length === 0 ? (
          <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 text-zinc-400">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
              <ShoppingBag className="w-6 h-6 text-zinc-300" />
            </div>
            <p className="text-xs font-medium text-zinc-700">Order is empty</p>
            <p className="text-[11px] text-zinc-400 mt-1 max-w-[180px]">
              Scan product barcode or tap grocery item to start register checkout
            </p>
          </div>
        ) : (
          cart.map((item) => {
            const lineTotal = item.product.price * item.quantity;
            return (
              <div
                key={item.product.id}
                id={`cart-item-${item.product.id}`}
                className="group flex gap-3 items-start pb-3 border-b border-zinc-100 last:border-0"
              >
                {/* Product Thumbnail */}
                <img
                  src={item.product.image || DEFAULT_PRODUCT_IMAGE}
                  alt={item.product.name}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                  }}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover bg-zinc-100 border border-zinc-200/80 shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-semibold text-zinc-900 truncate leading-tight">
                      {item.product.name}
                    </h4>
                    {/* Delete button (red trash) */}
                    <button
                      id={`remove-cart-item-${item.product.id}`}
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-zinc-300 hover:text-red-600 transition-colors p-0.5 rounded cursor-pointer shrink-0"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                    {formatMoney(item.product.price, settings.currency)}
                  </p>

                  {/* Stepper and Line Total */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-zinc-200 rounded-md bg-zinc-50/50">
                      <button
                        id={`decrement-qty-${item.product.id}`}
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-l transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span
                        id={`qty-${item.product.id}`}
                        className="w-7 text-center text-xs font-semibold text-zinc-800 font-mono"
                      >
                        {item.quantity}
                      </span>
                      <button
                        id={`increment-qty-${item.product.id}`}
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-r transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-xs font-medium text-zinc-700">
                      <span className="text-[11px] text-zinc-400 font-normal">Total: </span>
                      <span className="font-semibold text-zinc-900 font-mono">
                        {formatMoney(lineTotal, settings.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Footer */}
      <div className="p-5 border-t border-zinc-200/90 bg-white space-y-4 shrink-0">
        {/* Subtotal, Tax, Discount, Total */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-zinc-500">
            <span>Subtotal</span>
            <span className="font-mono text-zinc-700 font-medium">
              {formatMoney(subtotal, settings.currency)}
            </span>
          </div>

          <div className="flex justify-between text-zinc-500">
            <span>VAT ({settings.defaultTaxRate}%)</span>
            <span className="font-mono text-zinc-700 font-medium">
              {formatMoney(tax, settings.currency)}
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-zinc-500">
              <span>Discount</span>
              <span className="font-mono text-emerald-600 font-medium">
                -{formatMoney(discountAmount, settings.currency)}
              </span>
            </div>
          )}

          {/* Dotted divider */}
          <div className="pt-2 border-b border-dashed border-zinc-300" />

          {/* Bold Total */}
          <div className="flex justify-between items-baseline pt-1">
            <span className="text-sm font-bold text-zinc-900">Total</span>
            <span
              id="cart-total-display"
              className="text-base font-bold text-zinc-900 font-mono"
            >
              {formatMoney(total, settings.currency)}
            </span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div>
          <div className="text-[11px] font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
            Payment Method
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'card', label: 'Card / POS', icon: CreditCard },
                { id: 'cash', label: 'Cash', icon: Banknote },
                { id: 'split', label: 'Split', icon: Split }
              ] as const
            ).map((pm) => {
              const Icon = pm.icon;
              const isSelected = paymentMethod === pm.id;
              return (
                <button
                  key={pm.id}
                  id={`payment-method-${pm.id}`}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#6D5AE6] bg-[#6D5AE6]/5 text-[#6D5AE6] font-semibold ring-1 ring-[#6D5AE6]/30'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{pm.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Buttons */}
        <div className="space-y-2">
          <button
            id="open-manual-payment-keypad-btn"
            type="button"
            onClick={() => setIsManualPaymentOpen(true)}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-zinc-700 hover:text-[#6D5AE6] bg-zinc-50 hover:bg-[#6D5AE6]/5 border border-zinc-200 hover:border-[#6D5AE6]/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            title="Open big numbers keypad to tender cash or enter manual payment"
          >
            <Calculator className="w-3.5 h-3.5 text-[#6D5AE6]" />
            <span>Manual Payment (Big Numbers Keypad)</span>
          </button>

          {/* Charge Primary Button */}
          <button
            id="charge-order-button"
            type="button"
            disabled={cart.length === 0}
            onClick={handleCharge}
            className={`w-full py-3 px-4 rounded-xl text-sm font-semibold text-white tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
              cart.length > 0
                ? 'bg-[#6D5AE6] hover:bg-[#5E4BD4] active:scale-[0.99]'
                : 'bg-zinc-300 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Charge Order</span>
            <span className="font-mono font-bold">{formatMoney(total, settings.currency)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
