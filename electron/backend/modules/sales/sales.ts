import { db } from "../../core/db";
import * as accounting from "../accounting/accounting";


// Customers
export function getAllCustomers() {
  return db.prepare("SELECT * FROM customers ORDER BY name ASC").all();
}

export function addCustomer(data: { name: string; phone?: string; address?: string }) {
  const stmt = db.prepare("INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)");
  return stmt.run(data.name, data.phone, data.address).lastInsertRowid;
}

// Sales Orders
export function getAllOrders() {
  return db.prepare(`
    SELECT so.*, c.name as customerName 
    FROM sales_orders so 
    LEFT JOIN customers c ON so.customerId = c.id 
    ORDER BY so.orderDate DESC
  `).all();
}

export function createOrder(data: {
  customerId?: number;
  items: { productId: number; quantity: number; price: number }[]
}) {
  const transaction = db.transaction(() => {
    // 1. Calculate total
    const total = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 2. Create Order
    const stmtOrder = db.prepare(`
      INSERT INTO sales_orders (customerId, totalAmount, status) 
      VALUES (?, ?, 'Completed')
    `);
    const orderId = stmtOrder.run(data.customerId || null, total).lastInsertRowid as number;

    // 3. Add Items & Deduct Stock
    const stmtItem = db.prepare(`
      INSERT INTO order_items (orderId, productId, quantity, price) 
      VALUES (?, ?, ?, ?)
    `);
    const stmtStock = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?");

    for (const item of data.items) {
      stmtItem.run(orderId, item.productId, item.quantity, item.price);
      stmtStock.run(item.quantity, item.productId);
    }

    // 4. Create Accounting Transaction
    const salesCategory = db.prepare("SELECT id FROM accounting_categories WHERE name = 'Sales'").get() as { id: number };
    if (salesCategory) {
      accounting.addTransaction({
        categoryId: salesCategory.id,
        amount: total,
        description: `Sale Order #${orderId}`,
        referenceId: orderId as number,
        referenceType: 'Sales'
      });
    }

    return orderId;
  });

  return transaction();
}

export function getOrderItems(orderId: number) {
  return db.prepare(`
    SELECT oi.*, p.name as productName 
    FROM order_items oi 
    JOIN products p ON oi.productId = p.id 
    WHERE oi.orderId = ?
  `).all(orderId);
}
