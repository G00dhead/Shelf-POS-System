import {
  Product,
  Order,
  Customer,
  Review,
  Payout,
  TaxSetting,
  TaxLogEntry,
  Integration,
  StaffMember,
  StoreSettings,
  CartItem
} from './types';

export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';

export const INITIAL_PRODUCTS: Product[] = [
  // --- GROCERIES ---
  {
    id: 'prod-1',
    name: 'Golden Penny Semovita 2kg',
    sku: 'GRO-GP-SEMO2K',
    barcode: '6151100018291',
    category: 'Groceries',
    price: 3800,
    cost: 3100,
    stock: 65,
    unit: '2kg Bag',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    description: 'High quality premium wheat flour semovita, rich in fiber and proteins. Staple swallow.',
    rating: 4.9,
    reviewsCount: 142,
    discountPercent: 0
  },
  {
    id: 'prod-2',
    name: 'Indomie Instant Noodles Onion Chicken 70g (Carton 40pcs)',
    sku: 'GRO-IND-ONION40',
    barcode: '6151100024100',
    category: 'Groceries',
    price: 12500,
    cost: 10800,
    stock: 45,
    unit: 'Carton (40)',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
    description: 'Original Onion Chicken instant noodles full carton. Family size favourite across Nigeria.',
    rating: 4.9,
    reviewsCount: 310,
    discountPercent: 0
  },
  {
    id: 'prod-3',
    name: 'Peak Evaporated Milk Full Cream 160g (Pack of 6)',
    sku: 'GRO-PEAK-TIN6',
    barcode: '6151100039218',
    category: 'Groceries',
    price: 5100,
    cost: 4200,
    stock: 80,
    unit: 'Pack of 6',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
    description: 'Rich, creamy evaporated full cream milk tin pack, enriched with 28 vitamins and minerals.',
    rating: 4.8,
    reviewsCount: 95,
    discountPercent: 0
  },
  {
    id: 'prod-4',
    name: 'Mamador Pure Vegetable Cooking Oil 3.5L',
    sku: 'GRO-MAM-OIL35',
    barcode: '6151100045102',
    category: 'Groceries',
    price: 11200,
    cost: 9500,
    stock: 32,
    unit: '3.5L Jerrycan',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    description: 'Cholesterol-free pure vegetable oil fortified with Vitamin A. Heart-friendly cooking oil.',
    rating: 4.7,
    reviewsCount: 68,
    discountPercent: 0
  },
  {
    id: 'prod-5',
    name: 'Dangote Refined Pure White Sugar 1kg',
    sku: 'GRO-DAN-SUG1K',
    barcode: '6151100051283',
    category: 'Groceries',
    price: 1900,
    cost: 1550,
    stock: 120,
    unit: '1kg Pack',
    image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=600&auto=format&fit=crop&q=80',
    description: 'Premium granulated refined white cane sugar, fortified with Vitamin A.',
    rating: 4.8,
    reviewsCount: 54,
    discountPercent: 0
  },
  {
    id: 'prod-6',
    name: 'Milo Chocolate Malt Refill Pack 800g',
    sku: 'GRO-MILO-800G',
    barcode: '6151100067491',
    category: 'Groceries',
    price: 4600,
    cost: 3850,
    stock: 58,
    unit: '800g Pouch',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',
    description: 'The energy food drink of future champions. Activ-Go chocolate malt powder refill.',
    rating: 4.9,
    reviewsCount: 180,
    discountPercent: 0
  },
  {
    id: 'prod-7',
    name: 'Gino Magic Pepper & Onion Tomato Paste (Pack of 5)',
    sku: 'GRO-GINO-SACH5',
    barcode: '6151100078302',
    category: 'Groceries',
    price: 2100,
    cost: 1650,
    stock: 90,
    unit: 'Pack of 5',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    description: 'Thick triple-concentrated tomato paste spiced with Nigerian pepper and fresh onions for stew.',
    rating: 4.7,
    reviewsCount: 82,
    discountPercent: 0
  },
  {
    id: 'prod-8',
    name: 'Titus Atlantic Sardines in Pure Soybean Oil 125g',
    sku: 'GRO-TIT-SARD',
    barcode: '6151100089104',
    category: 'Groceries',
    price: 1150,
    cost: 900,
    stock: 140,
    unit: '125g Tin',
    image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&auto=format&fit=crop&q=80',
    description: 'Classic Portuguese wild-caught canned sardines in pure soybean oil with Omega-3.',
    rating: 4.9,
    reviewsCount: 210,
    discountPercent: 0
  },

  // --- TOILETRIES & PERSONAL CARE ---
  {
    id: 'prod-9',
    name: 'Dettol Antibacterial Bathing Soap 110g (Pack of 3)',
    sku: 'TOI-DET-COOL3',
    barcode: '6151100103212',
    category: 'Toiletries & Personal Care',
    price: 2400,
    cost: 1850,
    stock: 75,
    unit: 'Pack of 3',
    image: 'https://images.unsplash.com/photo-1607006483702-326402377484?w=600&auto=format&fit=crop&q=80',
    description: 'Dettol Cool bar soap with refreshing menthol and trusted germ protection for all the family.',
    rating: 4.8,
    reviewsCount: 115,
    discountPercent: 0
  },
  {
    id: 'prod-10',
    name: 'Oral-B All-Rounder 1-2-3 Fluoride Toothpaste 140g',
    sku: 'TOI-ORB-TP140',
    barcode: '6151100114389',
    category: 'Toiletries & Personal Care',
    price: 1250,
    cost: 950,
    stock: 110,
    unit: '140g Tube',
    image: 'https://images.unsplash.com/photo-1559591937-e1032b4b455b?w=600&auto=format&fit=crop&q=80',
    description: 'Triple action cavity defense, fresh breath mint, and enamel strengthening toothpaste.',
    rating: 4.8,
    reviewsCount: 76,
    discountPercent: 0
  },
  {
    id: 'prod-11',
    name: 'Always Ultra Thin Long Pads with Wings (Pack of 14)',
    sku: 'TOI-ALW-PAD14',
    barcode: '6151100125671',
    category: 'Toiletries & Personal Care',
    price: 1850,
    cost: 1400,
    stock: 85,
    unit: '14 Pads Pack',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    description: 'Superior leakguard core with wings. All-day clean and dry comfort for women.',
    rating: 4.9,
    reviewsCount: 160,
    discountPercent: 0
  },
  {
    id: 'prod-12',
    name: 'Nivea Rich Nourishing Body Lotion Cocoa Butter 400ml',
    sku: 'TOI-NIV-COCOA',
    barcode: '6151100136709',
    category: 'Toiletries & Personal Care',
    price: 4700,
    cost: 3750,
    stock: 38,
    unit: '400ml Bottle',
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&auto=format&fit=crop&q=80',
    description: 'Deep moisture serum infused with natural cocoa butter and Vitamin E for 48h glowing skin.',
    rating: 4.9,
    reviewsCount: 94,
    discountPercent: 0
  },
  {
    id: 'prod-13',
    name: 'Close-Up Red Hot Deep Action Gel Toothpaste 140g',
    sku: 'TOI-CLU-RED140',
    barcode: '6151100147820',
    category: 'Toiletries & Personal Care',
    price: 1100,
    cost: 820,
    stock: 95,
    unit: '140g Tube',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80',
    description: 'Spicy clove extract gel with antibacterial zinc mouthwash formula for 12-hour fresh breath.',
    rating: 4.7,
    reviewsCount: 88,
    discountPercent: 0
  },
  {
    id: 'prod-14',
    name: 'Bella 2-Ply Cotton Soft Facial Tissues (200 Sheets)',
    sku: 'TOI-BEL-TISS20',
    barcode: '6151100169041',
    category: 'Toiletries & Personal Care',
    price: 1400,
    cost: 980,
    stock: 70,
    unit: '200 Sheet Box',
    image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=600&auto=format&fit=crop&q=80',
    description: 'Gentle, virgin wood pulp absorbent 2-ply facial tissues in decorative dispenser box.',
    rating: 4.6,
    reviewsCount: 42,
    discountPercent: 0
  },

  // --- HOUSEHOLD & CLEANING ---
  {
    id: 'prod-15',
    name: 'Morning Fresh Antibacterial Dishwashing Liquid 1L',
    sku: 'HOU-MRN-DISH1L',
    barcode: '6151100170155',
    category: 'Household & Cleaning',
    price: 2800,
    cost: 2150,
    stock: 52,
    unit: '1 Litre Bottle',
    image: 'https://images.unsplash.com/photo-1585670270608-b4b455b5d194?w=600&auto=format&fit=crop&q=80',
    description: 'Superior grease-cutting power, just one drop cleans sink full of plates. Lemon fresh scent.',
    rating: 4.9,
    reviewsCount: 135,
    discountPercent: 0
  },
  {
    id: 'prod-16',
    name: 'Ariel Multi-Active Washing Powder Detergent 2kg',
    sku: 'HOU-ARI-DET2K',
    barcode: '6151100181267',
    category: 'Household & Cleaning',
    price: 4900,
    cost: 3950,
    stock: 36,
    unit: '2kg Bag',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format&fit=crop&q=80',
    description: 'Tough stain removal in 1 wash with downy freshness. Safe on colors and whites.',
    rating: 4.8,
    reviewsCount: 110,
    discountPercent: 0
  },
  {
    id: 'prod-17',
    name: 'Harpic Power Plus 10x Toilet Cleaning Gel 750ml',
    sku: 'HOU-HAR-GEL75',
    barcode: '6151100192378',
    category: 'Household & Cleaning',
    price: 2200,
    cost: 1680,
    stock: 64,
    unit: '750ml Bottle',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&auto=format&fit=crop&q=80',
    description: 'Kills 99.9% of germs, limescale remover, and deep bowl disinfection formula.',
    rating: 4.8,
    reviewsCount: 52,
    discountPercent: 0
  },

  // --- DRINKS & BEVERAGES ---
  {
    id: 'prod-18',
    name: 'Maltina Non-Alcoholic Malt Drink 330ml Can (Pack of 6)',
    sku: 'DRK-MAL-CAN6',
    barcode: '6151100214590',
    category: 'Drinks & Beverages',
    price: 3900,
    cost: 3100,
    stock: 48,
    unit: 'Pack of 6 Cans',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
    description: 'Smooth nourishing premium malt drink with natural vitamins and minerals.',
    rating: 4.9,
    reviewsCount: 220,
    discountPercent: 0
  },
  {
    id: 'prod-19',
    name: 'Chi Exotic Pineapple & Coconut Nectar 1 Litre',
    sku: 'DRK-CHI-EXO1L',
    barcode: '6151100225601',
    category: 'Drinks & Beverages',
    price: 1750,
    cost: 1350,
    stock: 75,
    unit: '1 Litre TetraPak',
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600&auto=format&fit=crop&q=80',
    description: 'Refreshing blend of ripe tropical pineapples and rich creamy coconut juice nectar.',
    rating: 4.8,
    reviewsCount: 140,
    discountPercent: 0
  },
  {
    id: 'prod-20',
    name: 'Eva Premium Natural Drinking Water 75cl (Pack of 12)',
    sku: 'DRK-EVA-WAT12',
    barcode: '6151100236712',
    category: 'Drinks & Beverages',
    price: 2800,
    cost: 2100,
    stock: 90,
    unit: 'Pack of 12',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
    description: 'Crisp, refreshing pure natural mineral spring water bottled at source under strict hygiene.',
    rating: 4.9,
    reviewsCount: 88,
    discountPercent: 0
  },

  // --- BAKERY & SNACKS ---
  {
    id: 'prod-21',
    name: 'Freshly Baked Jumbo Sweet Milk Bread (Loaf)',
    sku: 'BAK-JUM-LOAF',
    barcode: '6151100258934',
    category: 'Bakery & Snacks',
    price: 1600,
    cost: 1100,
    stock: 40,
    unit: 'Jumbo Loaf',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    description: 'Soft, fluffy bakery oven-fresh sweet butter bread. Best paired with hot tea or fried eggs.',
    rating: 4.9,
    reviewsCount: 195,
    discountPercent: 0
  },
  {
    id: 'prod-22',
    name: 'Minimie Crunchy Chinchin Jar 900g',
    sku: 'BAK-MIN-CHIN9',
    barcode: '6151100269045',
    category: 'Bakery & Snacks',
    price: 3200,
    cost: 2450,
    stock: 35,
    unit: '900g Jar',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=80',
    description: 'Taste the fun! Nutmeg-spiced golden crisp pastry bites in airtight reusable canister.',
    rating: 4.8,
    reviewsCount: 112,
    discountPercent: 0
  },
  {
    id: 'prod-23',
    name: 'Supreme Spiced Gourmet Ripe Plantain Chips 150g',
    sku: 'BAK-PLA-CHIP',
    barcode: '6151100270156',
    category: 'Bakery & Snacks',
    price: 950,
    cost: 650,
    stock: 80,
    unit: '150g Pack',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80',
    description: 'Crunchy golden thinly sliced sweet plantain chips seasoned with sea salt and chili pepper.',
    rating: 4.7,
    reviewsCount: 84,
    discountPercent: 0
  },

  // --- FRESH & FROZEN ---
  {
    id: 'prod-24',
    name: 'Farm Fresh Large Table Eggs (Crate of 30)',
    sku: 'FRS-EGG-CRAT30',
    barcode: '6151100292378',
    category: 'Fresh & Frozen',
    price: 5200,
    cost: 4300,
    stock: 28,
    unit: 'Crate (30)',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80',
    description: 'Grade A fresh large brown eggs directly sourced from Ogun State poultry farms.',
    rating: 4.9,
    reviewsCount: 146,
    discountPercent: 0
  }
];

