import { useEffect, useState } from "react";
import PageHeader from "../components/pageheader";
import Table from "../components/table";
import { Edit2, Trash2 } from "lucide-react";

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

    // Form state
    const [name, setName] = useState("");
    const [unit, setUnit] = useState("pcs");

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        if (!window.api) return;
        window.api.product.getAll()
            .then(setProducts)
            .catch(console.error);
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
        if (!confirm("Are you sure? This will not delete production history but will remove the product from the catalog.")) return;

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
                        Add New Product
                    </button>
                }
            />

            {products.length === 0 ? (
                <div className="empty-state">
                    <p>Your product catalog is empty.</p>
                    <button className="btn-primary" onClick={handleOpenAdd}>
                        Create your first product
                    </button>
                </div>
            ) : (
                <Table
                    columns={[
                        { header: "Product Name", render: p => p.name },
                        { header: "Unit", render: p => p.unit },
                        { header: "Warehouse Stock", render: p => `${p.stock} ${p.unit}` },
                        {
                            header: "Actions",
                            render: p => (
                                <div className="table-actions">
                                    <button className="btn-icon" onClick={() => handleOpenEdit(p)}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="btn-icon delete" onClick={() => handleDelete(p.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    data={products}
                />
            )}

            {showModal && (
                <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{editingProduct ? "Edit Product" : "New Product Type"}</h2>
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
                                <input
                                    type="text"
                                    required
                                    value={unit}
                                    onChange={e => setUnit(e.target.value)}
                                    placeholder="pcs, lusin, etc."
                                />
                            </div>
                            <div className="modal-actions">
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
