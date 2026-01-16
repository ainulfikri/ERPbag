import { db } from "../../core/db";


export type Material = {
  id: number;
  name: string;
  category: "Fabric" | "Non-Fabric";
  stock: number;
  unit: string;
  minStock: number;
};

export type NewMaterial = Omit<Material, "id">;

/**
 * Get all materials
 */
export function getAllMaterials(): Material[] {
  const stmt = db.prepare(`
    SELECT id, name, category, stock, unit, minStock
    FROM materials
    ORDER BY name
  `);

  return stmt.all() as Material[];
}

/**
 * Add a new material
 */
export function addMaterial(material: Omit<Material, "id">) {
  const stmt = db.prepare(`
    INSERT INTO materials (name, category, stock, unit, minStock)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    material.name,
    material.category,
    material.stock,
    material.unit,
    material.minStock
  );

  return result.lastInsertRowid;
}
