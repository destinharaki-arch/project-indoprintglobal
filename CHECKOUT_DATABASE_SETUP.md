# Checkout Database Setup Guide

## Overview

Saya telah membuat sistem lengkap untuk menyimpan data checkout ke database SQLite. Berikut adalah panduan lengkap untuk mengimplementasikannya.

---

## 1. INSTALL DEPENDENCIES

Anda perlu menginstall 2 dependencies tambahan:

```bash
npm install sqlite3 uuid
npm install -D @types/sqlite3
```

Atau dengan pnpm (package manager yang digunakan project):

```bash
pnpm add sqlite3 uuid
pnpm add -D @types/sqlite3
```

---

## 2. FILES YANG TELAH DIBUAT

### Backend Files:

1. **`server/db.ts`** - Database initialization dan helper functions
   - Membuat semua tables otomatis
   - Menyediakan helper functions (runQuery, getOne, getAll)
   - Menginisialisasi database connection

2. **`server/routes/checkout.ts`** - API endpoints untuk checkout
   - POST `/api/checkout/user` - Save/update user
   - POST `/api/checkout/shipping-address` - Save shipping address
   - POST `/api/checkout/order` - Create order
   - POST `/api/checkout/payment` - Process payment
   - GET `/api/checkout/orders/:userId` - Get user orders
   - GET `/api/checkout/order/:orderId` - Get single order
   - PUT `/api/checkout/order/:orderId/status` - Update order status
   - GET `/api/checkout/orders-admin` - Get all orders (admin)

3. **`server/index.ts`** - Updated server config
   - Initialize database saat server start
   - Register checkout routes

4. **`server/node-build.ts`** - Updated untuk handle async server setup

### Frontend Files:

1. **`client/services/checkoutService.ts`** - Service untuk API calls
   - `saveUser()` - Save user data
   - `saveShippingAddress()` - Save shipping address
   - `createOrder()` - Create checkout order
   - `processPayment()` - Process payment
   - `getUserOrders()` - Get orders by user
   - `getOrder()` - Get single order
   - `updateOrderStatus()` - Update order status
   - `getAllOrders()` - Get all orders (admin)

2. **`client/pages/Checkout.tsx`** - Updated component
   - Menggunakan checkoutService untuk save data
   - Menyimpan user info, shipping, order, dan payment ke database

3. **`docs/DATABASE_SCHEMA.md`** - Dokumentasi database lengkap

---

## 3. DATABASE STRUCTURE

Database akan otomatis dibuat di: **`data/checkout.db`**

Tabel yang dibuat:
- `users` - Data pelanggan
- `products` - Data produk
- `shipping_addresses` - Alamat pengiriman
- `payment_methods` - Metode pembayaran
- `orders` - Informasi order
- `order_items` - Item dalam order
- `payment_transactions` - Log transaksi
- `order_status_history` - Riwayat status order

---

## 4. FLOW DIAGRAM

```
User Submit Checkout
        ↓
1. Save User Data → POST /api/checkout/user
        ↓
2. Save Shipping Address → POST /api/checkout/shipping-address
        ↓
3. Create Order → POST /api/checkout/order
        ↓
4. Process Payment → POST /api/checkout/payment
        ↓
5. Clear Cart & Redirect to Orders
```

---

## 5. QUICK START

### Step 1: Install Dependencies
```bash
pnpm add sqlite3 uuid
pnpm add -D @types/sqlite3
```

### Step 2: Build Project
```bash
pnpm build
```

### Step 3: Run Server
```bash
pnpm start
# atau untuk development:
pnpm dev
```

Server akan:
- Initialize database otomatis
- Create semua tables
- Listen pada port 3000

### Step 4: Test Checkout
1. Buka aplikasi di browser
2. Login/Register
3. Add products ke cart
4. Go to checkout
5. Fill shipping form
6. Choose payment method
7. Click "Konfirmasi & Pesan Sekarang"
8. Data akan disimpan ke database
9. Redirect ke Orders page

---

## 6. DATA FLOW DETAILS

### Saat User Submit Checkout:

