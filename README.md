# Shelf — POS & Retail Management System

Live: https://shelf-pos-system.vercel.app/

A point of sale and retail management system built for real store conditions. Fast checkout, clear numbers, and cash handling that matches how Nigerian retail actually runs.

## Key UX decisions

### Keypad, pay, and cash tender

**Auto sync with the cart.** On old cash registers, cashiers re key the total into a separate calculator or terminal. Here the keypad opens already matching the cart total, with a one tap "Sync to POS" button if the amount changes.

**Digits that never break.** Big amounts like ₦150,000 or ₦2,450,000 wrap or get cut off on small screens. So the keypad scales font size by digit count, text 5xl for 1 to 4 digits, down to text 3xl for 7 plus, with monospaced tabular numerals so commas line up and nobody miscounts a zero.

**Everything fits on one screen.** A modal packed with optional fields pushes the keypad below the fold. Customer name and notes collapse by default, so the 12 keys, the cash presets (+₦500, +₦1k, +₦5k, +₦10k), and the charge button stay visible without scrolling.

**Change due, calculated live.** The moment cash tendered passes the total, change due shows in high contrast emerald green. No mental math during rush hour.

**Touch and keyboard both work.** Buttons are sized 48 to 56px for touch, and the keypad also listens for physical keys (0 to 9, Backspace, Enter to charge, Esc to close) for desktop stations with barcode scanners.

### Contextual placement over global clutter

The top bar dropped its keypad button. It now shows only store level status: cash drawer float, cloud sync, and end shift. Keypad actions stay where transactions happen, inside the cart panel and the POS action bar.

### Retail speed and product recognition

Products show real packaging, Dangote Sugar, Golden Penny Semovita, Peak Evaporated Milk, instead of generic stock photos. Cashiers recognize shape and color faster than they read SKU text.

Staff profiles use monogram badges (GG for Goodhead Golly) with a live status ring instead of headshots. One consistent look, no broken image links.

### Cash drawer and audit trail

Every transaction logs the cashier, the payment method (cash, POS card, transfer, USSD), and updates the drawer float automatically for end of shift reconciliation.

## Stack

**Frontend**
- React 19, functional components and hooks, with a single AppContext for orders, cart, catalog, customers, and staff shifts
- TypeScript 5.8, typed across products, cart items, orders, tax rates, cash drawer state, and cashier profiles
- Vite 6 for dev server and build

**Styling**
- Tailwind CSS v4, utility first, responsive breakpoints, touch friendly target sizes
- Lucide React for icons (barcodes, registers, payment methods, receipts, drawer floats)
- Motion for modal transitions, keypad feedback, and screen switches

**State and domain logic (React Context)**
- Cart management: quantities, item notes, custom discounts
- Cash drawer float reconciliation and end of shift balancing
- Live change due and tax calculation
- Multi channel checkout: cash, card terminal, bank transfer, USSD
- Barcode search and camera scanner integration
- Thermal receipt generator with printable layouts

**Backend and deployment**
- Express and Node.js for API endpoints and production static asset serving
- Google GenAI SDK, wired server side for inventory categorization, analytics, and demand forecasting
- Deployed on Cloud Run, Node.js runtime, port 3000 behind an NGINX reverse proxy

## Getting started

```bash
npm install
npm run dev
```
