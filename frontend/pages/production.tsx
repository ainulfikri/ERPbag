import { useEffect, useState } from "react";
import PageHeader from "../components/pageheader";
import Table from "../components/table";
import StatusBadge from "../components/statusbadge";
import type { Material } from "../types/material";
import type { Tailor } from "../types/tailor";

type Batch = {
  id: number;
  productId: number;
  materialId: number;
  tailorId: number;
  quantity: number;
  status: string;
  createdAt: string;
  productName: string;
  materialName: string;
  tailorName: string;
};

export default function ProductionPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [tailors, setTailors] = useState<Tailor[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  // Form state
  const [prodId, setProdId] = useState("");
  const [matId, setMatId] = useState("");
  const [taiId, setTaiId] = useState("");
  const [qty, setQty] = useState(0);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    if (!window.api) return;
    try {
      const [b, m, t, p] = await Promise.all([
        window.api.production.getAll(),
        window.api.inventory.getAll(),
        window.api.tailor.getAll(),
        window.api.product.getAll(),
      ]);
      setBatches(b);
      setMaterials(m.filter(i => i.stock > 0));
      setTailors(t.filter(i => i.active));
      setProducts(p);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.api) return;

    if (!prodId || !matId || !taiId || qty <= 0) {
      alert("Please fill all fields correctly.");
      return;
    }

    const selectedMat = materials.find(m => m.id === parseInt(matId));
    if (selectedMat && qty > selectedMat.stock) {
      alert(`Not enough stock! Available: ${selectedMat.stock}`);
      return;
    }

    window.api.production.create({
      productId: parseInt(prodId),
      materialId: parseInt(matId),
      tailorId: parseInt(taiId),
      quantity: qty
    })
      .then(() => {
        setShowAdd(false);
        setProdId("");
        setMatId("");
        setTaiId("");
        setQty(0);
        loadAll();
      })
      .catch(err => {
        alert("Error creating batch: " + err.message);
      });
  };

  const handleCompleteBatch = (id: number) => {
    if (!window.api) return;
    if (!confirm("Mark this batch as completed? \nThis will increase the product warehouse stock.")) return;

    window.api.production.updateStatus(id, "Completed")
      .then(loadAll)
      .catch(console.error);
  };

  return (
    <>
      <PageHeader
        title="Production Management"
        action={
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            New Batch
          </button>
        }
      />

      {batches.length === 0 ? (
        <div className="empty-state">
          <p>No production batches yet.</p>
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            Start your first batch
          </button>
        </div>
      ) : (
        <Table
          columns={[
            { header: "Date", render: b => new Date(b.createdAt).toLocaleDateString() },
            { header: "Product", render: b => b.productName },
            { header: "Material", render: b => b.materialName },
            { header: "Tailor", render: b => b.tailorName },
            { header: "Qty", render: b => b.quantity },
            {
              header: "Status",
              render: b => (
                <StatusBadge
                  status={b.status === "In Progress" ? "low" : "active"}
                  label={b.status}
                  onClick={() => {
                    if (b.status === "In Progress") handleCompleteBatch(b.id);
                  }}
                />
              )
            },
          ]}
          data={batches}
        />
      )}

      {showAdd && (
        <div className="modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Start New Batch</h2>
            <form onSubmit={handleCreateBatch} className="material-form">
              <div className="form-group">
                <label>Product to Make</label>
                <select required value={prodId} onChange={e => setProdId(e.target.value)}>
                  <option value="">-- Choose Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {products.length === 0 && <small className="error-text">No products in catalog. Add one first!</small>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Material (Raw)</label>
                  <select required value={matId} onChange={e => setMatId(e.target.value)}>
                    <option value="">-- Choose Material --</option>
                    {materials.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.stock} {m.unit} left)</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tailor</label>
                  <select required value={taiId} onChange={e => setTaiId(e.target.value)}>
                    <option value="">-- Choose Tailor --</option>
                    {tailors.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Quantity to Produce</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={qty}
                  onChange={e => setQty(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={products.length === 0}>
                  Create Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
