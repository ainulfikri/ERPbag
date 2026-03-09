import { useEffect, useState } from "react";
import { Edit2, Trash2 } from "lucide-react";

// layout & shared UI
import Layout from "../components/layout";
import PageHeader from "../components/pageheader";
import Table from "../components/table";
import StatusBadge from "../components/statusbadge";
import MaterialModal from "../components/materialmodal";
import type { Material, NewMaterial } from "../types/material";

/* ---------------- HELPERS ---------------- */
function getStockStatus(material: Material) {
  if (material.stock === 0) return "out";
  if (material.stock < material.minStock) return "low";
  return "available";
}

/* ---------------- COMPONENT ---------------- */
export default function Inventory() {
  // State for table data
  const [data, setData] = useState<Material[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  // Load data ONCE when page opens
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    if (!window.api) return;
    window.api.inventory.getAll()
      .then(setData)
      .catch(console.error);
  };

  const handleOpenAdd = () => {
    setEditingMaterial(null);
    setShowModal(true);
  };

  const handleOpenEdit = (material: Material) => {
    setEditingMaterial(material);
    setShowModal(true);
  };

  const handleSaveMaterial = (formData: NewMaterial) => {
    if (!window.api) return;

    const promise = editingMaterial
      ? window.api.inventory.update(editingMaterial.id, formData)
      : window.api.inventory.add(formData);

    promise
      .then(() => {
        setShowModal(false);
        setEditingMaterial(null);
        loadData();
      })
      .catch(console.error);
  };

  const handleDeleteMaterial = (id: number) => {
    if (!window.api) return;
    if (!confirm("Are you sure you want to delete this material?")) return;

    window.api.inventory.delete(id)
      .then(loadData)
      .catch(console.error);
  };

  return (
    <>
      <PageHeader
        title="Inventory"
        action={
          <button className="btn-primary" onClick={handleOpenAdd}>
            Add Material
          </button>
        }
      />

      {/* EMPTY STATE */}
      {data.length === 0 && (
        <div className="empty-state">
          <p>No materials yet.</p>
          <button className="btn-primary" onClick={handleOpenAdd}>
            Add your first material
          </button>
        </div>
      )}

      {/*table for displaying materials*/}
      {data.length > 0 && (
        <Table
          columns={[
            { header: "Name", render: m => m.name },
            { header: "Category", render: m => m.category },
            { header: "Stock", render: m => `${m.stock} ${m.unit}` },
            {
              header: "Status",
              render: m => (
                <StatusBadge status={getStockStatus(m)} />
              ),
            },
            {
              header: "Actions",
              render: m => (
                <div className="table-actions">
                  <button className="btn-icon" onClick={() => handleOpenEdit(m)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn-icon delete" onClick={() => handleDeleteMaterial(m.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ),
            },
          ]}
          data={data}
        />
      )}

      {/*modal for adding/editing material*/}
      {showModal && (
        <MaterialModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveMaterial}
          initialData={editingMaterial}
        />
      )}
    </>
  );
}
