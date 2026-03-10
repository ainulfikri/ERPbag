import { useEffect, useState } from "react";
import PageHeader from "../components/pageheader";
import {
    Edit2,
    Trash2,
    ShoppingBag,
    Plus,
    BarChart,
    Package,
    Tag,
    Layers
} from "lucide-react";

type Product = {
    id: number;
    name: string;
    unit: string;
    stock: number;
    createdAt: string;
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    // Form state
    const [name, setName] = useState("");
    const [unit, setUnit] = useState("pcs");

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        if (!window.api) return;
        try {
            const data = await window.api.product.getAll();
            setProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => {
        setEditingProduct(null);
        setName("");
        setUnit("pcs");
        setShowModal(true);
    };

    const handleOpenEdit = (p: Product) => {
        setEditingProduct(p);
        setName(p.name);
        setUnit(p.unit);
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!window.api) return;

        const data = { name, unit };
        const promise = editingProduct
            ? window.api.product.update(editingProduct.id, data)
            : window.api.product.add(data);

        promise
            .then(() => {
                setShowModal(false);
                loadProducts();
            })
            .catch(err => {
                alert("Error saving product: " + err.message);
                console.error(err);
            });
    };

    const handleDelete = (id: number) => {
        if (!window.api) return;
        if (!confirm("Are you sure? This will hide the product from the current catalog.")) return;

        window.api.product.remove(id)
            .then(loadProducts)
            .catch(console.error);
    };

    return (
        <>
            <PageHeader
                title="Product Catalog"
                action={
                    <button className="btn-primary" onClick={handleOpenAdd}>
                        <Plus size={18} style={{ marginRight: '8px' }} />
                        Add New Product
                    </button>
                }
            />

            <div style={{ padding: '0 40px 40px' }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading masterpiece catalog...</div>
                ) : products.length === 0 ? (
                    <div style={{
                        padding: '80px 40px',
                        textAlign: 'center',
                        background: '#fff',
                        borderRadius: '20px',
                        border: '2px dashed #e2e8f0'
                    }}>
                        <div style={{ marginBottom: '20px', color: '#94a3b8' }}>
                            <ShoppingBag size={64} style={{ margin: '0 auto' }} />
                        </div>
                        <h2 style={{ marginBottom: '10px' }}>Gallery is Empty</h2>
                        <p style={{ color: '#64748b', marginBottom: '30px' }}>Define the finished bag types your team produces.</p>
                        <button className="btn-primary" onClick={handleOpenAdd}>
                            Create Product Entry
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '24px'
                    }}>
                        {products.map((p) => (
                            <div key={p.id} className="premium-card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
                                {/* Card Header / Visual */}
                                <div style={{
                                    height: '140px',
                                    background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#875A7B',
                                    borderTopLeftRadius: '16px',
                                    borderTopRightRadius: '16px',
                                    position: 'relative'
                                }}>
                                    <ShoppingBag size={48} strokeWidth={1} />
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        padding: '4px 10px',
                                        background: '#fff',
                                        borderRadius: '20px',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        color: '#64748b',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <Tag size={10} />
                                        ID: {p.id.toString().padStart(3, '0')}
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div style={{ padding: '20px' }}>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px', color: '#1e293b' }}>{p.name}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>
                                        <Layers size={14} />
                                        Measured in {p.unit}
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px',
                                        background: '#f8fafc',
                                        borderRadius: '12px',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Ready Stock</span>
                                            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: p.stock > 0 ? '#10b981' : '#f59e0b' }}>
                                                {p.stock} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{p.unit}</span>
                                            </span>
                                        </div>
                                        <div style={{ color: '#e2e8f0' }}>
                                            <BarChart size={24} />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            className="btn-secondary"
                                            style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '8px' }}
                                            onClick={() => handleOpenEdit(p)}
                                        >
                                            <Edit2 size={16} /> Edit
                                        </button>
                                        <button
                                            className="btn-icon delete"
                                            style={{ padding: '8px', borderRadius: '10px', border: '1px solid #fee2e2' }}
                                            onClick={() => handleDelete(p.id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="modal" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ padding: '10px', background: '#F5F3FF', borderRadius: '12px', color: '#5B21B6' }}>
                                <ShoppingBag size={24} />
                            </div>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{editingProduct ? "Edit Product" : "New Product Type"}</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="material-form">
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="e.g. Tote Bag Batik A4"
                                />
                            </div>
                            <div className="form-group">
                                <label>Unit of Measure</label>
                                <select
                                    value={unit}
                                    onChange={e => setUnit(e.target.value)}
                                    style={{ width: '100%' }}
                                >
                                    <option value="pcs">Pieces (pcs)</option>
                                    <option value="lusin">Dozen (lusin)</option>
                                    <option value="set">Set</option>
                                    <option value="rim">Rim</option>
                                </select>
                            </div>
                            <div className="modal-actions" style={{ marginTop: '32px' }}>
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingProduct ? "Update Product" : "Save Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
