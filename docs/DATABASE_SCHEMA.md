# Database Schema untuk Fitur Checkout - IndoPrintGlobal

## Overview
Dokumentasi ini menjelaskan struktur database untuk sistem checkout e-commerce yang mencakup pengelolaan orders, shipping information, payment methods, dan customer data.

---

## 1. ENTITY RELATIONSHIP DIAGRAM

```
┌─────────────────┐
│     Users       │
│  (Customers)    │
└────────┬────────┘
         │ 1:N
         │
┌────────▼──────────────┐
│    Orders             │
│  (Pesanan/Checkout)   │
└────────┬──────────────┘
         │ 1:N
         │
┌────────▼──────────────┐
│   OrderItems          │
│  (Item dalam Order)   │
└───────────────────────┘

┌────────────────────┐
│ ShippingAddress    │
│ (Alamat Pengiriman)│
└────────────────────┘
         ▲
         │ 1:N
         │
┌────────┴──────────────┐
│    Orders             │
└───────────────────────┘

┌────────────────────┐
│ PaymentMethod      │
│ (Metode Pembayaran)│
└────────────────────┘
         ▲
         │ 1:N
         │
┌────────┴──────────────┐
│    Orders             │
└───────────────────────┘
```

---

## 2. TABLE DEFINITIONS

### 2.1 Users (Pelanggan/Pengguna)

**Purpose:** Menyimpan informasi pelanggan

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**TypeScript Interface:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key unique identifier |
| name | String | Yes | Nama lengkap pelanggan |
| email | String | Yes | Email (unique) |
| phone | String | No | Nomor telepon |
| address | Text | No | Alamat default |
| createdAt | Timestamp | Yes | Waktu pembuatan akun |
| updatedAt | Timestamp | Yes | Waktu update terakhir |

---

### 2.2 Products (Produk)

**Purpose:** Menyimpan informasi produk/item

```sql
CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url TEXT,
  stock_quantity INT DEFAULT 0,
  material VARCHAR(100),
  size VARCHAR(50),
  shape VARCHAR(100),
  usage TEXT,
  reviews_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**TypeScript Interface:**
```typescript
interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl: string;
  stockQuantity: number;
  material?: string;
  size?: string;
  shape?: string;
  usage?: string;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 2.3 ShippingAddress (Alamat Pengiriman)

**Purpose:** Menyimpan alamat pengiriman untuk setiap order

