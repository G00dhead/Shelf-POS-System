import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Check,
  Camera,
  Barcode as BarcodeIcon,
  CheckCircle2,
  X,
  PackagePlus,
  Calculator
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Category, Product } from '../types';
import { formatMoney } from '../utils/format';
import { playBarcodeScanBeep, playScanErrorBeep } from '../utils/audio';
import { BarcodeScannerModal } from '../components/BarcodeScannerModal';
import { BarcodeLabelModal } from '../components/BarcodeView';
import { QuickSaleModal } from '../components/QuickSaleModal';
import { DEFAULT_PRODUCT_IMAGE } from '../mockData';

const CATEGORIES: Category[] = [
  'All Products',
  'Groceries',
  'Toiletries & Personal Care',
  'Drinks & Beverages',
  'Bakery & Snacks',
  'Household & Cleaning',
  'Fresh & Frozen'
];

export const PosScreen: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    addToCart,
    cart,
    setMobileCartOpen,
    total,
    settings,
    scanBarcode,
    setIsManualPaymentOpen
  } = useApp();

  // Unified single search & barcode state
  const [searchTerm, setSearchTerm] = useState('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Scanner modal & notifications
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [activeBarcodeTagProduct, setActiveBarcodeTagProduct] = useState<Product | null>(null);
  const [scanToast, setScanToast] = useState<{ message: string; subtext: string } | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Global physical barcode scanner listener (e.g. handheld laser gun)
  useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in another input element
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') &&
        target !== searchInputRef.current
      ) {
        return;
      }

      const currentTime = Date.now();
      // Physical barcode scanners type characters rapidly (< 50ms per key)
      if (currentTime - lastKeyTime > 150) {
        buffer = '';
      }
      lastKeyTime = currentTime;

      if (e.key === 'Enter') {
        if (buffer.length >= 3) {
          e.preventDefault();
          executeBarcodeScan(buffer);
          buffer = '';
        }
      } else if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [products]);

  const executeProductAdd = (product: Product) => {
    addToCart(product);
    playBarcodeScanBeep();
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 600);
    showScanSuccessToast(
      `Added: ${product.name}`,
      `${formatMoney(product.price, settings.currency)} • SKU: ${product.sku}`
    );
  };

  const handleAddQuickSale = (data: {
    description: string;
    price: number;
    quantity: number;
    category: Category;
    image: string;
  }) => {
    const timestamp = Date.now();
    const quickSaleProduct: Product = {
      id: `qs-${timestamp}`,
      name: data.description,
      sku: `QS-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: `QS${timestamp.toString().slice(-8)}`,
      category: data.category,
      price: data.price,
      cost: Math.round(data.price * 0.7),
      stock: 999,
      image: data.image || DEFAULT_PRODUCT_IMAGE,
      unit: 'item',
      description: `Quick sale item: ${data.description}`
    };

    addToCart(quickSaleProduct, data.quantity);
    playBarcodeScanBeep();
    setJustAddedId(quickSaleProduct.id);
    setTimeout(() => setJustAddedId(null), 600);
    showScanSuccessToast(
      `Quick Sale: ${data.description}`,
      `${data.quantity > 1 ? `${data.quantity}x ` : ''}${formatMoney(data.price, settings.currency)} added to cart`
    );
  };

  const executeBarcodeScan = (codeToScan: string): boolean => {
    const clean = codeToScan.trim();
    if (!clean) return false;

    // Direct match against products in inventory
    const product = products.find(
      (p) =>
        p.barcode?.toLowerCase() === clean.toLowerCase() ||
        p.sku?.toLowerCase() === clean.toLowerCase()
    );

    if (product) {
      executeProductAdd(product);
      setSearchTerm('');
      return true;
    }

    const matched = scanBarcode(clean);
    if (matched) {
      const p = products.find(
        (item) =>
          item.barcode?.toLowerCase() === clean.toLowerCase() ||
          item.sku?.toLowerCase() === clean.toLowerCase()
      );
      if (p) executeProductAdd(p);
      setSearchTerm('');
      return true;
    } else {
      playScanErrorBeep();
      showScanSuccessToast('Product Not Found', `No item found matching "${clean}"`);
      return false;
    }
  };

  const showScanSuccessToast = (message: string, subtext: string) => {
    setScanToast({ message, subtext });
    setTimeout(() => {
      setScanToast((current) => (current?.message === message ? null : current));
    }, 2800);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All Products' || product.category === selectedCategory;
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        (product.barcode && product.barcode.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchTerm.trim();
    if (!clean) return;

    // Check exact barcode or SKU first
    const exactMatch = products.find(
      (p) =>
        p.barcode?.toLowerCase() === clean.toLowerCase() ||
        p.sku?.toLowerCase() === clean.toLowerCase()
    );

    if (exactMatch) {
      executeProductAdd(exactMatch);
      setSearchTerm('');
      return;
    }

    // If there is exactly one filtered product, add it directly
    if (filteredProducts.length === 1) {
      executeProductAdd(filteredProducts[0]);
      setSearchTerm('');
      return;
    }

    // Otherwise try barcode lookup
    executeBarcodeScan(clean);
  };

  const handleProductClick = (product: Product) => {
    executeProductAdd(product);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div id="pos-screen" className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
      {/* Toast Banner for Scanned Barcodes */}
      {scanToast && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 bg-zinc-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-zinc-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold leading-tight">{scanToast.message}</div>
            <div className="text-[11px] text-zinc-400 font-mono leading-tight mt-0.5">
              {scanToast.subtext}
            </div>
          </div>
        </div>
      )}

      {/* Unified Supermarket Search & Scanner Bar (Single unified input) */}
      <div className="px-4 sm:px-6 py-3 bg-zinc-50/80 border-b border-zinc-200 flex items-center gap-3 shrink-0">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            id="pos-unified-search-input"
            type="text"
            placeholder="Search products by name, SKU, or scan barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 text-xs bg-white text-zinc-900 placeholder:text-zinc-400 rounded-lg border border-zinc-300 focus:outline-none focus:border-[#6D5AE6] focus:ring-1 focus:ring-[#6D5AE6] shadow-2xs transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-0.5 rounded cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Manual Payment Keypad Trigger */}
        <button
          type="button"
          id="pos-keypad-pay-btn"
          onClick={() => setIsManualPaymentOpen(true)}
          className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
          title="Open manual payment keypad with big numbers"
        >
          <Calculator className="w-4 h-4 text-[#8B7CF8]" />
          <span className="hidden md:inline">Keypad Pay</span>
        </button>

        {/* Quick Sale Button */}
        <button
          type="button"
          id="pos-quick-sale-btn"
          onClick={() => setIsQuickSaleOpen(true)}
          className="px-3.5 py-2 bg-[#6D5AE6]/10 hover:bg-[#6D5AE6]/15 text-[#6D5AE6] border border-[#6D5AE6]/30 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
          title="Add an ad-hoc or unlisted item"
        >
          <PackagePlus className="w-4 h-4 text-[#6D5AE6]" />
          <span>Quick Sale</span>
        </button>

        {/* Camera Scanner Trigger */}
        <button
          type="button"
          id="pos-scan-camera-btn"
          onClick={() => setIsCameraModalOpen(true)}
          className="px-3.5 py-2 bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-2xs shrink-0"
          title="Open camera barcode scanner"
        >
          <Camera className="w-4 h-4 text-[#6D5AE6]" />
          <span className="hidden sm:inline">Scan Camera</span>
        </button>
      </div>

      {/* Category Filter Pills (Single row) */}
      <div className="px-4 sm:px-6 py-2.5 border-b border-zinc-100 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 bg-white">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`category-filter-${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#6D5AE6] text-white shadow-xs font-semibold'
                  : 'bg-zinc-50 text-zinc-600 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100/80'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Product Grid Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {filteredProducts.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-zinc-400">
            <p className="text-sm font-medium text-zinc-700">No supermarket products found</p>
            <p className="text-xs text-zinc-400 mt-1">
              Try searching with another keyword or select another category filter.
            </p>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="mt-3 px-3 py-1.5 text-xs font-semibold text-[#6D5AE6] bg-[#6D5AE6]/10 rounded-lg hover:bg-[#6D5AE6]/20 transition-colors cursor-pointer"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const cartItem = cart.find((item) => item.product.id === product.id);
              const isJustAdded = justAddedId === product.id;

              return (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  className={`group relative bg-white border rounded-xl p-3 flex flex-col justify-between transition-all select-none hover:border-[#6D5AE6]/50 hover:shadow-xs ${
                    cartItem ? 'border-[#6D5AE6]/50 ring-1 ring-[#6D5AE6]/30' : 'border-zinc-200'
                  }`}
                >
                  {/* Square Image container with rounded corners */}
                  <div
                    onClick={() => handleProductClick(product)}
                    className="w-full aspect-square bg-zinc-50 rounded-lg overflow-hidden relative mb-2.5 flex items-center justify-center border border-zinc-100 cursor-pointer"
                  >
                    <img
                      src={product.image || DEFAULT_PRODUCT_IMAGE}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                      }}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Low stock badge */}
                    {product.stock <= 15 && (
                      <span className="absolute top-2 left-2 bg-amber-500/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                        {product.stock} left
                      </span>
                    )}

                    {/* In-cart count pill */}
                    {cartItem && (
                      <span className="absolute top-2 right-2 bg-[#6D5AE6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                        <span>{cartItem.quantity}</span>
                      </span>
                    )}

                    {/* Unit badge */}
                    {product.unit && (
                      <span className="absolute bottom-2 left-2 bg-zinc-900/80 backdrop-blur-xs text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
                        {product.unit}
                      </span>
                    )}

                    {/* Quick add feedback animation overlay */}
                    {isJustAdded && (
                      <div className="absolute inset-0 bg-[#6D5AE6]/25 backdrop-blur-[1px] flex items-center justify-center animate-in fade-in zoom-in-75 duration-100">
                        <div className="bg-white text-[#6D5AE6] p-2 rounded-full shadow-md font-bold">
                          <Plus className="w-5 h-5 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-1">
                    <div
                      onClick={() => handleProductClick(product)}
                      className="cursor-pointer"
                    >
                      <h3 className="text-xs font-bold text-zinc-900 group-hover:text-[#6D5AE6] transition-colors line-clamp-1 leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-[10px] text-zinc-400 truncate">
                        {product.category}
                      </p>
                    </div>

                    {/* Price and Barcode Tag preview action */}
                    <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
                      <span className="text-xs font-bold text-zinc-900 font-mono">
                        {formatMoney(product.price, settings.currency)}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveBarcodeTagProduct(product);
                          }}
                          className="p-1 text-zinc-400 hover:text-[#6D5AE6] hover:bg-[#6D5AE6]/10 rounded transition-colors"
                          title={`View & Print Barcode Label for ${product.name}`}
                          aria-label="View barcode"
                        >
                          <BarcodeIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleProductClick(product)}
                          className="p-1 text-zinc-500 hover:text-white hover:bg-[#6D5AE6] rounded transition-colors"
                          title="Add to register"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile Sticky "View Cart" Floating Bar */}
      {totalCartCount > 0 && (
        <div className="lg:hidden p-4 bg-white border-t border-zinc-200 shrink-0">
          <button
            id="mobile-view-cart-bar-btn"
            onClick={() => setMobileCartOpen(true)}
            className="w-full py-3 px-4 rounded-xl bg-[#6D5AE6] text-white text-sm font-semibold flex items-center justify-between shadow-md active:scale-[0.99] transition-transform cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
                {totalCartCount}
              </span>
              <span>View Current Cart</span>
            </div>
            <span className="font-mono font-bold">
              {formatMoney(total, settings.currency)}
            </span>
          </button>
        </div>
      )}

      {/* Camera Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onScan={executeBarcodeScan}
        products={products}
      />

      {/* Shelf Barcode Label Modal */}
      {activeBarcodeTagProduct && (
        <BarcodeLabelModal
          name={activeBarcodeTagProduct.name}
          sku={activeBarcodeTagProduct.sku}
          barcode={activeBarcodeTagProduct.barcode}
          price={activeBarcodeTagProduct.price}
          currency={settings.currency}
          onClose={() => setActiveBarcodeTagProduct(null)}
        />
      )}

      {/* Quick Sale Ad-hoc Item Modal */}
      <QuickSaleModal
        isOpen={isQuickSaleOpen}
        onClose={() => setIsQuickSaleOpen(false)}
        onAddQuickSale={handleAddQuickSale}
        currency={settings.currency}
      />
    </div>
  );
};
