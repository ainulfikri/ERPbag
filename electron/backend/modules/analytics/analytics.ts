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

export function getRecentlyCompletedBatches(limit = 5) {
    return db.prepare(`
    SELECT pb.*, p.name as productName, t.name as tailorName
    FROM production_batches pb
    JOIN products p ON pb.productId = p.id
    JOIN tailors t ON pb.tailorId = t.id
    WHERE pb.status = 'Completed'
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
