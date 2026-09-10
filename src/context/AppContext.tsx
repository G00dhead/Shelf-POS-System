import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import {
  Product,
  CartItem,
  PaymentMethod,
  Order,
  Customer,
  Review,
  Payout,
  TaxSetting,
  TaxLogEntry,
  Integration,
  StaffMember,
  StoreSettings,
  ScreenId,
  Category,
  StockAlert
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CART_ITEMS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_REVIEWS,
  INITIAL_PAYOUTS,
  INITIAL_TAX_SETTINGS,
  INITIAL_TAX_LOGS,
  INITIAL_INTEGRATIONS,
  INITIAL_STAFF,
  INITIAL_SETTINGS,
  DEFAULT_PRODUCT_IMAGE
} from '../mockData';

interface AppContextType {
  // Navigation
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductPrice: (id: string, newPrice: number, discountPercent?: number, discountFixed?: number) => void;
  applyBulkCategoryDiscount: (category: string, discountPercent: number) => void;
  scanBarcode: (barcodeOrSku: string) => boolean;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  resetCart: () => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (pm: PaymentMethod) => void;
  discountAmount: number;
  setDiscountAmount: (d: number) => void;
  subtotal: number;
  tax: number;
  total: number;
  chargeCurrentOrder: () => Order | null;

