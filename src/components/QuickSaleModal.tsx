import React, { useState, useEffect, useRef } from 'react';
import { X, PackagePlus, Plus, Minus, Tag, DollarSign, ShoppingBag } from 'lucide-react';
import { Category } from '../types';
import { formatMoney } from '../utils/format';
import { DEFAULT_PRODUCT_IMAGE } from '../mockData';
import goldenPennySemoImg from '../assets/images/golden_penny_semo_1788855525454.jpg';
import sweetBreadImg from '../assets/images/fresh_sweet_bread_1788855889171.jpg';
import maltinaDrinkImg from '../assets/images/maltina_can_drink_1788855627111.jpg';
import crateEggsImg from '../assets/images/crate_of_eggs_1788855906616.jpg';
import morningFreshImg from '../assets/images/morning_fresh_liquid_1788855609078.jpg';
import dettolSoapImg from '../assets/images/dettol_cool_soap_1788855590633.jpg';

interface QuickSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuickSale: (data: {
    description: string;
    price: number;
    quantity: number;
    category: Category;
    image: string;
  }) => void;
  currency: string;
}

const CATEGORY_IMAGES: Record<string, string> = {
  Groceries: goldenPennySemoImg,
  'Bakery & Snacks': sweetBreadImg,
  'Drinks & Beverages': maltinaDrinkImg,
  'Fresh & Frozen': crateEggsImg,
  'Household & Cleaning': morningFreshImg,
  'Toiletries & Personal Care': dettolSoapImg
};

const AVAILABLE_CATEGORIES: Category[] = [
  'Groceries',
  'Bakery & Snacks',
  'Drinks & Beverages',
  'Fresh & Frozen',
  'Household & Cleaning',
  'Toiletries & Personal Care'
];

const PRESET_DESCRIPTIONS = [
  'Seasonal Fresh Produce',
  'Custom Bakery Item',
  'Imported Specialty Item',
  'Reusable Carry Bag',
  'Ad-hoc Deli Service'
];

export const QuickSaleModal: React.FC<QuickSaleModalProps> = ({
  isOpen,
  onClose,
  onAddQuickSale,
  currency
}) => {
  const [description, setDescription] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState<Category>('Groceries');
  const [error, setError] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  // Reset form and focus on open
  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setPriceInput('');
      setQuantity(1);
      setCategory('Groceries');
      setError('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const parsedPrice = parseFloat(priceInput) || 0;
  const lineTotal = parsedPrice * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDesc = description.trim();

    if (!cleanDesc) {
      setError('Please provide a description or item name');
      return;
    }

    if (parsedPrice <= 0) {
      setError('Please enter a valid price greater than 0');
      return;
    }

    const selectedImage = CATEGORY_IMAGES[category] || DEFAULT_PRODUCT_IMAGE;

    onAddQuickSale({
      description: cleanDesc,
      price: parsedPrice,
      quantity: Math.max(1, quantity),
      category,
      image: selectedImage
    });

    onClose();
  };

  const handlePricePreset = (addAmount: number) => {
    const current = parseFloat(priceInput) || 0;
    setPriceInput(String(current + addAmount));
    setError('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="quick-sale-modal"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-full max-w-lg overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6D5AE6]/10 text-[#6D5AE6] flex items-center justify-center shrink-0">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 leading-tight">Quick Sale Item</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Ring up an unlisted or ad-hoc product directly into the active cart
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-700 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Item Description / Name <span className="text-red-500">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              id="quick-sale-description-input"
              placeholder="e.g. Seasonal Produce, Custom Bakery Loaf..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3.5 py-2 text-sm bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#6D5AE6] focus:ring-1 focus:ring-[#6D5AE6] transition-all"
            />

            {/* Quick Description Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {PRESET_DESCRIPTIONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setDescription(preset);
                    if (error) setError('');
                  }}
                  className="px-2 py-0.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded text-[11px] font-medium transition-colors cursor-pointer"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Quantity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Unit Price ({currency}) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">
                  {currency === 'NGN' ? '₦' : currency}
                </span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  id="quick-sale-price-input"
                  placeholder="0.00"
                  value={priceInput}
                  onChange={(e) => {
                    setPriceInput(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full pl-8 pr-3 py-2 text-sm font-mono font-semibold bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#6D5AE6] focus:ring-1 focus:ring-[#6D5AE6] transition-all"
                />
              </div>

              {/* Price shortcut increments */}
              <div className="flex items-center gap-1 mt-2">
                {[500, 1000, 2500, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handlePricePreset(amt)}
                    className="flex-1 py-1 bg-zinc-50 hover:bg-[#6D5AE6]/10 hover:text-[#6D5AE6] border border-zinc-200 hover:border-[#6D5AE6]/40 rounded text-[10px] font-mono font-semibold text-zinc-600 transition-colors cursor-pointer text-center"
                  >
                    +{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Quantity
              </label>
              <div className="flex items-center border border-zinc-300 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 text-zinc-500 hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-40"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full py-2 text-center text-sm font-bold font-mono text-zinc-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2.5 text-zinc-500 hover:bg-zinc-100 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="pt-1">
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {AVAILABLE_CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left truncate transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#6D5AE6] text-white border-[#6D5AE6] shadow-2xs font-semibold'
                        : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Line Item Total Summary Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900 text-xs">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>
                Adding <span className="font-bold font-mono">{quantity}</span> item{quantity > 1 ? 's' : ''} to cart
              </span>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-emerald-700 font-medium uppercase tracking-wider">Line Total</div>
              <div className="text-sm font-bold font-mono text-emerald-950">
                {formatMoney(lineTotal, currency)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="add-quick-sale-to-cart-btn"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#6D5AE6] hover:bg-[#5E4BD4] rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Register</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
