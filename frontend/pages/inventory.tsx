import { useEffect, useState } from "react";
import {
  Edit2,
  Trash2,
  Layers,
  Scissors,
  Box,
  Package,
  AlertCircle,
  Plus
} from "lucide-react";

// layout & shared UI
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

function getCategoryIcon(category: string) {
  const c = category.toLowerCase();
  if (c.includes("fabric") || c.includes("material")) return <Layers size={18} />;
  if (c.includes("thread") || c.includes("zipper") || c.includes("hardware")) return <Scissors size={18} />;
  return <Box size={18} />;
}

/* ---------------- COMPONENT ---------------- */
export default function Inventory() {
  const [data, setData] = useState<Material[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!window.api) return;
    try {
      const materials = await window.api.inventory.getAll();
      setData(materials);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
        title="Raw Materials"
        action={
          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} style={{ marginRight: '8px' }} />
            Add Material
          </button>
        }
      />

      <div style={{ padding: '0 40px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading inventory...</div>
        ) : data.length === 0 ? (
          <div style={{
            padding: '80px 40px',
            textAlign: 'center',
            background: '#fff',
            borderRadius: '20px',
            border: '2px dashed #e2e8f0'
          }}>
            <div style={{ marginBottom: '20px', color: '#94a3b8' }}>
              <Package size={64} style={{ margin: '0 auto' }} />
            </div>
            <h2 style={{ marginBottom: '10px' }}>No Materials Found</h2>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>Start by adding fabrics, threads, or hardware to your inventory.</p>
            <button className="btn-primary" onClick={handleOpenAdd}>
              Add Your First Material
            </button>
          </div>
        ) : (
          <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
            <Table
              columns={[
                {
                  header: "Item Name",
                  render: m => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b'
                      }}>
                        {getCategoryIcon(m.category)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{m.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{m.category}</div>
                      </div>
                    </div>
                  )
                },
                {
                  header: "Stock Level",
                  render: m => {
                    const isLow = m.stock < m.minStock;
                    const stockPct = Math.min((m.stock / (m.minStock * 2)) * 100, 100);
                    return (
                      <div style={{ width: '160px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600, color: isLow ? '#ef4444' : '#10b981' }}>
                            {m.stock} {m.unit}
                          </span>
                          <span style={{ color: '#94a3b8' }}>Min: {m.minStock}</span>
                        </div>
                        <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${stockPct}%`,
                            height: '100%',
                            background: isLow ? '#ef4444' : '#10b981',
                            borderRadius: '3px'
                          }} />
                        </div>
                      </div>
                    );
                  }
                },
                {
                  header: "Status",
                  render: m => <StatusBadge status={getStockStatus(m)} />,
                },
                {
                  header: "Actions",
                  render: m => (
                    <div className="table-actions">
                      <button className="btn-icon" onClick={() => handleOpenEdit(m)} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDeleteMaterial(m.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ),
                },
              ]}
              data={data}
            />
          </div>
        )}
      </div>

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