  // Orders
  orders: Order[];
  refundOrder: (id: string) => void;
  holdOrder: (id: string) => void;
  resumeOrder: (id: string) => void;
  selectedOrderForModal: Order | null;
  setSelectedOrderForModal: (order: Order | null) => void;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'totalSpent' | 'ordersCount' | 'loyaltyPoints' | 'tier' | 'joinedDate'>) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;

  // Payouts
  payouts: Payout[];

  // Tax
  taxSettings: TaxSetting[];
  taxLogs: TaxLogEntry[];
  updateTaxRate: (id: string, newRate: number) => void;

  // Marketplace
  integrations: Integration[];
  toggleIntegration: (id: string) => void;

  // Staff & Settings
  staff: StaffMember[];
  toggleStaffActive: (id: string) => void;
  settings: StoreSettings;
  updateSettings: (updates: Partial<StoreSettings>) => void;
  drawerAmount: number;

  // Modals & Drawers
  lastOrderReceipt: Order | null;
  setLastOrderReceipt: (o: Order | null) => void;
  isEndShiftOpen: boolean;
  setIsEndShiftOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  mobileCartOpen: boolean;
  setMobileCartOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  isManualPaymentOpen: boolean;
  setIsManualPaymentOpen: (open: boolean) => void;
  processManualPayment: (data: {
    amount: number;
    method: PaymentMethod;
    notes?: string;
    customerName?: string;
  }) => Order;

  // Inventory Reorder Alerts & Automated Background Check
  stockAlerts: StockAlert[];
  lastInventoryScan: string | null;
  isScanningInventory: boolean;
  runCatalogBackgroundCheck: () => { scannedCount: number; alertsTriggered: number };
  acknowledgeAlert: (alertId: string) => void;
  quickRestockProduct: (productId: string, quantityToAdd: number) => void;
  updateReorderThreshold: (productId: string, newThreshold: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('pos');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All Products');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Background check and alerts state
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [lastInventoryScan, setLastInventoryScan] = useState<string | null>(null);
  const [isScanningInventory, setIsScanningInventory] = useState<boolean>(false);

  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [payouts] = useState<Payout[]>(INITIAL_PAYOUTS);
  const [taxSettings, setTaxSettings] = useState<TaxSetting[]>(INITIAL_TAX_SETTINGS);
  const [taxLogs, setTaxLogs] = useState<TaxLogEntry[]>(INITIAL_TAX_LOGS);
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [drawerAmount, setDrawerAmount] = useState<number>(50000.00);

  // Modals & mobile drawers
  const [lastOrderReceipt, setLastOrderReceipt] = useState<Order | null>(null);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [isEndShiftOpen, setIsEndShiftOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileCartOpen, setMobileCartOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isManualPaymentOpen, setIsManualPaymentOpen] = useState<boolean>(false);

  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  // Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  // Tax calculation: 8% of subtotal
  const tax = useMemo(() => {
    const rate = settings.defaultTaxRate / 100;
    return Number((subtotal * rate).toFixed(2));
  }, [subtotal, settings.defaultTaxRate]);

  const total = useMemo(() => {
    const t = Math.max(0, subtotal + tax - discountAmount);
    return Number(t.toFixed(2));
  }, [subtotal, tax, discountAmount]);

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    const qtyToAdd = Math.max(1, quantity);
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      }
      return [...prev, { product, quantity: qtyToAdd }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const resetCart = () => {
    setCart([]);
    setDiscountAmount(0);
  };

  // Charge transaction
  const chargeCurrentOrder = (): Order | null => {
    if (cart.length === 0) return null;

    const newOrderNumber = `#${1049 + orders.length}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        unitPrice: item.product.price,
        quantity: item.quantity,
        lineTotal: item.product.price * item.quantity,
        image: item.product.image
      })),
      subtotal,
      tax,
      taxRate: settings.defaultTaxRate,
      discount: discountAmount,
      total,
      paymentMethod,
      status: 'completed',
      cashier: settings.cashierName,
      timestamp: 'Just now',
      customerName: 'Walk-in Shopper'
    };

    // Update inventory stock
    setProducts(prev =>
      prev.map(p => {
        const inCart = cart.find(ci => ci.product.id === p.id);
        if (inCart) {
          return { ...p, stock: Math.max(0, p.stock - inCart.quantity) };
        }
        return p;
      })
    );

    // If payment method is cash, increment drawer
    if (paymentMethod === 'cash') {
      setDrawerAmount(prev => Number((prev + total).toFixed(2)));
    }

    // Add to orders log
    setOrders(prev => [newOrder, ...prev]);

    // Update tax log
    setTaxLogs(prev => [
      {
        id: `tl-${Date.now()}`,
        date: 'Today (Live)',
        category: 'POS Sales (8%)',
        taxableSales: subtotal,
        taxCollected: tax
      },
      ...prev
    ]);

    // Set receipt modal
    setLastOrderReceipt(newOrder);

    // Reset cart
    resetCart();

    // Close mobile cart if open
    setMobileCartOpen(false);

    return newOrder;
  };

  // Manual payment process
  const processManualPayment = (data: {
    amount: number;
    method: PaymentMethod;
    notes?: string;
    customerName?: string;
  }): Order => {
    // If cart has items and amount covers the total, charge cart
    if (cart.length > 0 && data.amount >= total) {
      setPaymentMethod(data.method);
      const charged = chargeCurrentOrder();
      if (charged) {
        if (data.amount > charged.total) {
          const change = Number((data.amount - charged.total).toFixed(2));
          setOrders(prev =>
            prev.map(o =>
              o.id === charged.id
                ? {
                    ...o,
                    notes: `Tendered: ${settings.currency}${data.amount.toLocaleString()} | Change: ${settings.currency}${change.toLocaleString()}${data.notes ? ` • ${data.notes}` : ''}`
                  }
                : o
            )
          );
        }
        setIsManualPaymentOpen(false);
        return charged;
      }
    }

    // Direct standalone manual payment
    const newOrderNumber = `#${1049 + orders.length}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      items: [
        {
          productId: `manual-${Date.now()}`,
          productName: data.notes?.trim() || 'Manual POS Payment Entry',
          unitPrice: data.amount,
          quantity: 1,
          lineTotal: data.amount,
          image: DEFAULT_PRODUCT_IMAGE
        }
      ],
      subtotal: data.amount,
      tax: 0,
      taxRate: 0,
      discount: 0,
      total: data.amount,
      paymentMethod: data.method,
      status: 'completed',
      cashier: settings.cashierName,
      timestamp: 'Just now',
      customerName: data.customerName?.trim() || 'Walk-in Customer',
      notes: data.notes?.trim() || 'Manual payment entry'
    };

    if (data.method === 'cash') {
      setDrawerAmount(prev => Number((prev + data.amount).toFixed(2)));
    }

    setOrders(prev => [newOrder, ...prev]);
    setLastOrderReceipt(newOrder);
    setIsManualPaymentOpen(false);

    return newOrder;
  };

  // Order actions
  const refundOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status: 'refunded' } : ord))
    );
  };

  const holdOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status: 'held' } : ord))
    );
  };

  const resumeOrder = (orderId: string) => {
    const target = orders.find(o => o.id === orderId);
    if (!target) return;

    // Load items into cart
    const restoredCart: CartItem[] = target.items.map(item => {
      const p = products.find(prod => prod.id === item.productId) || {
        id: item.productId,
        name: item.productName,
        sku: 'GEN-01',
        category: 'Accessories',
        price: item.unitPrice,
        cost: item.unitPrice * 0.4,
        stock: 20,
        reorderThreshold: 15,
        image: item.image
      };
      return {
        product: p,
        quantity: item.quantity
      };
    });

    setCart(restoredCart);
    setPaymentMethod(target.paymentMethod);
    setDiscountAmount(target.discount);

    // Remove from held or mark completed
    setOrders(prev => prev.filter(o => o.id !== orderId));
    setCurrentScreen('pos');
  };

  // Products CRUD
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const generatedBarcode =
      productData.barcode?.trim() ||
      `6151100${Math.floor(100000 + Math.random() * 900000)}`;

    const newProduct: Product = {
      ...productData,
      reorderThreshold: typeof productData.reorderThreshold === 'number' ? productData.reorderThreshold : 15,
      barcode: generatedBarcode,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    removeFromCart(id);
  };

  const quickRestockProduct = (productId: string, quantityToAdd: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock + quantityToAdd);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  const updateReorderThreshold = (productId: string, newThreshold: number) => {
    const valid = Math.max(0, newThreshold);
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, reorderThreshold: valid } : p))
    );
  };

  const scanBarcode = (barcodeOrSku: string): boolean => {
    const clean = barcodeOrSku.trim().toLowerCase();
    if (!clean) return false;
    const matched = products.find(
      p => (p.barcode && p.barcode.toLowerCase() === clean) || (p.sku && p.sku.toLowerCase() === clean)
    );
    if (matched) {
      addToCart(matched);
      return true;
    }
    return false;
  };

  const updateProductPrice = (
    id: string,
    newPrice: number,
    discountPercent?: number,
    discountFixed?: number
  ) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              price: newPrice,
              discountPercent: discountPercent !== undefined ? discountPercent : p.discountPercent,
              discountFixed: discountFixed !== undefined ? discountFixed : p.discountFixed
            }
          : p
      )
    );
  };

  const applyBulkCategoryDiscount = (category: string, discountPercent: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (category === 'All' || p.category === category) {
          const discountMultiplier = 1 - discountPercent / 100;
          return {
            ...p,
            discountPercent,
            price: Number((p.price * discountMultiplier).toFixed(2))
          };
        }
        return p;
      })
    );
  };

  // Customers CRUD
  const addCustomer = (customerData: Omit<Customer, 'id' | 'totalSpent' | 'ordersCount' | 'loyaltyPoints' | 'tier' | 'joinedDate'>) => {
    const newCust: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      totalSpent: 0,
      ordersCount: 0,
      loyaltyPoints: 10,
      tier: 'Bronze',
      joinedDate: 'Just now'
    };
    setCustomers(prev => [newCust, ...prev]);
  };

  // Reviews CRUD
  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now'
    };
    setReviews(prev => [newRev, ...prev]);
  };

  // Tax
  const updateTaxRate = (id: string, newRate: number) => {
    setTaxSettings(prev =>
      prev.map(t => (t.id === id ? { ...t, rate: newRate } : t))
    );
  };

  // Integrations
  const toggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(i =>
        i.id === id
          ? {
              ...i,
              connected: !i.connected,
              statusText: !i.connected ? 'Active • Connected' : 'Disconnected',
              lastSync: !i.connected ? 'Just now' : i.lastSync
            }
          : i
      )
    );
  };

  // Staff
  const toggleStaffActive = (id: string) => {
    setStaff(prev =>
      prev.map(s => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  // Settings
  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  // Background check core evaluation function
  const evaluateCatalogStock = useCallback((currentProducts: Product[]) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const triggered: StockAlert[] = [];

    currentProducts.forEach(prod => {
      const threshold = typeof prod.reorderThreshold === 'number' ? prod.reorderThreshold : 15;
      if (prod.stock <= threshold) {
        const deficit = Math.max(0, threshold - prod.stock);
        const severity: 'critical' | 'warning' =
          prod.stock === 0 || prod.stock <= Math.floor(threshold / 2) ? 'critical' : 'warning';

        triggered.push({
          id: `alert-${prod.id}`,
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          barcode: prod.barcode,
          category: prod.category,
          image: prod.image,
          currentStock: prod.stock,
          reorderThreshold: threshold,
          deficit,
          severity,
          triggeredAt: nowStr,
          status: 'active'
        });
      }
    });

    // Sort by critical severity first, then by greatest stock deficit
    triggered.sort((a, b) => {
      if (a.severity === 'critical' && b.severity !== 'critical') return -1;
      if (b.severity === 'critical' && a.severity !== 'critical') return 1;
      return b.deficit - a.deficit;
    });

    setStockAlerts(triggered);
    setLastInventoryScan(nowStr);
    return { scannedCount: currentProducts.length, alertsTriggered: triggered.length };
  }, []);

  // Manual or on-demand catalog check trigger
  const runCatalogBackgroundCheck = useCallback(() => {
    setIsScanningInventory(true);
    const result = evaluateCatalogStock(products);
    setTimeout(() => {
      setIsScanningInventory(false);
    }, 450);
    return result;
  }, [evaluateCatalogStock, products]);

  // Automated background check on any products catalog changes (sales, restocks, edits)
  useEffect(() => {
    evaluateCatalogStock(products);
  }, [products, evaluateCatalogStock]);

  // Periodic automated background interval (runs continuous check every 20 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      evaluateCatalogStock(products);
    }, 20000);
    return () => clearInterval(timer);
  }, [products, evaluateCatalogStock]);

  const acknowledgeAlert = (alertId: string) => {
    setStockAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, status: 'acknowledged' } : a))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductPrice,
        applyBulkCategoryDiscount,
        scanBarcode,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        resetCart,
        paymentMethod,
        setPaymentMethod,
        discountAmount,
        setDiscountAmount,
        subtotal,
        tax,
        total,
        chargeCurrentOrder,
        orders,
        refundOrder,
        holdOrder,
        resumeOrder,
        selectedOrderForModal,
        setSelectedOrderForModal,
        customers,
        addCustomer,
        reviews,
        addReview,
        payouts,
        taxSettings,
        taxLogs,
        updateTaxRate,
        integrations,
        toggleIntegration,
        staff,
        toggleStaffActive,
        settings,
        updateSettings,
        drawerAmount,
        lastOrderReceipt,
        setLastOrderReceipt,
        isEndShiftOpen,
        setIsEndShiftOpen,
        mobileMenuOpen,
        setMobileMenuOpen,
        mobileCartOpen,
        setMobileCartOpen,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        isManualPaymentOpen,
        setIsManualPaymentOpen,
        processManualPayment,
        stockAlerts,
        lastInventoryScan,
        isScanningInventory,
        runCatalogBackgroundCheck,
        acknowledgeAlert,
        quickRestockProduct,
        updateReorderThreshold
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