```sql
CREATE TABLE shipping_addresses (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  recipient_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  street_address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**TypeScript Interface:**
```typescript
interface ShippingAddress {
  id: string;
  userId: string;
  recipientName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| userId | UUID | Yes | Foreign key ke users |
| recipientName | String | Yes | Nama penerima |
| email | String | Yes | Email penerima |
| phone | String | Yes | Telepon penerima |
| streetAddress | Text | Yes | Jalan/Alamat detail |
| city | String | Yes | Kota |
| state | String | Yes | Provinsi/State (e.g., "CA") |
| postalCode | String | Yes | Kode pos |
| country | String | Yes | Negara |
| isDefault | Boolean | No | Alamat default? |
| createdAt | Timestamp | Yes | Waktu pembuatan |
| updatedAt | Timestamp | Yes | Waktu update |

---

### 2.4 PaymentMethods (Metode Pembayaran)

**Purpose:** Menyimpan informasi metode pembayaran

```sql
CREATE TABLE payment_methods (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  method_type ENUM('bank_transfer', 'cod', 'credit_card', 'e_wallet') NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  bank_name VARCHAR(100),
  account_number VARCHAR(50),
  account_holder VARCHAR(255),
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**TypeScript Interface:**
```typescript
interface PaymentMethod {
  id: string;
  userId?: string;
  methodType: 'bank_transfer' | 'cod' | 'credit_card' | 'e_wallet';
  displayName: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Payment Types:**
- `bank_transfer` - Transfer bank (BCA, Mandiri, etc.)
- `cod` - Cash on Delivery (Bayar di Tempat)
- `credit_card` - Kartu kredit
- `e_wallet` - E-wallet (GCash, PayMaya, OVO, GoPay, etc.)

---

### 2.5 Orders (Pesanan/Checkout)

**Purpose:** Menyimpan informasi order/checkout

```sql
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  tax_amount DECIMAL(12, 2) NOT NULL,
  tax_percentage INT DEFAULT 3,
  shipping_cost DECIMAL(12, 2) DEFAULT 0,
  additional_fees DECIMAL(12, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Shipping Info
  shipping_address_id VARCHAR(36) NOT NULL,
  
  -- Payment Info
  payment_method_id VARCHAR(36),
  payment_method_type VARCHAR(50) NOT NULL,
  payment_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  payment_date DATETIME,
  
  -- Order Status
  order_status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  
  -- Tracking
  tracking_number VARCHAR(100),
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  
  -- Additional Info
  notes TEXT,
  coupon_code VARCHAR(50),
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shipping_address_id) REFERENCES shipping_addresses(id),
  FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
);
```

**TypeScript Interface:**
```typescript
interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  subtotal: number;
  taxAmount: number;
  taxPercentage: number;
  shippingCost: number;
  additionalFees: number;
  totalAmount: number;
  currency: string;
  
  // Shipping
  shippingAddressId: string;
  
  // Payment
  paymentMethodId?: string;
  paymentMethodType: string;
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed';
  paymentDate?: Date;
  
  // Status
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  
  // Tracking
  trackingNumber?: string;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  
  // Additional
  notes?: string;
  couponCode?: string;
  discountAmount: number;
  
  createdAt: Date;
  updatedAt: Date;
}
```

**Fields Reference:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| userId | UUID | Yes | Foreign key ke users |
| orderNumber | String | Yes | Nomor order unique (e.g., "ORD-20240115-001") |
| subtotal | Decimal | Yes | Total harga produk (USD) |
| taxAmount | Decimal | Yes | Jumlah pajak (USD) |
| taxPercentage | Int | Yes | Persentase pajak (default: 3%) |
| shippingCost | Decimal | No | Biaya pengiriman (default: 0 gratis) |
| additionalFees | Decimal | No | Biaya tambahan (e.g., COD fee) |
| totalAmount | Decimal | Yes | Total keseluruhan |
| currency | String | Yes | Mata uang (default: USD) |
| shippingAddressId | UUID | Yes | Foreign key ke shipping_addresses |
| paymentMethodId | UUID | No | Foreign key ke payment_methods |
| paymentMethodType | String | Yes | Tipe pembayaran (bank_transfer, cod, etc.) |
| paymentStatus | Enum | Yes | Status pembayaran |
| paymentDate | DateTime | No | Waktu pembayaran dikonfirmasi |
| orderStatus | Enum | Yes | Status order |
| trackingNumber | String | No | Nomor resi pengiriman |
| estimatedDeliveryDate | Date | No | Estimasi tanggal tiba |
| actualDeliveryDate | Date | No | Tanggal tiba aktual |
| notes | Text | No | Catatan tambahan |
| couponCode | String | No | Kode kupon/voucher |
| discountAmount | Decimal | No | Jumlah diskon |
| createdAt | Timestamp | Yes | Waktu order dibuat |
| updatedAt | Timestamp | Yes | Waktu update terakhir |

---

### 2.6 OrderItems (Item dalam Order)

**Purpose:** Menyimpan detail item yang dibeli dalam setiap order

```sql
CREATE TABLE order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

**TypeScript Interface:**
```typescript
interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
  createdAt: Date;
}
```

---

### 2.7 PaymentTransactions (Transaksi Pembayaran)

**Purpose:** Log untuk setiap transaksi pembayaran

```sql
CREATE TABLE payment_transactions (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  payment_method_id VARCHAR(36),
  transaction_ref VARCHAR(100) UNIQUE,
  amount DECIMAL(12, 2) NOT NULL,
  status ENUM('pending', 'processing', 'success', 'failed') DEFAULT 'pending',
  payment_response JSON,
  error_message TEXT,
  processed_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
);
```

**TypeScript Interface:**
```typescript
interface PaymentTransaction {
  id: string;
  orderId: string;
  paymentMethodId?: string;
  transactionRef?: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  paymentResponse?: Record<string, any>;
  errorMessage?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 2.8 OrderStatusHistory (Riwayat Status Order)

**Purpose:** Track perubahan status order

```sql
CREATE TABLE order_status_history (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  notes TEXT,
  changed_by VARCHAR(255),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

**TypeScript Interface:**
```typescript
interface OrderStatusHistory {
  id: string;
  orderId: string;
  oldStatus?: string;
  newStatus: string;
  notes?: string;
  changedBy?: string;
  changedAt: Date;
}
```

---

## 3. INDEXES (Optimisasi Query)

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Shipping Addresses
CREATE INDEX idx_shipping_addresses_user_id ON shipping_addresses(user_id);
CREATE INDEX idx_shipping_addresses_is_default ON shipping_addresses(user_id, is_default);

-- Payment Methods
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);

-- Orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

-- Order Items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Payment Transactions
CREATE INDEX idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);

-- Order Status History
CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);
```

---

## 4. RELATIONSHIPS & FOREIGN KEYS

```
Users (1) ──→ (N) ShippingAddresses
Users (1) ──→ (N) PaymentMethods
Users (1) ──→ (N) Orders

Orders (1) ──→ (N) OrderItems
Orders (1) ──→ (N) PaymentTransactions
Orders (1) ──→ (N) OrderStatusHistory

Orders (N) ──→ (1) ShippingAddresses
Orders (N) ──→ (1) PaymentMethods

Products (1) ──→ (N) OrderItems
```

---

## 5. SAMPLE DATA FLOW

### Contoh: Alur Checkout Order

```
1. User membuka halaman checkout
   - Query: SELECT * FROM users WHERE id = 'user123'
   - Query: SELECT * FROM shipping_addresses WHERE user_id = 'user123'
   - Query: SELECT * FROM payment_methods WHERE user_id = 'user123'

2. User memilih shipping address dan payment method
   - Validasi data

3. User submit checkout
   - INSERT INTO orders (...)
   - INSERT INTO order_items (...) [untuk setiap item di cart]
   - INSERT INTO payment_transactions (...)
   - UPDATE orders SET order_status = 'confirmed' WHERE id = 'order123'
   - INSERT INTO order_status_history (...)

4. Konfirmasi pembayaran
   - UPDATE payment_transactions SET status = 'success' WHERE id = 'trans123'
   - UPDATE orders SET payment_status = 'completed' WHERE id = 'order123'
   - INSERT INTO order_status_history (...)
   - CLEAR cart
   - Redirect ke /orders page
```

---

## 6. IMPLEMENTATION OPTIONS

### Option A: Prisma ORM (Recommended)

**File: `prisma/schema.prisma`**

```prisma
// User Model
model User {
  id        String    @id @default(uuid())
  name      String
  email     String    @unique
  phone     String?
  address   String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  shippingAddresses ShippingAddress[]
  paymentMethods    PaymentMethod[]
  orders            Order[]
}

// ShippingAddress Model
model ShippingAddress {
  id            String  @id @default(uuid())
  user          User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId        String
  recipientName String
  email         String
  phone         String
  address       String
  city          String
  state         String
  postalCode    String
  country       String
  isDefault     Boolean @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  orders Order[]

  @@index([userId])
}

// PaymentMethod Model
model PaymentMethod {
  id             String   @id @default(uuid())
  user           User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId         String?
  methodType     String   // 'bank_transfer', 'cod', 'credit_card', 'e_wallet'
  displayName    String
  bankName       String?
  accountNumber  String?
  accountHolder  String?
  isDefault      Boolean  @default(false)
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  orders              Order[]
  paymentTransactions PaymentTransaction[]

  @@index([userId])
}

// Product Model
model Product {
  id           String  @id @default(uuid())
  name         String
  description  String?
  price        Decimal @db.Decimal(10, 2)
  category     String
  imageUrl     String
  stockQuantity Int    @default(0)
  material     String?
  size         String?
  shape        String?
  usage        String?
  reviewsCount Int     @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  orderItems OrderItem[]

  @@index([category])
}

// Order Model
model Order {
  id                   String   @id @default(uuid())
  user                 User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId               String
  orderNumber          String   @unique
  
  subtotal             Decimal  @db.Decimal(12, 2)
  taxAmount            Decimal  @db.Decimal(12, 2)
  taxPercentage        Int      @default(3)
  shippingCost         Decimal  @default(0) @db.Decimal(12, 2)
  additionalFees       Decimal  @default(0) @db.Decimal(12, 2)
  totalAmount          Decimal  @db.Decimal(12, 2)
  currency             String   @default("USD")
  
  shippingAddress      ShippingAddress @relation(fields: [shippingAddressId], references: [id])
  shippingAddressId    String
  
  paymentMethod        PaymentMethod? @relation(fields: [paymentMethodId], references: [id])
  paymentMethodId      String?
  paymentMethodType    String
  paymentStatus        String   @default("pending")
  paymentDate          DateTime?
  
  orderStatus          String   @default("pending")
  trackingNumber       String?
  estimatedDeliveryDate DateTime?
  actualDeliveryDate   DateTime?
  
  notes                String?
  couponCode           String?
  discountAmount       Decimal  @default(0) @db.Decimal(12, 2)
  
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  items                OrderItem[]
  transactions         PaymentTransaction[]
  statusHistory        OrderStatusHistory[]

  @@index([userId])
  @@index([orderNumber])
  @@index([createdAt])
  @@index([orderStatus])
  @@index([paymentStatus])
}

// OrderItem Model
model OrderItem {
  id          String  @id @default(uuid())
  order       Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId     String
  product     Product @relation(fields: [productId], references: [id])
  productId   String
  productName String
  quantity    Int
  unitPrice   Decimal @db.Decimal(12, 2)
  subtotal    Decimal @db.Decimal(12, 2)
  notes       String?
  createdAt   DateTime @default(now())

  @@index([orderId])
  @@index([productId])
}

// PaymentTransaction Model
model PaymentTransaction {
  id              String   @id @default(uuid())
  order           Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId         String
  paymentMethod   PaymentMethod? @relation(fields: [paymentMethodId], references: [id])
  paymentMethodId String?
  transactionRef  String?  @unique
  amount          Decimal  @db.Decimal(12, 2)
  status          String   @default("pending")
  paymentResponse Json?
  errorMessage    String?
  processedAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([orderId])
  @@index([status])
}

// OrderStatusHistory Model
model OrderStatusHistory {
  id        String   @id @default(uuid())
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId   String
  oldStatus String?
  newStatus String
  notes     String?
  changedBy String?
  changedAt DateTime @default(now())

  @@index([orderId])
}
```

**Commands:**
```bash
# Install Prisma
npm install @prisma/client
npm install -D prisma

# Initialize schema
npx prisma init

# Run migrations
npx prisma migrate dev --name init_checkout_schema

# Generate client
npx prisma generate

# View database
npx prisma studio
```

---

### Option B: TypeORM

```typescript
// entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './Order';
import { ShippingAddress } from './ShippingAddress';
import { PaymentMethod } from './PaymentMethod';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true, type: 'text' })
  address: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(() => ShippingAddress, address => address.user)
  shippingAddresses: ShippingAddress[];

  @OneToMany(() => PaymentMethod, method => method.user)
  paymentMethods: PaymentMethod[];
}
```

---

## 7. BEST PRACTICES

1. **Data Validation**
   - Validate email format
   - Validate phone number format
   - Validate postal code format
   - Validate amount is positive

2. **Security**
   - Never store credit card numbers in full
   - Use encryption for sensitive data
   - Implement transaction rollback on payment failure
   - Audit trail untuk semua perubahan

3. **Performance**
   - Use proper indexes
   - Paginate order queries
   - Cache frequently accessed data
   - Use connection pooling

4. **Data Integrity**
   - Use foreign keys
   - Implement cascading deletes carefully
   - Validate order total matches items sum
   - Prevent duplicate order numbers

5. **Audit & Compliance**
   - Log all payment transactions
   - Keep order status history
   - Archive old orders properly
   - Comply with data protection regulations

---

## 8. MIGRATION CHECKLIST

- [ ] Create database
- [ ] Run all migrations
- [ ] Create indexes
- [ ] Set up constraints
- [ ] Seed sample data
- [ ] Test relationships
- [ ] Verify query performance
- [ ] Set up backups
- [ ] Document column purposes
- [ ] Train team on schema

---

## 9. CONTOH QUERIES

### Get User Orders dengan Items
```sql
SELECT o.*, oi.*, p.name as product_name
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
WHERE o.user_id = 'user123'
ORDER BY o.created_at DESC;
```

### Get Order Status History
```sql
SELECT * FROM order_status_history
WHERE order_id = 'order123'
ORDER BY changed_at DESC;
```

### Get Payment Status
```sql
SELECT o.order_number, pt.status, pt.amount, pt.processed_at
FROM orders o
JOIN payment_transactions pt ON o.id = pt.order_id
WHERE o.user_id = 'user123'
ORDER BY pt.created_at DESC;
```

---

Dokumentasi ini dapat digunakan sebagai referensi untuk implementasi database checkout system yang robust dan scalable.
