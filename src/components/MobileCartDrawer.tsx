import React from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CartPanel } from './CartPanel';

export const MobileCartDrawer: React.FC = () => {
  const { mobileCartOpen, setMobileCartOpen } = useApp();

  if (!mobileCartOpen) return null;

  return (
    <div
      id="mobile-cart-drawer-backdrop"
      className="fixed inset-0 z-50 bg-zinc-900/50 backdrop-blur-xs flex flex-col justify-end lg:hidden animate-in fade-in duration-150"
    >
      <div
        id="mobile-cart-sheet"
        className="bg-white rounded-t-2xl max-h-[85vh] h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200 border-t border-zinc-200"
      >
        {/* Mobile sheet drag handle and close bar */}
        <div className="px-5 py-3 border-b border-zinc-100 flex items-center justify-between bg-zinc-50 shrink-0">
          <div className="w-12 h-1 bg-zinc-300 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          <span className="text-xs font-bold text-zinc-900 pt-1">Point of Sale Cart</span>
          <button
            onClick={() => setMobileCartOpen(false)}
            className="p-1 text-zinc-500 hover:text-zinc-800 rounded-md"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Re-use CartPanel */}
        <div className="flex-1 overflow-hidden">
          <CartPanel isMobile={true} />
        </div>
      </div>
    </div>
  );
};
