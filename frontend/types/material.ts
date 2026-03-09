export type MaterialCategory = "Fabric" | "Non-Fabric";

export type Material = {
  id: number;
  name: string;
  category: MaterialCategory;
  stock: number;
  unit: string;
  minStock: number;
};

export type NewMaterial = Omit<Material, "id">;