```typescript
// 1. User info disimpan
await saveUser({
  name: "John Doe",
  email: "john@example.com",
  phone: "+62812345678",
  address: "Jl. Merdeka"
})
→ Returns: { id: 'uuid', message: 'User created/updated' }

// 2. Shipping address disimpan
await saveShippingAddress({
  userId: 'user-uuid',
  recipientName: "John Doe",
  streetAddress: "Jl. Merdeka 123",
  city: "Jakarta",
  state: "DKI",
  postalCode: "12345",
  country: "Indonesia"
})
→ Returns: { id: 'address-uuid', message: 'Shipping address created' }

// 3. Order dibuat dengan items
await createOrder({
  userId: 'user-uuid',
  shippingAddressId: 'address-uuid',
  paymentMethodType: 'bank_transfer' | 'cod',
  items: [
    { id: '1', name: 'Product 1', quantity: 2, price: 5.0 }
  ],
  subtotal: 10.0,
  taxAmount: 0.3,
  totalAmount: 10.3
})
→ Returns: { id: 'order-uuid', orderNumber: 'ORD-20240315-123' }

// 4. Payment diproses
await processPayment({
  orderId: 'order-uuid',
  amount: 10.3,
  status: 'completed'
})
→ Returns: { transactionId: 'trans-uuid', message: 'Payment processed' }
```

---

## 7. DATABASE QUERIES

### Lihat Semua Orders
```sql
SELECT * FROM orders ORDER BY created_at DESC;
```

### Lihat Order dengan Items
```sql
SELECT o.*, oi.product_name, oi.quantity, oi.unit_price
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = 'user-uuid'
ORDER BY o.created_at DESC;
```

### Lihat Payment Status
```sql
SELECT o.order_number, pt.status, pt.amount, pt.processed_at
FROM orders o
JOIN payment_transactions pt ON o.id = pt.order_id
WHERE o.user_id = 'user-uuid';
```

### Lihat Order History
```sql
SELECT * FROM order_status_history
WHERE order_id = 'order-uuid'
ORDER BY changed_at DESC;
```

---

## 8. ACCESSING DATABASE FILE

Database file tersimpan di: `data/checkout.db`

Anda bisa view dengan tools seperti:
- **SQLite Studio** - GUI tool (cross-platform)
- **DBeaver** - Database management tool
- **SQLite Browser** - Simple viewer
- Command line: `sqlite3 data/checkout.db`

---

## 9. ENVIRONMENT VARIABLES (Optional)

Anda bisa add environment variables di `.env`:

```env
DATABASE_PATH=data/checkout.db
NODE_ENV=development
PORT=3000
```

---

## 10. TROUBLESHOOTING

### Error: "Module not found: sqlite3"
**Solution:** Install dependencies
```bash
pnpm add sqlite3
```

### Error: "Cannot find module 'uuid'"
**Solution:** Install uuid
```bash
pnpm add uuid
```

### Error: "ENOENT: no such file or directory, open 'data/checkout.db'"
**Solution:** Data directory akan dibuat otomatis, tapi bisa manual buat:
```bash
mkdir -p data
```

### Database locked error
**Solution:** Pastikan hanya 1 instance server yang running

---

## 11. NEXT STEPS

Setelah setup berhasil:

1. **Create Admin Dashboard** - View semua orders, update status, tracking
2. **Order History Page** - User bisa lihat order history mereka (sudah ada di `/orders`)
3. **Email Notifications** - Send email saat order created, payment confirmed, shipped
4. **Payment Gateway Integration** - Integrate dengan payment provider (Midtrans, Stripe, etc.)
5. **Inventory Management** - Track stock dan auto-update when order created
6. **Order Analytics** - Reports, sales trends, customer insights

---

## 12. API ENDPOINTS SUMMARY

### User Endpoints
- `POST /api/checkout/user` - Save/update user

### Order Endpoints
- `POST /api/checkout/shipping-address` - Save shipping
- `POST /api/checkout/order` - Create order
- `GET /api/checkout/orders/:userId` - Get user orders
- `GET /api/checkout/order/:orderId` - Get single order
- `PUT /api/checkout/order/:orderId/status` - Update status

### Payment Endpoints
- `POST /api/checkout/payment` - Process payment

### Admin Endpoints
- `GET /api/checkout/orders-admin` - Get all orders

---

## 13. DATA VALIDATION

Semua input divalidasi di server:
- Email format validation
- Phone number required
- Address details required
- Postal code min 5 chars
- Positive amount validation
- Order items must exist

---

## 14. SECURITY NOTES

✓ All inputs validated server-side
✓ Use prepared statements (prevent SQL injection)
✓ Error messages don't leak sensitive info
✓ Database file not accessible from web

---

Dokumentasi lengkap ada di: **`docs/DATABASE_SCHEMA.md`**

Selamat! Database checkout system Anda sudah siap digunakan! 🎉