export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    product: INITIAL_PRODUCTS[0], // Golden Penny Semovita 2kg (₦3,800)
    quantity: 1
  },
  {
    product: INITIAL_PRODUCTS[8], // Dettol Soap 3-pack (₦2,400)
    quantity: 1
  },
  {
    product: INITIAL_PRODUCTS[14], // Morning Fresh Liquid 1L (₦2,800)
    quantity: 1
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1048',
    orderNumber: '#1048',
    items: [
      {
        productId: 'prod-1',
        productName: 'Golden Penny Semovita 2kg',
        unitPrice: 3800,
        quantity: 2,
        lineTotal: 7600,
        image: INITIAL_PRODUCTS[0].image
      },
      {
        productId: 'prod-8',
        productName: 'Dettol Antibacterial Soap (Pack of 3)',
        unitPrice: 2400,
        quantity: 1,
        lineTotal: 2400,
        image: INITIAL_PRODUCTS[8].image
      },
      {
        productId: 'prod-17',
        productName: 'Maltina Non-Alcoholic Malt (Pack of 6)',
        unitPrice: 3900,
        quantity: 1,
        lineTotal: 3900,
        image: INITIAL_PRODUCTS[17].image
      }
    ],
    subtotal: 13900,
    tax: 472.50,
    taxRate: 7.5,
    discount: 0,
    total: 14372.50,
    paymentMethod: 'card',
    status: 'completed',
    cashier: 'Chidinma O.',
    timestamp: 'Today, 2:14 PM',
    customerName: 'Adebayo Ogunlesi',
    customerId: 'cust-1',
    notes: 'Paid via POS Terminal #01 (Mastercard Tap)'
  },
  {
    id: 'ord-1047',
    orderNumber: '#1047',
    items: [
      {
        productId: 'prod-2',
        productName: 'Indomie Instant Noodles Onion Chicken (Carton 40)',
        unitPrice: 12500,
        quantity: 1,
        lineTotal: 12500,
        image: INITIAL_PRODUCTS[1].image
      },
      {
        productId: 'prod-3',
        productName: 'Mamador Pure Vegetable Oil 3.5L',
        unitPrice: 11200,
        quantity: 1,
        lineTotal: 11200,
        image: INITIAL_PRODUCTS[3].image
      }
    ],
    subtotal: 23700,
    tax: 0,
    taxRate: 7.5,
    discount: 1000,
    total: 22700,
    paymentMethod: 'cash',
    status: 'completed',
    cashier: 'Chidinma O.',
    timestamp: 'Today, 1:45 PM',
    customerName: 'Chioma Nwosu',
    customerId: 'cust-2',
    notes: '₦23,000 cash tendered, ₦300 change returned'
  },
  {
    id: 'ord-1046',
    orderNumber: '#1046',
    items: [
      {
        productId: 'prod-20',
        productName: 'Freshly Baked Jumbo Sweet Bread',
        unitPrice: 1600,
        quantity: 2,
        lineTotal: 3200,
        image: INITIAL_PRODUCTS[20].image
      },
      {
        productId: 'prod-23',
        productName: 'Farm Fresh Large Table Eggs (Crate of 30)',
        unitPrice: 5200,
        quantity: 1,
        lineTotal: 5200,
        image: INITIAL_PRODUCTS[23].image
      }
    ],
    subtotal: 8400,
    tax: 0,
    taxRate: 7.5,
    discount: 0,
    total: 8400,
    paymentMethod: 'card',
    status: 'completed',
    cashier: 'Chidinma O.',
    timestamp: 'Today, 12:30 PM',
    customerName: 'Oluwaseun Bakare',
    customerId: 'cust-3'
  },
  {
    id: 'ord-1045',
    orderNumber: '#1045',
    items: [
      {
        productId: 'prod-11',
        productName: 'Nivea Rich Nourishing Cocoa Butter 400ml',
        unitPrice: 4700,
        quantity: 1,
        lineTotal: 4700,
        image: INITIAL_PRODUCTS[11].image
      },
      {
        productId: 'prod-14',
        productName: 'Morning Fresh Antibacterial Dishwashing Liquid 1L',
        unitPrice: 2800,
        quantity: 2,
        lineTotal: 5600,
        image: INITIAL_PRODUCTS[14].image
      }
    ],
    subtotal: 10300,
    tax: 772.50,
    taxRate: 7.5,
    discount: 0,
    total: 11072.50,
    paymentMethod: 'split',
    status: 'held',
    cashier: 'Chidinma O.',
    timestamp: 'Today, 11:15 AM',
    customerName: 'Ifeoma Eze',
    customerId: 'cust-4',
    notes: 'Customer stepped to car to fetch secondary GTBank debit card'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Adebayo Ogunlesi',
    email: 'adebayo.o@gmail.com',
    phone: '+234 803 445 9921',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    totalSpent: 184500,
    ordersCount: 14,
    lastVisit: 'Today at 2:14 PM',
    loyaltyPoints: 340,
    tier: 'Platinum',
    joinedDate: 'Jan 2025'
  },
  {
    id: 'cust-2',
    name: 'Chioma Nwosu',
    email: 'chioma.nwosu@yahoo.com',
    phone: '+234 812 770 1234',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    totalSpent: 96800,
    ordersCount: 8,
    lastVisit: 'Today at 1:45 PM',
    loyaltyPoints: 180,
    tier: 'Gold',
    joinedDate: 'Mar 2025'
  },
  {
    id: 'cust-3',
    name: 'Oluwaseun Bakare',
    email: 'seun.bakare@outlook.com',
    phone: '+234 809 334 5510',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    totalSpent: 42300,
    ordersCount: 5,
    lastVisit: 'Today at 12:30 PM',
    loyaltyPoints: 85,
    tier: 'Silver',
    joinedDate: 'May 2025'
  },
  {
    id: 'cust-4',
    name: 'Ifeoma Eze',
    email: 'ifeoma.eze@gmail.com',
    phone: '+234 802 881 7744',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    totalSpent: 31200,
    ordersCount: 3,
    lastVisit: 'Today at 11:15 AM',
    loyaltyPoints: 50,
    tier: 'Bronze',
    joinedDate: 'Aug 2025'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    productName: 'Golden Penny Semovita 2kg',
    customerName: 'Chioma Nwosu',
    rating: 5,
    date: 'Yesterday',
    comment: 'Always freshly stocked and authentic Golden Penny semo. Very smooth consistency.',
    verified: true
  },
  {
    id: 'rev-2',
    productId: 'prod-9',
    productName: 'Dettol Antibacterial Soap (Pack of 3)',
    customerName: 'Adebayo Ogunlesi',
    rating: 5,
    date: '2 days ago',
    comment: 'Great multi-pack price compared to roadside chemists. Reliable barcode scan at checkout.',
    verified: true
  },
  {
    id: 'rev-3',
    productId: 'prod-15',
    productName: 'Morning Fresh Antibacterial Dishwashing Liquid 1L',
    customerName: 'Oluwaseun Bakare',
    rating: 4,
    date: 'Sep 04, 2026',
    comment: 'Authentic Nigerian Cussons Morning Fresh. Cuts oil on pots effortlessly.',
    verified: true
  }
];

