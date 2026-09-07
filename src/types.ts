export type Category =
  | 'All Products'
  | 'Groceries'
  | 'Toiletries & Personal Care'
  | 'Drinks & Beverages'
  | 'Bakery & Snacks'
  | 'Household & Cleaning'
  | 'Fresh & Frozen';

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: Category;
  price: number;
  cost: number;
  stock: number;
  image: string;
  unit?: string; // e.g. 'pack', 'kg', 'bottle', 'carton', 'tin', 'loaf'
  description?: string;
  rating?: number;
  reviewsCount?: number;
  discountPercent?: number; // e.g. 10 for 10%
  discountFixed?: number; // e.g. ₦500 off
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'card' | 'cash' | 'split';

export type OrderStatus = 'completed' | 'refunded' | 'held';

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  cashier: string;
  timestamp: string;
  customerName?: string;
  customerId?: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  totalSpent: number;
  ordersCount: number;
  lastVisit: string;
  loyaltyPoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  joinedDate: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Payout {
  id: string;
  batchNumber: string;
  date: string;
  amount: number;
  transactionsCount: number;
  bankAccount: string;
  status: 'Paid' | 'In Transit' | 'Pending';
}

export interface TaxSetting {
  id: string;
  category: string;
  rate: number; // percentage, e.g. 8.0 for 8%
  description: string;
  isActive: boolean;
}

export interface TaxLogEntry {
  id: string;
  date: string;
  category: string;
  taxableSales: number;
  taxCollected: number;
}

export interface Integration {
  id: string;
  name: string;
  category: 'Accounting' | 'E-commerce' | 'Hardware' | 'Marketing' | 'Delivery';
  description: string;
  iconName: string;
  connected: boolean;
  lastSync?: string;
  statusText?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'Store Manager' | 'Head Cashier' | 'Cashier' | 'Inventory Lead';
  avatar: string;
  active: boolean;
  shift: string;
  totalTransactionsToday: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  storeId: string;
  currency: string;
  defaultTaxRate: number;
  startingDrawerFloat: number;
  drawerCurrentAmount: number;
  cashierName: string;
  shiftStartTime: string;
  receiptHeader: string;
  receiptFooter: string;
  autoRefreshIntervalSeconds: number;
}

export type ScreenId =
  | 'overview'
  | 'pos'
  | 'orders'
  | 'catalog'
  | 'pricing'
  | 'customers'
  | 'reviews'
  | 'revenue'
  | 'payouts'
  | 'tax'
  | 'marketplace'
  | 'settings'
  | 'live-monitor'
  | 'alerts';
