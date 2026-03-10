import { useEffect, useState } from "react";
import PageHeader from "../components/pageheader";
import Table from "../components/table";
import StatusBadge from "../components/statusbadge";
import {
  TrendingUp,
  Plus,
  Clock,
  User,
  Package,
  Layers,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from "lucide-react";
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

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return date.toLocaleDateString();
}

export default function ProductionPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [tailors, setTailors] = useState<Tailor[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
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
    if (!confirm("Confirm quality check and mark as completed? \nStock will be updated automatically.")) return;

    window.api.production.updateStatus(id, "Completed")
      .then(loadAll)
      .catch(console.error);
  };

  return (
    <>
      <PageHeader
        title="Production Engine"
        action={
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={18} style={{ marginRight: '8px' }} />
            New Batch
          </button>
        }
      />

      <div style={{ padding: '0 40px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Syncing production lines...</div>
        ) : batches.length === 0 ? (
          <div style={{
            padding: '80px 40px',
            textAlign: 'center',
            background: '#fff',
            borderRadius: '20px',
            border: '2px dashed #e2e8f0'
          }}>
            <div style={{ marginBottom: '20px', color: '#94a3b8' }}>
              <TrendingUp size={64} style={{ margin: '0 auto' }} />
            </div>
            <h2 style={{ marginBottom: '10px' }}>No Active Batches</h2>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>Your production workshop is idle. Start a new batch to track work-in-progress.</p>
            <button className="btn-primary" onClick={() => setShowAdd(true)}>
              Start First Batch
            </button>
          </div>
        ) : (
          <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
            <Table
              columns={[
                {
                  header: "Assigned Project",
                  render: b => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '8px', background: '#F1F5F9', borderRadius: '10px', color: '#64748b' }}>
                        <Package size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{b.productName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Batch #PROD-{b.id.toString().padStart(4, '0')}</div>
                      </div>
                    </div>
                  )
                },
                {
                  header: "Production Flow",
                  render: b => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={14} style={{ color: '#94a3b8' }} />
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{b.tailorName}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                        <Layers size={14} style={{ color: '#cbd5e1' }} />
                        {b.quantity} units using {b.materialName}
                      </div>
                    </div>
                  )
                },
                {
                  header: "Status",
                  render: b => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <StatusBadge
                        status={b.status === "In Progress" ? "low" : "active"}
                        label={b.status}
                      />
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {formatTimeAgo(b.createdAt)}
                      </span>
                    </div>
                  )
                },
                {
                  header: "Control",
                  render: b => (
                    <div className="table-actions">
                      {b.status === "In Progress" ? (
                        <button className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#0ea5e9', boxShadow: 'none' }}
                          onClick={() => handleCompleteBatch(b.id)}>
                          Complete QC
                        </button>
                      ) : (
                        <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                          <CheckCircle2 size={16} /> Verified
                        </div>
                      )}
                    </div>
                  )
                },
              ]}
              data={batches}
            />
          </div>
        )}
      </div>

      {showAdd && (
        <div className="modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="modal" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '10px', background: '#ECFDF5', borderRadius: '12px', color: '#059669' }}>
                <TrendingUp size={24} />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Dispatch New Batch</h2>
            </div>

            <form onSubmit={handleCreateBatch} className="material-form">
              <div className="form-group">
                <label>Select Master Product</label>
                <div style={{ position: 'relative' }}>
                  <Package size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <select style={{ paddingLeft: '36px' }} required value={prodId} onChange={e => setProdId(e.target.value)}>
                    <option value="">-- Choose Product --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Raw Material Allocation</label>
                  <select required value={matId} onChange={e => setMatId(e.target.value)}>
                    <option value="">-- Choose Material --</option>
                    {materials.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.stock} {m.unit} free)</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Assign Tailor</label>
                  <select required value={taiId} onChange={e => setTaiId(e.target.value)}>
                    <option value="">-- Choose Tailor --</option>
                    {tailors.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Target Quantity</label>
                <div style={{ position: 'relative' }}>
                  <Plus size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    style={{ paddingLeft: '36px' }}
                    type="number"
                    min="1"
                    required
                    value={qty}
                    onChange={e => setQty(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: '32px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={products.length === 0}>
                  Send to Workshop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
