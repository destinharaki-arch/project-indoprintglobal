import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../data/checkout.db');

// Initialize database
export function initializeDatabase() {
  const db = new sqlite3.Database(dbPath);

  return new Promise<sqlite3.Database>((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          address TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err && !err.message.includes('already exists')) console.error(err);
      });

      // Products table
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          category TEXT,
          image_url TEXT,
          material TEXT,
          size TEXT,
          shape TEXT,
          usage TEXT,
          reviews_count INT DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err && !err.message.includes('already exists')) console.error(err);
      });

      // Shipping Addresses table
      db.run(`
        CREATE TABLE IF NOT EXISTS shipping_addresses (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          recipient_name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          street_address TEXT NOT NULL,
          city TEXT NOT NULL,
          state TEXT NOT NULL,
          postal_code TEXT NOT NULL,
          country TEXT NOT NULL,
          is_default BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err && !err.message.includes('already exists')) console.error(err);
      });

      // Payment Methods table
      db.run(`
        CREATE TABLE IF NOT EXISTS payment_methods (
          id TEXT PRIMARY KEY,
          user_id TEXT,
          method_type TEXT NOT NULL,
          display_name TEXT NOT NULL,
          bank_name TEXT,
          account_number TEXT,
          account_holder TEXT,
          is_default BOOLEAN DEFAULT 0,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err && !err.message.includes('already exists')) console.error(err);
      });

      // Orders table
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          order_number TEXT UNIQUE NOT NULL,
          subtotal REAL NOT NULL,
          tax_amount REAL NOT NULL,
          tax_percentage INT DEFAULT 3,
          shipping_cost REAL DEFAULT 0,
          additional_fees REAL DEFAULT 0,
          total_amount REAL NOT NULL,
          currency TEXT DEFAULT 'USD',
          shipping_address_id TEXT NOT NULL,
          payment_method_id TEXT,
          payment_method_type TEXT NOT NULL,
          payment_status TEXT DEFAULT 'pending',
          payment_date DATETIME,
          order_status TEXT DEFAULT 'pending',
          tracking_number TEXT,
          estimated_delivery_date DATE,
          actual_delivery_date DATE,
          notes TEXT,
          coupon_code TEXT,
          discount_amount REAL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY(shipping_address_id) REFERENCES shipping_addresses(id),
          FOREIGN KEY(payment_method_id) REFERENCES payment_methods(id)
        )
      `, (err) => {
        if (err && !err.message.includes('already exists')) console.error(err);
      });

      // Order Items table
      db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
          id TEXT PRIMARY KEY,
          order_id TEXT NOT NULL,
          product_id TEXT NOT NULL,
          product_name TEXT NOT NULL,
          quantity INT NOT NULL,
          unit_price REAL NOT NULL,
          subtotal REAL NOT NULL,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
          FOREIGN KEY(product_id) REFERENCES products(id)
        )
      `, (err) => {
        if (err && !err.message.includes('already exists')) console.error(err);
      });

      // Payment Transactions table
      db.run(`
        CREATE TABLE IF NOT EXISTS payment_transactions (
          id TEXT PRIMARY KEY,
          order_id TEXT NOT NULL,
          payment_method_id TEXT,
          transaction_ref TEXT UNIQUE,
          amount REAL NOT NULL,
          status TEXT DEFAULT 'pending',
          payment_response TEXT,
          error_message TEXT,
          processed_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
          FOREIGN KEY(payment_method_id) REFERENCES payment_methods(id)
        )
      `, (err) => {
        if (err && !err.message.includes('already exists')) console.error(err);
      });

      // Order Status History table
      db.run(`
        CREATE TABLE IF NOT EXISTS order_status_history (
          id TEXT PRIMARY KEY,
          order_id TEXT NOT NULL,
          old_status TEXT,
          new_status TEXT NOT NULL,
          notes TEXT,
          changed_by TEXT,
          changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err && !err.message.includes('already exists')) console.error(err);
      });

      // Create indexes
      db.run(`CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_shipping_addresses_user_id ON shipping_addresses(user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id)`, () => {
        resolve(db);
      });
    });
  });
}

// Export database instance
let dbInstance: sqlite3.Database | null = null;

export async function getDatabase(): Promise<sqlite3.Database> {
  if (!dbInstance) {
    dbInstance = await initializeDatabase();
  }
  return dbInstance;
}

// Helper function to run queries
export function runQuery(query: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    getDatabase().then(db => {
      db.run(query, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  });
}

// Helper function to get single row
export function getOne(query: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    getDatabase().then(db => {
      db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  });
}

// Helper function to get all rows
export function getAll(query: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    getDatabase().then(db => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  });
}