export const INITIAL_PAYOUTS: Payout[] = [
  {
    id: 'pay-1',
    batchNumber: 'NG-BATCH-9941',
    date: 'Today (Pending Settlement)',
    amount: 348500,
    transactionsCount: 38,
    bankAccount: 'Zenith Bank Nigeria (Acct •••• 4812)',
    status: 'In Transit'
  },
  {
    id: 'pay-2',
    batchNumber: 'NG-BATCH-9940',
    date: 'Yesterday, 11:59 PM',
    amount: 512000,
    transactionsCount: 64,
    bankAccount: 'GTBank Lagos (Acct •••• 9011)',
    status: 'Paid'
  },
  {
    id: 'pay-3',
    batchNumber: 'NG-BATCH-9939',
    date: 'Sep 05, 2026',
    amount: 489200,
    transactionsCount: 52,
    bankAccount: 'First Bank of Nigeria (Acct •••• 3320)',
    status: 'Paid'
  },
  {
    id: 'pay-4',
    batchNumber: 'NG-BATCH-9938',
    date: 'Sep 04, 2026',
    amount: 620400,
    transactionsCount: 71,
    bankAccount: 'Access Bank Nigeria (Acct •••• 7719)',
    status: 'Paid'
  }
];

export const INITIAL_TAX_SETTINGS: TaxSetting[] = [
  {
    id: 'tax-1',
    category: 'Toiletries, Cosmetics & Household Goods',
    rate: 7.5,
    description: 'Federal Inland Revenue Service (FIRS) standard Value Added Tax (VAT) rate',
    isActive: true
  },
  {
    id: 'tax-2',
    category: 'Packaged Drinks, Beverages & Confectionery',
    rate: 7.5,
    description: 'Standard retail VAT on manufactured beverages and commercial snacks',
    isActive: true
  },
  {
    id: 'tax-3',
    category: 'Basic Staple Groceries & Raw Agricultural Foods',
    rate: 0.0,
    description: 'FIRS VAT-exempt basic raw staple groceries (flour, rice, beans, fresh eggs)',
    isActive: true
  },
  {
    id: 'tax-4',
    category: 'Imported Luxury Delicacies & Spirits',
    rate: 10.0,
    description: 'Special excise tariff for premium imported specialty goods',
    isActive: false
  }
];

