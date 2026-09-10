import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Barcode as BarcodeIcon,
  X,
  Check,
  Tag,
  Sparkles,
  Percent,
  TrendingUp,
  Printer,
  MoreVertical,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Category, Product } from '../types';
import { formatMoney } from '../utils/format';
import { BarcodeView, BarcodeLabelModal } from '../components/BarcodeView';
import { DEFAULT_PRODUCT_IMAGE } from '../mockData';

const ALL_CATEGORIES: (Category | 'All')[] = [
  'All',
  'Groceries',
  'Toiletries & Personal Care',
  'Drinks & Beverages',
  'Bakery & Snacks',
  'Household & Cleaning',
  'Fresh & Frozen'
];

const PRESET_UNITS = [
  '2kg Bag',
  '1kg Pack',
  '500g Pack',
  'Carton (40)',
  'Carton (24)',
  'Pack of 3',
  'Pack of 6',
  'Pack of 12',
  'Crate (30)',
  '1 Litre Bottle',
  '400ml Bottle',
  '750ml Bottle',
  '125g Tin',
  '140g Tube',
  'Jumbo Loaf',
  'Single Piece'
];

export const CatalogScreen: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, settings, stockAlerts, setCurrentScreen } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [barcodeModalProduct, setBarcodeModalProduct] = useState<Product | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [activeMenuProductId, setActiveMenuProductId] = useState<string | null>(null);

  // New product form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Groceries');
  const [barcode, setBarcode] = useState('');
  const [sku, setSku] = useState('');
  const [unit, setUnit] = useState('1kg Pack');
  const [price, setPrice] = useState('3500');
  const [cost, setCost] = useState('2800');
  const [stock, setStock] = useState('50');
  const [reorderThreshold, setReorderThreshold] = useState('15');
  const [image, setImage] = useState(DEFAULT_PRODUCT_IMAGE);
  const [description, setDescription] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch =
        search.trim() === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        (p.barcode && p.barcode.includes(search.trim()));
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, search]);

  const handleOpenAdd = () => {
    setName('');
    setCategory('Groceries');
    const randomEan = `6151100${Math.floor(100000 + Math.random() * 900000)}`;
    setBarcode(randomEan);
    setSku(`GRO-SKU-${Math.floor(100 + Math.random() * 900)}`);
    setUnit('1kg Pack');
    setPrice('3500');
    setCost('2700');
    setStock('40');
    setReorderThreshold('15');
    setImage(DEFAULT_PRODUCT_IMAGE);
    setDescription('');
    setIsAddModalOpen(true);
  };

  const handleGenerateBarcode = () => {
    setBarcode(`6151100${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProduct({
      name: name.trim(),
      category,
      barcode: barcode.trim() || `6151100${Math.floor(100000 + Math.random() * 900000)}`,
      sku: sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      unit: unit.trim() || 'Unit',
      price: parseFloat(price) || 0,
      cost: parseFloat(cost) || 0,
      stock: parseInt(stock, 10) || 0,
      reorderThreshold: parseInt(reorderThreshold, 10) || 15,
      image: image.trim() || DEFAULT_PRODUCT_IMAGE,
      description: description.trim()
    });

    setIsAddModalOpen(false);
  };

  const handleStartEdit = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      category: editingProduct.category,
      barcode: editingProduct.barcode,
      sku: editingProduct.sku,
      unit: editingProduct.unit,
      price: Number(editingProduct.price),
      cost: Number(editingProduct.cost),
      stock: Number(editingProduct.stock),
      reorderThreshold: Number(editingProduct.reorderThreshold) || 15,
      image: editingProduct.image.trim() || DEFAULT_PRODUCT_IMAGE,
      description: editingProduct.description
    });

    setEditingProduct(null);
  };

  return (
    <div id="catalog-screen" className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
              Admin Supermarket Catalog & Stock
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#6D5AE6]/10 text-[#6D5AE6] font-mono font-semibold text-[11px]">
              {products.length} Items Live
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Admin management for groceries, toiletries, EAN-13 barcodes, shelf tags, and inventory
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-[#6D5AE6] hover:bg-[#5E4BD4] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Low Stock Reorder Threshold Alert Banner */}
      {stockAlerts.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-amber-950">
                {stockAlerts.length} Catalog Item{stockAlerts.length > 1 ? 's' : ''} Below Reorder Point
              </div>
              <p className="text-amber-800 text-[11px] mt-0.5">
                Background inventory daemon detected items with quantities below their defined reorder thresholds.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentScreen('alerts')}
            className="px-3 py-1.5 font-semibold text-amber-950 bg-amber-200/70 hover:bg-amber-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <span>View Alerts & Restock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter by name, barcode, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 focus:bg-white text-zinc-900 placeholder:text-zinc-400 rounded-lg border border-zinc-200 focus:outline-none focus:border-[#6D5AE6]"
          />
        </div>
      </div>

      {/* Products Table (High-density, completely eliminates horizontal scrolling across viewports) */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-xs">
        {/* Batch Selection Banner */}
        {selectedProductIds.length > 0 && (
          <div className="bg-[#6D5AE6]/10 border-b border-[#6D5AE6]/20 px-4 py-2 flex items-center justify-between text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2 font-medium text-[#6D5AE6]">
              <span className="w-2 h-2 rounded-full bg-[#6D5AE6] animate-pulse" />
              <span>
                {selectedProductIds.length} item{selectedProductIds.length === 1 ? '' : 's'} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const first = products.find((p) => selectedProductIds.includes(p.id));
                  if (first) setBarcodeModalProduct(first);
                }}
                className="px-3 py-1.5 min-h-[36px] rounded-lg bg-[#6D5AE6] text-white font-medium hover:bg-[#5B48D9] flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Shelf Tags</span>
              </button>
              <button
                onClick={() => setSelectedProductIds([])}
                className="px-2.5 py-1.5 min-h-[36px] text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
              >
                Deselect
              </button>
            </div>
          </div>
        )}

        <div className="w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50/70 border-b border-zinc-200 text-zinc-500 font-semibold uppercase text-[11px] tracking-wider">
                <th className="w-10 sm:w-12 px-2 py-3 text-center shrink-0">
                  <label className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer mx-auto">
                    <input
                      type="checkbox"
                      checked={
                        filteredProducts.length > 0 &&
                        selectedProductIds.length === filteredProducts.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProductIds(filteredProducts.map((p) => p.id));
                        } else {
                          setSelectedProductIds([]);
                        }
                      }}
                      className="w-4 h-4 rounded text-[#6D5AE6] border-zinc-300 focus:ring-[#6D5AE6] cursor-pointer"
                      title="Select all items"
                    />
                  </label>
                </th>
                <th className="py-3 px-2 sm:px-4">Item & Department</th>
                <th className="hidden sm:table-cell w-28 lg:w-32 py-3 px-3">In Stock</th>
                <th className="w-28 sm:w-36 py-3 px-2 sm:px-4 text-right shrink-0">Pricing</th>
                <th className="w-11 sm:w-28 py-3 px-1 sm:px-3 text-right shrink-0">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-400">
                    No items match the current search or category filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const marginPercent =
                    p.price > 0 ? Math.round(((p.price - p.cost) / p.price) * 100) : 0;
                  const threshold = typeof p.reorderThreshold === 'number' ? p.reorderThreshold : 15;
                  const isCritical = p.stock === 0 || p.stock <= Math.floor(threshold / 2);
                  const isLowStock = p.stock <= threshold;

                  return (
                    <tr
                      key={p.id}
                      className="even:bg-zinc-50/70 odd:bg-white hover:bg-zinc-100/80 transition-colors group"
                    >
                      {/* Selection Checkbox with 40px touch target */}
                      <td className="w-10 sm:w-12 px-2 py-3 text-center shrink-0">
                        <label className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer mx-auto">
                          <input
                            type="checkbox"
                            checked={selectedProductIds.includes(p.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProductIds((prev) => [...prev, p.id]);
                              } else {
                                setSelectedProductIds((prev) => prev.filter((id) => id !== p.id));
                              }
                            }}
                            className="w-4 h-4 rounded text-[#6D5AE6] border-zinc-300 focus:ring-[#6D5AE6] cursor-pointer"
                          />
                        </label>
                      </td>

                      {/* Primary Identifier, Title & Stacked Metadata */}
                      <td className="py-3 px-2 sm:px-4 min-w-0">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <img
                            src={p.image || DEFAULT_PRODUCT_IMAGE}
                            alt={p.name}
                            onError={(e) => {
                              e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                            }}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover border border-zinc-200 bg-zinc-100 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-zinc-900 truncate leading-snug text-xs sm:text-sm">
                              {p.name}
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-zinc-500 flex flex-wrap items-center gap-1.5 mt-0.5">
                              <span className="font-medium text-zinc-600 truncate max-w-[100px] sm:max-w-none">
                                {p.category}
                              </span>
                              <span className="text-zinc-300">•</span>
                              <span className="font-mono text-zinc-600 flex items-center gap-0.5">
                                <BarcodeIcon className="w-3 h-3 text-[#6D5AE6] shrink-0" />
                                <span className="truncate">{p.barcode || p.sku}</span>
                              </span>
                              <span className="text-zinc-300 hidden sm:inline">•</span>
                              <span className="text-zinc-500 hidden sm:inline">{p.unit || 'Standard'}</span>
                            </div>
                            {/* Mobile-only stock dot underneath title */}
                            <div className="sm:hidden flex items-center gap-1.5 mt-1">
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  isCritical
                                    ? 'bg-red-500'
                                    : isLowStock
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                              />
                              <span className="text-[10px] font-mono text-zinc-500 font-medium">
                                {p.stock} units in stock · Alert: ≤{threshold}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* In Stock & Status Indicator (Desktop / Tablet) */}
                      <td className="hidden sm:table-cell w-28 lg:w-32 py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isCritical
                                ? 'bg-red-500 ring-2 ring-red-100'
                                : isLowStock
                                ? 'bg-amber-500 ring-2 ring-amber-100'
                                : 'bg-emerald-500 ring-2 ring-emerald-100'
                            }`}
                          />
                          <span className="font-mono text-xs font-semibold text-zinc-800">
                            {p.stock} <span className="text-[11px] font-normal text-zinc-400">units</span>
                          </span>
                        </div>
                        <div className="text-[10px] mt-0.5">
                          {isCritical ? (
                            <span className="text-red-600 font-medium">Critical (≤ {Math.floor(threshold / 2)})</span>
                          ) : isLowStock ? (
                            <span className="text-amber-600 font-medium">Below point (≤ {threshold})</span>
                          ) : (
                            <span className="text-zinc-400">Optimal (&gt; {threshold})</span>
                          )}
                        </div>
                      </td>

                      {/* Optical Right-Aligned Stacked Pricing & Margin */}
                      <td className="w-28 sm:w-36 py-3 px-2 sm:px-4 text-right shrink-0">
                        <div className="font-mono font-bold text-xs sm:text-sm text-zinc-900 leading-snug">
                          {formatMoney(p.price, settings.currency)}
                        </div>
                        <div className="font-mono text-[10px] text-zinc-400 mt-0.5 leading-snug flex items-center justify-end gap-1 flex-wrap">
                          <span>Cost: {formatMoney(p.cost, settings.currency)}</span>
                          <span className="text-emerald-600 font-semibold font-sans">
                            +{marginPercent}%
                          </span>
                        </div>
                      </td>

                      {/* Actions: Quick buttons on desktop, 40px touch context menu on mobile */}
                      <td className="w-11 sm:w-28 py-3 px-1 sm:px-3 text-right shrink-0 relative">
                        {/* Desktop Quick CTAs */}
                        <div className="hidden sm:flex items-center justify-end gap-1">
                          <button
                            onClick={() => setBarcodeModalProduct(p)}
                            className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center text-zinc-400 hover:text-[#6D5AE6] hover:bg-[#6D5AE6]/10 rounded-lg transition-colors cursor-pointer"
                            title="Print Shelf Barcode Tag"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStartEdit(p)}
                            className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Product Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove "${p.name}" from supermarket catalog?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Mobile 3-Dots More Options Menu with 40px touch target */}
                        <div className="sm:hidden flex items-center justify-end">
                          <button
                            onClick={() =>
                              setActiveMenuProductId(activeMenuProductId === p.id ? null : p.id)
                            }
                            className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
                            title="More Options"
                            aria-label="More Options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Pinned Context Popover */}
                          {activeMenuProductId === p.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setActiveMenuProductId(null)}
                              />
                              <div className="absolute right-2 top-11 z-50 w-52 bg-white rounded-xl shadow-xl border border-zinc-200 py-1 text-xs text-left animate-in fade-in zoom-in-95 duration-100">
                                <div className="px-3 py-1.5 border-b border-zinc-100 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                                  Quick Actions
                                </div>
                                <button
                                  onClick={() => {
                                    setActiveMenuProductId(null);
                                    setBarcodeModalProduct(p);
                                  }}
                                  className="w-full px-3 py-2.5 min-h-[40px] flex items-center gap-2.5 text-zinc-700 hover:bg-zinc-50 font-medium transition-colors cursor-pointer"
                                >
                                  <Printer className="w-4 h-4 text-[#6D5AE6] shrink-0" />
                                  <span>Print Shelf Tag</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuProductId(null);
                                    handleStartEdit(p);
                                  }}
                                  className="w-full px-3 py-2.5 min-h-[40px] flex items-center gap-2.5 text-zinc-700 hover:bg-zinc-50 font-medium transition-colors cursor-pointer"
                                >
                                  <Edit2 className="w-4 h-4 text-zinc-600 shrink-0" />
                                  <span>Edit Details</span>
                                </button>
                                <div className="h-px bg-zinc-100 my-1" />
                                <button
                                  onClick={() => {
                                    setActiveMenuProductId(null);
                                    if (confirm(`Remove "${p.name}" from supermarket catalog?`)) {
                                      deleteProduct(p.id);
                                    }
                                  }}
                                  className="w-full px-3 py-2.5 min-h-[40px] flex items-center gap-2.5 text-red-600 hover:bg-red-50 font-medium transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500 shrink-0" />
                                  <span>Delete Product</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#6D5AE6]/10 text-[#6D5AE6] flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Add Supermarket Item</h3>
                  <p className="text-[11px] text-zinc-400">
                    Register new grocery, toiletry, or beverage merchandise
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewProduct} className="p-5 overflow-y-auto space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Product Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dangote Sugar 1kg or Dettol Cool Soap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#6D5AE6]"
                />
              </div>

              {/* Category & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Supermarket Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#6D5AE6] bg-white"
                  >
                    <option value="Groceries">Groceries</option>
                    <option value="Toiletries & Personal Care">Toiletries & Personal Care</option>
                    <option value="Drinks & Beverages">Drinks & Beverages</option>
                    <option value="Bakery & Snacks">Bakery & Snacks</option>
                    <option value="Household & Cleaning">Household & Cleaning</option>
                    <option value="Fresh & Frozen">Fresh & Frozen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Packaging Unit
                  </label>
                  <input
                    type="text"
                    list="preset-units"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. 1kg Pack, Carton (40)"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#6D5AE6]"
                  />
                  <datalist id="preset-units">
                    {PRESET_UNITS.map((u) => (
                      <option key={u} value={u} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Barcode & SKU with auto-generate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-zinc-700">
                      EAN-13 Barcode *
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateBarcode}
                      className="text-[10px] text-[#6D5AE6] hover:underline flex items-center gap-0.5"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      Auto-generate
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="6151100..."
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#6D5AE6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Internal SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="GRO-GP-001"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#6D5AE6]"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Selling Price (₦)
                  </label>
                  <input
                    type="number"
                    step="10"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#6D5AE6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Cost Price (₦)
                  </label>
                  <input
                    type="number"
                    step="10"
                    required
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#6D5AE6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#6D5AE6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Reorder Point
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={reorderThreshold}
                    onChange={(e) => setReorderThreshold(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#6D5AE6]"
                    title="Alert triggers if stock drops below or equal to this count"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#6D5AE6]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key product attributes, ingredients, or brand origin..."
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#6D5AE6]"
                />
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#6D5AE6] hover:bg-[#5E4BD4] rounded-lg transition-colors cursor-pointer"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#6D5AE6]/10 text-[#6D5AE6] flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Edit Product</h3>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    ID: {editingProduct.id} • {editingProduct.sku}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#6D5AE6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as Category
                      })
                    }
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#6D5AE6] bg-white"
                  >
                    <option value="Groceries">Groceries</option>
                    <option value="Toiletries & Personal Care">Toiletries & Personal Care</option>
                    <option value="Drinks & Beverages">Drinks & Beverages</option>
                    <option value="Bakery & Snacks">Bakery & Snacks</option>
                    <option value="Household & Cleaning">Household & Cleaning</option>
                    <option value="Fresh & Frozen">Fresh & Frozen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={editingProduct.unit || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, unit: e.target.value })
                    }
                    placeholder="e.g. 1kg Pack"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#6D5AE6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Barcode (EAN-13)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.barcode || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, barcode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#6D5AE6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={editingProduct.sku}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, sku: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#6D5AE6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Retail Price (₦)
                  </label>
                  <input
                    type="number"
                    step="10"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: parseFloat(e.target.value) || 0
                      })
                    }
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#6D5AE6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Cost Price (₦)
                  </label>
                  <input
                    type="number"
                    step="10"
                    required
                    value={editingProduct.cost}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        cost: parseFloat(e.target.value) || 0
                      })
                    }
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#6D5AE6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock: parseInt(e.target.value, 10) || 0
                      })
                    }
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#6D5AE6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Reorder Point
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingProduct.reorderThreshold ?? 15}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        reorderThreshold: parseInt(e.target.value, 10) || 0
                      })
                    }
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#6D5AE6]"
                    title="Defines alert threshold in catalog background checks"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  value={editingProduct.image}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, image: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#6D5AE6]"
                />
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#6D5AE6] hover:bg-[#5E4BD4] rounded-lg transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Shelf Label Modal */}
      {barcodeModalProduct && (
        <BarcodeLabelModal
          name={barcodeModalProduct.name}
          sku={barcodeModalProduct.sku}
          barcode={barcodeModalProduct.barcode}
          price={barcodeModalProduct.price}
          currency={settings.currency}
          onClose={() => setBarcodeModalProduct(null)}
        />
      )}
    </div>
  );
};
