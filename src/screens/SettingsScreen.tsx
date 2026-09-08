import React, { useState } from 'react';
import {
  Settings,
  Users,
  Building,
  DollarSign,
  Receipt,
  Check,
  Plus,
  X,
  Package,
  Edit2,
  Barcode as BarcodeIcon,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StaffMember, Product, Category } from '../types';
import { formatMoney } from '../utils/format';
import { BarcodeLabelModal } from '../components/BarcodeView';
import { DEFAULT_PRODUCT_IMAGE } from '../mockData';

export const SettingsScreen: React.FC = () => {
  const {
    settings,
    updateSettings,
    staff,
    toggleStaffActive,
    products,
    addProduct,
    updateProduct,
    setCurrentScreen
  } = useApp();

  const [savedNotification, setSavedNotification] = useState(false);

  // Form states for Store & Register settings
  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [defaultTaxRate, setDefaultTaxRate] = useState(settings.defaultTaxRate.toString());
  const [startingFloat, setStartingFloat] = useState(settings.startingDrawerFloat.toString());
  const [cashierName, setCashierName] = useState(settings.cashierName);
  const [receiptHeader, setReceiptHeader] = useState(settings.receiptHeader);
  const [receiptFooter, setReceiptFooter] = useState(settings.receiptFooter);

  // Admin Product Add/Edit Modal states inside Settings
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [barcodeLabelProduct, setBarcodeLabelProduct] = useState<Product | null>(null);

  // Quick Add Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Category>('Groceries');
  const [newProdBarcode, setNewProdBarcode] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdUnit, setNewProdUnit] = useState('1kg Pack');
  const [newProdPrice, setNewProdPrice] = useState('2500');
  const [newProdCost, setNewProdCost] = useState('1900');
  const [newProdStock, setNewProdStock] = useState('30');
  const [newProdImage, setNewProdImage] = useState(DEFAULT_PRODUCT_IMAGE);

  const handleOpenAddProduct = () => {
    setNewProdName('');
    setNewProdCategory('Groceries');
    setNewProdBarcode(`6151100${Math.floor(100000 + Math.random() * 900000)}`);
    setNewProdSku(`GRO-SKU-${Math.floor(100 + Math.random() * 900)}`);
    setNewProdUnit('1kg Pack');
    setNewProdPrice('2500');
    setNewProdCost('1900');
    setNewProdStock('30');
    setIsAddProductOpen(true);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      tagline,
      defaultTaxRate: parseFloat(defaultTaxRate) || 7.5,
      startingDrawerFloat: parseFloat(startingFloat) || 50000.0,
      cashierName,
      receiptHeader,
      receiptFooter
    });
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    addProduct({
      name: newProdName.trim(),
      category: newProdCategory,
      barcode: newProdBarcode.trim() || `6151100${Math.floor(100000 + Math.random() * 900000)}`,
      sku: newProdSku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      unit: newProdUnit.trim(),
      price: parseFloat(newProdPrice) || 0,
      cost: parseFloat(newProdCost) || 0,
      stock: parseInt(newProdStock, 10) || 0,
      image: newProdImage
    });

    setIsAddProductOpen(false);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
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
      image: editingProduct.image
    });

    setEditingProduct(null);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  return (
    <div id="settings-screen" className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
            Admin & Supermarket Settings
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Admin product catalog management, Nigerian business profile, FIRS VAT rates, and cash drawer
          </p>
        </div>

        <button
          onClick={handleOpenAddProduct}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-[#6D5AE6] hover:bg-[#5E4BD4] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product (Admin)</span>
        </button>
      </div>

      {savedNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Operation completed and saved successfully to database!</span>
        </div>
      )}

      {/* Admin Product Management Section */}
      <div className="p-5 rounded-xl border border-zinc-200 bg-white space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#6D5AE6]" />
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                Admin Product Management (Add / Edit Products)
              </h3>
              <p className="text-[11px] text-zinc-400">
                Manage retail pricing, barcodes, and inventory directly from admin settings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddProduct}
              className="px-3 py-1.5 bg-[#6D5AE6]/10 text-[#6D5AE6] hover:bg-[#6D5AE6]/20 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
            <button
              onClick={() => setCurrentScreen('catalog')}
              className="px-3 py-1.5 border border-zinc-200 hover:border-zinc-300 text-zinc-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Full Catalog</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Quick Product List in Admin Settings */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase">
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Barcode (EAN-13)</th>
                <th className="py-2.5 px-3 text-right">Price (₦)</th>
                <th className="py-2.5 px-3 text-center">Stock</th>
                <th className="py-2.5 px-3 text-right">Quick Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.slice(0, 6).map((p) => (
                <tr
                  key={p.id}
                  className="even:bg-zinc-50/70 odd:bg-white hover:bg-zinc-100/80 transition-colors"
                >
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 flex items-center gap-2">
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded object-cover border border-zinc-200 shrink-0"
                    />
                    <span className="truncate max-w-[200px]">{p.name}</span>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-500">{p.category}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-600">
                    {p.barcode}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-900">
                    {formatMoney(p.price, settings.currency)}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stock <= 15
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="px-2.5 py-1 text-xs font-medium text-[#6D5AE6] hover:bg-[#6D5AE6]/10 rounded-md transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Product</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={() => setCurrentScreen('catalog')}
            className="text-xs text-[#6D5AE6] hover:underline font-semibold inline-flex items-center gap-1"
          >
            View all {products.length} products in full catalog table
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Store Metadata Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="p-5 rounded-xl border border-zinc-200 bg-white space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
            <Building className="w-4 h-4 text-[#6D5AE6]" />
            <h3 className="text-sm font-bold text-zinc-900">Supermarket Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Store Business Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#6D5AE6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#6D5AE6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Active Cashier Name
              </label>
              <input
                type="text"
                value={cashierName}
                onChange={(e) => setCashierName(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#6D5AE6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Currency Standard
              </label>
              <input
                type="text"
                readOnly
                value="Nigerian Naira (₦) - NGN (FIRS Standard)"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs bg-zinc-50 text-zinc-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Register & Financial Settings */}
        <div className="p-5 rounded-xl border border-zinc-200 bg-white space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
            <DollarSign className="w-4 h-4 text-[#6D5AE6]" />
            <h3 className="text-sm font-bold text-zinc-900">Register & Tax Rules</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                FIRS Value Added Tax (VAT) Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={defaultTaxRate}
                onChange={(e) => setDefaultTaxRate(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#6D5AE6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Starting Cash Drawer Float (₦)
              </label>
              <input
                type="number"
                step="500"
                value={startingFloat}
                onChange={(e) => setStartingFloat(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#6D5AE6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Thermal Receipt Header Text
              </label>
              <textarea
                rows={2}
                value={receiptHeader}
                onChange={(e) => setReceiptHeader(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#6D5AE6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Receipt Footer Message
              </label>
              <textarea
                rows={2}
                value={receiptFooter}
                onChange={(e) => setReceiptFooter(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#6D5AE6]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#6D5AE6] hover:bg-[#5E4BD4] rounded-lg transition-colors cursor-pointer"
            >
              Save System Settings
            </button>
          </div>
        </div>
      </form>

      {/* Staff Accounts Management */}
      <div className="p-5 rounded-xl border border-zinc-200 bg-white space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#6D5AE6]" />
            <h3 className="text-sm font-bold text-zinc-900">Staff Accounts & Cashier Shifts</h3>
          </div>
          <span className="text-xs text-zinc-400">
            {staff.filter((s) => s.active).length} of {staff.length} staff currently active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase">
                <th className="py-2.5 px-3">Team Member</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Assigned Shift</th>
                <th className="py-2.5 px-3">Today's Transactions</th>
                <th className="py-2.5 px-3 text-right">Shift Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {staff.map((member) => (
                <tr
                  key={member.id}
                  className="even:bg-zinc-50/70 odd:bg-white hover:bg-zinc-100/80 transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-zinc-200 shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6D5AE6] to-[#8B7CF8] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs select-none">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-zinc-900">{member.name}</div>
                        <div className="text-[11px] text-zinc-400">{member.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-medium text-[11px]">
                      {member.role}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-zinc-600">{member.shift}</td>

                  <td className="py-3 px-3 font-mono font-medium text-zinc-800">
                    {member.totalTransactionsToday} tickets
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => toggleStaffActive(member.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors cursor-pointer ${
                        member.active
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                      }`}
                    >
                      {member.active ? '● Active Shift' : '○ Off Duty'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal (Admin in Settings) */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#6D5AE6]/10 text-[#6D5AE6] flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Admin Add Product</h3>
                  <p className="text-[11px] text-zinc-400">
                    Register a new supermarket item with barcode
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewProduct} className="p-5 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Golden Penny Semovita 2kg"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#6D5AE6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as Category)}
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
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    placeholder="e.g. 2kg Bag, Pack of 3"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#6D5AE6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-zinc-700">
                      Barcode (EAN-13) *
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setNewProdBarcode(
                          `6151100${Math.floor(100000 + Math.random() * 900000)}`
                        )
                      }
                      className="text-[10px] text-[#6D5AE6] hover:underline flex items-center gap-0.5"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      Auto-generate
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={newProdBarcode}
                    onChange={(e) => setNewProdBarcode(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#6D5AE6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#6D5AE6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Retail Price (₦)
                  </label>
                  <input
                    type="number"
                    step="10"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
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
                    value={newProdCost}
                    onChange={(e) => setNewProdCost(e.target.value)}
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
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#6D5AE6]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#6D5AE6] hover:bg-[#5E4BD4] rounded-lg transition-colors cursor-pointer"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal (Admin in Settings) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#6D5AE6]/10 text-[#6D5AE6] flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Admin Edit Product</h3>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    SKU: {editingProduct.sku}
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

            <form onSubmit={handleSaveEditProduct} className="p-5 overflow-y-auto space-y-4">
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
                    Packaging Unit
                  </label>
                  <input
                    type="text"
                    value={editingProduct.unit || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, unit: e.target.value })
                    }
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

              <div className="grid grid-cols-3 gap-3">
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
    </div>
  );
};