export const INITIAL_TAX_LOGS: TaxLogEntry[] = [
  { id: 'tl-1', date: 'Today (Live Register)', category: 'Household & Toiletries (7.5%)', taxableSales: 48500, taxCollected: 3637.50 },
  { id: 'tl-2', date: 'Yesterday', category: 'Household & Toiletries (7.5%)', taxableSales: 214000, taxCollected: 16050.00 },
  { id: 'tl-3', date: 'Yesterday', category: 'Packaged Beverages (7.5%)', taxableSales: 162000, taxCollected: 12150.00 },
  { id: 'tl-4', date: 'Sep 05, 2026', category: 'Household & Toiletries (7.5%)', taxableSales: 298000, taxCollected: 22350.00 },
  { id: 'tl-5', date: 'Sep 04, 2026', category: 'Household & Toiletries (7.5%)', taxableSales: 240000, taxCollected: 18000.00 }
];

export const INITIAL_INTEGRATIONS: Integration[] = [
  {
    id: 'int-1',
    name: 'Paystack POS Terminal Gateway',
    category: 'Hardware',
    description: 'Instant card tap, chip, USSD, and bank transfer settlement hardware SDK.',
    iconName: 'CreditCard',
    connected: true,
    lastSync: 'Online (Terminal #PST-8821)',
    statusText: 'Connected • Standby for EMV card taps'
  },
  {
    id: 'int-2',
    name: 'Flutterwave Store Sync',
    category: 'E-commerce',
    description: 'Sync online customer supermarket orders with in-store physical register queue.',
    iconName: 'ShoppingBag',
    connected: true,
    lastSync: '3 mins ago',
    statusText: 'Active • 24 products in sync'
  },
  {
    id: 'int-3',
    name: 'QuickBooks Online Nigeria',
    category: 'Accounting',
    description: 'Automate daily end-of-day sales revenue logs, FIRS VAT reports, and drawer balances.',
    iconName: 'FileSpreadsheet',
    connected: true,
    lastSync: 'Today at 6:00 AM',
    statusText: 'Connected • Ledger synced'
  },
  {
    id: 'int-4',
    name: 'Termii SMS Transaction Receipts',
    category: 'Marketing',
    description: 'Dispatch paperless instant SMS receipts and loyalty balance alerts to Nigerian mobile lines.',
    iconName: 'MessageSquare',
    connected: true,
    statusText: 'Active • Deliverability 99.4%'
  },
  {
    id: 'int-5',
    name: 'Moniepoint Merchant Settlement',
    category: 'Hardware',
    description: 'Direct instant POS settlement into business operational current account.',
    iconName: 'Award',
    connected: true,
    lastSync: '5 mins ago',
    statusText: 'Connected • Live'
  },
  {
    id: 'int-6',
    name: 'Chowdeck / Glovo Supermarket Delivery',
    category: 'Delivery',
    description: 'Rapid on-demand dispatch for neighborhood grocery orders across Lagos.',
    iconName: 'Truck',
    connected: false,
    statusText: 'Available for setup'
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'st-1',
    name: 'Chidinma O.',
    email: 'chidinma.o@deprince.ng',
    role: 'Head Cashier',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    active: true,
    shift: 'Morning Shift (8:00 AM - 4:00 PM)',
    totalTransactionsToday: 24
  },
  {
    id: 'st-2',
    name: 'Babajide A.',
    email: 'babajide.a@deprince.ng',
    role: 'Store Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    active: true,
    shift: 'Full Day (Store Operations)',
    totalTransactionsToday: 8
  },
  {
    id: 'st-3',
    name: 'Emeka N.',
    email: 'emeka.n@deprince.ng',
    role: 'Cashier',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    active: false,
    shift: 'Evening Shift (3:30 PM - 10:00 PM)',
    totalTransactionsToday: 0
  },
  {
    id: 'st-4',
    name: 'Fatima B.',
    email: 'fatima.b@deprince.ng',
    role: 'Inventory Lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    active: true,
    shift: 'Receiving & Barcoding (7:00 AM - 3:00 PM)',
    totalTransactionsToday: 0
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'De-Prince Supermarket & Groceries',
  tagline: 'Lagos Premier Retail & Supermarket POS',
  storeId: 'REG-LAG-001',
  currency: '₦',
  defaultTaxRate: 7.5,
  startingDrawerFloat: 50000.00,
  drawerCurrentAmount: 50000.00,
  cashierName: 'Chidinma O.',
  shiftStartTime: '8:30 AM',
  receiptHeader: 'DE-PRINCE SUPERMARKET & PROVISIONS\nPlot 14, Admiralty Way, Lekki Phase 1, Lagos\nTel: +234 803 123 4567 • FIRS TIN: 10482910-0001',
  receiptFooter: 'Thank you for shopping at De-Prince Supermarket!\nReturns in original condition accepted within 48 hours with receipt.',
  autoRefreshIntervalSeconds: 2
};
