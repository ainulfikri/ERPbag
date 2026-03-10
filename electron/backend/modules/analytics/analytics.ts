import { db } from "../../core/db";

export function getSummaryStats() {
  // 1. Total Sales (Completed orders)
  const totalSales = db.prepare(`
    SELECT SUM(totalAmount) as total 
    FROM sales_orders 
    WHERE status = 'Completed'
  `).get() as { total: number };

  // 2. Active Production (In Progress batches)
  const activeProduction = db.prepare(`
    SELECT COUNT(*) as count 
    FROM production_batches 
    WHERE status = 'In Progress'
  `).get() as { count: number };

  // 3. Low Stock Alerts (Materials where stock < minStock)
  const lowStockCount = db.prepare(`
    SELECT COUNT(*) as count 
    FROM materials 
    WHERE stock <= minStock
  `).get() as { count: number };

  // 4. Finished Goods Stock (Total items in products catalog)
  const totalProducts = db.prepare(`
    SELECT COUNT(*) as count 
    FROM products
  `).get() as { count: number };

  return {
    revenue: totalSales.total || 0,
    activeBatches: activeProduction.count,
    alerts: lowStockCount.count,
    catalogSize: totalProducts.count
  };
}

export function getRecentSalesOrders(limit = 5) {
  return db.prepare(`
        SELECT so.id, so.totalAmount, so.status, so.createdAt,
               c.name as customerName
        FROM sales_orders so
        LEFT JOIN customers c ON so.customerId = c.id
        ORDER BY so.createdAt DESC
        LIMIT ?
    `).all(limit);
}

export function getRecentProductionBatches(limit = 5) {
  return db.prepare(`
        SELECT pb.id, pb.quantity, pb.status, pb.createdAt,
               p.name as productName,
               t.name as tailorName
        FROM production_batches pb
        JOIN products p ON pb.productId = p.id
        JOIN tailors t ON pb.tailorId = t.id
        ORDER BY pb.createdAt DESC
        LIMIT ?
    `).all(limit);
}

export function getLowStockMaterials() {
  return db.prepare(`
    SELECT name, stock, unit, minStock
    FROM materials
    WHERE stock <= minStock
    ORDER BY stock ASC
  `).all();
}

// --- Advanced Reports ---

export function getMonthlySalesReport(year?: number) {
  const targetYear = year || new Date().getFullYear();
  return db.prepare(`
        SELECT
            strftime('%Y-%m', createdAt) as month,
            COUNT(*) as totalOrders,
            SUM(totalAmount) as totalRevenue
        FROM sales_orders
        WHERE status = 'Completed'
          AND strftime('%Y', createdAt) = ?
        GROUP BY strftime('%Y-%m', createdAt)
        ORDER BY month ASC
    `).all(String(targetYear));
}

export function getMaterialUsageReport(startDate?: string, endDate?: string) {
  let query = `
        SELECT
            m.name as materialName,
            m.unit,
            SUM(pb.quantity) as totalUsed,
            COUNT(pb.id) as totalBatches
        FROM production_batches pb
        JOIN materials m ON pb.materialId = m.id
        WHERE pb.status = 'Completed'
    `;
  const params: any[] = [];
  if (startDate && endDate) {
    query += ` AND pb.createdAt BETWEEN ? AND ?`;
    params.push(startDate, endDate);
  }
  query += ` GROUP BY pb.materialId ORDER BY totalUsed DESC`;
  return db.prepare(query).all(...params);
}
