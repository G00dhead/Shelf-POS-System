import React, { useState } from 'react';
import { Tag, Percent, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatMoney } from '../utils/format';
import { DEFAULT_PRODUCT_IMAGE } from '../mockData';

const CATEGORIES = [
  'All',
  'Groceries',
  'Toiletries & Personal Care',
  'Drinks & Beverages',
  'Bakery & Snacks',
  'Household & Cleaning',
  'Fresh & Frozen'
];

export const PricingEngineScreen: React.FC = () => {
  const { products, updateProductPrice, applyBulkCategoryDiscount, settings } = useApp();

  const [bulkCategory, setBulkCategory] = useState<string>('Groceries');
  const [bulkDiscountPercent, setBulkDiscountPercent] = useState<number>(10);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  const handleBulkApply = () => {
    applyBulkCategoryDiscount(bulkCategory, bulkDiscountPercent);
    setSavedBanner(`Applied ${bulkDiscountPercent}% discount to ${bulkCategory}!`);
    setTimeout(() => setSavedBanner(null), 3000);
  };

  return (
    <div id="pricing-engine-screen" className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Supermarket Pricing Engine</h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Configure dynamic grocery markups, supermarket markdown rules, and bulk departmental discounts
        </p>
      </div>

      {savedBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{savedBanner}</span>
        </div>
      )}

      {/* Bulk Campaign Banner */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#6D5AE6]/10 text-[#6D5AE6] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900">
              Bulk Department Promotional Rule
            </h4>
            <p className="text-[11px] text-zinc-500">
              Instantly adjust retail pricing across an entire supermarket aisle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={bulkCategory}
            onChange={(e) => setBulkCategory(e.target.value)}
            className="px-3 py-1.5 border border-zinc-200 rounded-lg text-xs bg-white text-zinc-800 focus:outline-none focus:border-[#6D5AE6]"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-lg px-2 py-1 text-xs">
            <input
              type="number"
              min="0"
              max="90"
              value={bulkDiscountPercent}
              onChange={(e) => setBulkDiscountPercent(parseInt(e.target.value, 10) || 0)}
              className="w-12 font-mono text-center focus:outline-none"
            />
            <span className="text-zinc-400 font-bold">% off</span>
          </div>

          <button
            onClick={handleBulkApply}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#6D5AE6] hover:bg-[#5E4BD4] rounded-lg transition-colors cursor-pointer"
          >
            Apply Rule
          </button>
        </div>
      </div>

      {/* Pricing Table - Zero Horizontal Scrolling, Stacked Cells */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-xs">
        <div className="w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/70 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-3 sm:px-4">Item & Department</th>
                <th className="hidden md:table-cell py-3 px-3">Base Price & Discount Rule</th>
                <th className="py-3 px-3 sm:px-4 text-right">Effective POS Price & Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((product) => {
                const discountP = product.discountPercent || 0;
                const effectivePrice =
                  discountP > 0 ? product.price * (1 - discountP / 100) : product.price;
                const margin =
                  effectivePrice > 0
                    ? (((effectivePrice - product.cost) / effectivePrice) * 100).toFixed(0)
                    : '0';

                return (
                  <tr
                    key={product.id}
                    className="even:bg-zinc-50/70 odd:bg-white hover:bg-zinc-100/80 transition-colors group"
                  >
                    {/* Primary Identifier & Stacked Metadata */}
                    <td className="py-3 px-3 sm:px-4 min-w-0">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <img
                          src={product.image || DEFAULT_PRODUCT_IMAGE}
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                          }}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-lg object-cover bg-zinc-100 border border-zinc-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-zinc-900 truncate leading-snug text-xs sm:text-sm">
                            {product.name}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-zinc-500 font-mono mt-0.5 flex items-center gap-1.5 flex-wrap">
                            <span className="font-sans font-medium text-zinc-600">
                              {product.category}
                            </span>
                            <span className="text-zinc-300">•</span>
                            <span className="text-zinc-500">{product.sku}</span>
                          </div>

                          {/* Mobile-only compact price/discount quick adjuster */}
                          <div className="md:hidden mt-2 flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded px-1.5 py-0.5 font-mono text-[11px]">
                              <span className="text-zinc-400 font-bold">₦</span>
                              <input
                                type="number"
                                step="10"
                                value={product.price}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  updateProductPrice(product.id, val);
                                }}
                                className="w-16 bg-transparent focus:outline-none font-bold text-zinc-800"
                              />
                            </div>
                            <select
                              value={discountP > 0 ? 'percent' : 'none'}
                              onChange={(e) => {
                                const newPercent = e.target.value === 'percent' ? 10 : 0;
                                updateProductPrice(product.id, product.price, newPercent);
                              }}
                              className="px-1.5 py-0.5 border border-zinc-200 rounded text-[10px] text-zinc-700 bg-zinc-50 focus:outline-none"
                            >
                              <option value="none">No Disc.</option>
                              <option value="percent">10% Off</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Desktop Base Price & Active Discount Controls */}
                    <td className="hidden md:table-cell py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 font-mono">
                          <span className="text-zinc-400 font-bold">₦</span>
                          <input
                            type="number"
                            step="10"
                            value={product.price}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              updateProductPrice(product.id, val);
                            }}
                            className="w-24 px-2 py-1 border border-zinc-200 rounded text-xs font-mono font-medium focus:outline-none focus:border-[#6D5AE6]"
                          />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <select
                            value={discountP > 0 ? 'percent' : 'none'}
                            onChange={(e) => {
                              const newPercent = e.target.value === 'percent' ? 10 : 0;
                              updateProductPrice(product.id, product.price, newPercent);
                            }}
                            className="px-2 py-1 border border-zinc-200 rounded text-xs text-zinc-700 focus:outline-none focus:border-[#6D5AE6]"
                          >
                            <option value="none">No Discount</option>
                            <option value="percent">% Percentage</option>
                          </select>

                          {discountP > 0 && (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min="1"
                                max="90"
                                value={discountP}
                                onChange={(e) => {
                                  const newP = parseInt(e.target.value, 10) || 0;
                                  updateProductPrice(product.id, product.price, newP);
                                }}
                                className="w-14 px-1.5 py-1 border border-zinc-200 rounded text-xs font-mono text-center focus:outline-none focus:border-[#6D5AE6]"
                              />
                              <span className="text-[11px] text-zinc-400">%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Right-Aligned Stacked Financials (Effective Price + Cost + Gross Margin) */}
                    <td className="py-3 px-3 sm:px-4 text-right shrink-0">
                      <div className="font-mono font-bold text-xs sm:text-sm text-zinc-900 leading-snug">
                        {formatMoney(effectivePrice, settings.currency)}
                        {discountP > 0 && (
                          <span className="text-[10px] text-zinc-400 line-through ml-1.5 font-normal">
                            {formatMoney(product.price, settings.currency)}
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[10px] text-zinc-400 mt-0.5 leading-snug flex items-center justify-end gap-1.5 flex-wrap">
                        <span>Cost: {formatMoney(product.cost, settings.currency)}</span>
                        <span className="text-zinc-300">•</span>
                        <span className="font-sans font-semibold text-emerald-600">
                          +{margin}% margin
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
