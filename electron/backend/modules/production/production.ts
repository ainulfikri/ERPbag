import { db } from "../../core/db";

export type ProductionBatch = {
    id: number;
    productId: number;
    materialId: number;
    tailorId: number;
    quantity: number;
    status: "In Progress" | "Completed";
    createdAt: string;
    productName?: string;
    materialName?: string;
    tailorName?: string;
};

export function getAllBatches(): ProductionBatch[] {
    const stmt = db.prepare(`
    SELECT b.*, p.name as productName, m.name as materialName, t.name as tailorName
    FROM production_batches b
    JOIN products p ON b.productId = p.id
    JOIN materials m ON b.materialId = m.id
    JOIN tailors t ON b.tailorId = t.id
    ORDER BY b.createdAt DESC
  `);
    return stmt.all() as ProductionBatch[];
}

export function createBatch(data: { productId: number; materialId: number; tailorId: number; quantity: number }) {
    const transaction = db.transaction(() => {
        // 1. Deduct material stock (Raw Material)
        const updateMaterial = db.prepare(`
      UPDATE materials SET stock = stock - ? WHERE id = ?
    `);
        const status = updateMaterial.run(data.quantity, data.materialId);

        if (status.changes === 0) {
            throw new Error("Material not found or stock deduction failed");
        }

        // 2. Create the batch
        const insertBatch = db.prepare(`
      INSERT INTO production_batches (productId, materialId, tailorId, quantity)
      VALUES (?, ?, ?, ?)
    `);
        const result = insertBatch.run(data.productId, data.materialId, data.tailorId, data.quantity);
        return result.lastInsertRowid;
    });

    return transaction();
}

export function updateBatchStatus(id: number, status: string) {
    const transaction = db.transaction(() => {
        // 1. Update the status
        const updateStatus = db.prepare("UPDATE production_batches SET status = ? WHERE id = ?");
        updateStatus.run(status, id);

        // 2. If completed, increase product stock (Finished Goods)
        if (status === "Completed") {
            const batch = db.prepare("SELECT productId, quantity FROM production_batches WHERE id = ?").get(id) as any;
            if (batch) {
                const updateProduct = db.prepare("UPDATE products SET stock = stock + ? WHERE id = ?");
                updateProduct.run(batch.quantity, batch.productId);
            }
        }
    });

    return transaction();
}
