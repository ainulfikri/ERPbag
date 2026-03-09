import { Database } from 'better-sqlite3';

// initialize the database schema
export function initSchema(db: Database) {
  console.log("Database: Initializing schema...");
  try {
    // 1. Materials
    db.prepare(`
      CREATE TABLE IF NOT EXISTS materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        unit TEXT NOT NULL,
        minStock INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    console.log("Database: materials table ready.");

    // 2. Tailors
    db.prepare(`
      CREATE TABLE IF NOT EXISTS tailors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        active INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    console.log("Database: tailors table ready.");

    // 3. Products
    db.prepare(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        unit TEXT NOT NULL DEFAULT 'pcs',
        stock INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    console.log("Database: products table ready.");

    // 4. Production Batches
    db.prepare(`
      CREATE TABLE IF NOT EXISTS production_batches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productId INTEGER NOT NULL,
        materialId INTEGER NOT NULL,
        tailorId INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'In Progress',
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (productId) REFERENCES products(id),
        FOREIGN KEY (materialId) REFERENCES materials(id),
        FOREIGN KEY (tailorId) REFERENCES tailors(id)
      )
    `).run();
    console.log("Database: production_batches table ready.");

    // 5. Customers
    db.prepare(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        balance INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    console.log("Database: customers table ready.");

    // 6. Sales Orders
    db.prepare(`
      CREATE TABLE IF NOT EXISTS sales_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerId INTEGER,
        orderDate TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        totalAmount INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'Draft',
        paymentStatus TEXT NOT NULL DEFAULT 'Unpaid',
        FOREIGN KEY (customerId) REFERENCES customers(id)
      )
    `).run();
    console.log("Database: sales_orders table ready.");

    // 7. Order Items
    db.prepare(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER NOT NULL,
        productId INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price INTEGER NOT NULL,
        FOREIGN KEY (orderId) REFERENCES sales_orders(id),
        FOREIGN KEY (productId) REFERENCES products(id)
      )
    `).run();
    console.log("Database: order_items table ready.");

    console.log("Database: Schema initialization complete.");
  } catch (err) {
    console.error("Database: Initialization ERROR!", err);
  }
}