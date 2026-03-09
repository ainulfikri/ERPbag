import { useState, useEffect } from "react";
import type { Material, NewMaterial } from "../types/material";

interface MaterialModalProps {
  onClose: () => void;
  onSave: (material: NewMaterial) => void;
  initialData?: Material | null;
}

export default function MaterialModal({ onClose, onSave, initialData }: MaterialModalProps) {
  const [formData, setFormData] = useState<NewMaterial>({
    name: "",
    category: "Fabric",
    stock: 0,
    unit: "pcs",
    minStock: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category,
        stock: initialData.stock,
        unit: initialData.unit,
        minStock: initialData.minStock,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{initialData ? "Edit Material" : "Add Material"}</h2>
        <form onSubmit={handleSubmit} className="material-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Spunbond 75gsm Blue"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              >
                <option value="Fabric">Fabric</option>
                <option value="Non-Fabric">Non-Fabric</option>
              </select>
            </div>
            <div className="form-group">
              <label>Unit</label>
              <input
                type="text"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="pcs, meter, etc."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{initialData ? "Current Stock" : "Initial Stock"}</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="form-group">
              <label>Min. Stock Alert</label>
              <input
                type="number"
                min="0"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {initialData ? "Update Changes" : "Save Material"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
