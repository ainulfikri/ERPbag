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

/**
 * Update an existing material
 */
export function updateMaterial(id: number, material: Omit<Material, "id">) {
  const stmt = db.prepare(`
    UPDATE materials 
    SET name = ?, category = ?, stock = ?, unit = ?, minStock = ?
    WHERE id = ?
  `);

  return stmt.run(
    material.name,
    material.category,
    material.stock,
    material.unit,
    material.minStock,
    id
  );
}

/**
 * Delete a material
 */
export function deleteMaterial(id: number) {
  const stmt = db.prepare("DELETE FROM materials WHERE id = ?");
  return stmt.run(id);
}
