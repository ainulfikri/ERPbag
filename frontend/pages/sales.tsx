import { useEffect, useState } from "react";
import PageHeader from "../components/pageheader";
import Table from "../components/table";
import StatusBadge from "../components/statusbadge";
import {
    Plus,
    ShoppingCart,
    User,
    Search,
    Hash,
    Calendar,
    BadgeDollarSign,
    Trash2,
    Package,
    ArrowRight
} from "lucide-react";

type Order = {
    id: number;
    customerName: string;
    orderDate: string;
    totalAmount: number;
    status: string;
};

type Customer = {
    id: number;
    name: string;
};

type Product = {
    id: number;
    name: string;
    stock: number;
};

function getAvatarColor(name: string) {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    let hash = 0;
    for (let i = 0; i < (name || "Walk-in").length; i++) hash = (name || "Walk-in").charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
}

export default function SalesPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // New Order State
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | "">("");
    const [selectedItems, setSelectedItems] = useState<{ productId: number; quantity: number }[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        if (!window.api) return;
        try {
            const [ordersData, customersData, productsData] = await Promise.all([
                window.api.sales.getAllOrders(),
                window.api.sales.getAllCustomers(),
                window.api.product.getAll()
            ]);
            setOrders(ordersData);
            setCustomers(customersData);
            setProducts(productsData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!window.api || selectedItems.length === 0) return;

        try {
            const itemsWithPrice = selectedItems.map(item => ({
                ...item,
                price: 50000 // Default price
            }));

            await window.api.sales.createOrder({
                customerId: selectedCustomerId === "" ? undefined : Number(selectedCustomerId),
                items: itemsWithPrice
            });

            setShowOrderModal(false);
            setSelectedCustomerId("");
            setSelectedItems([]);
            loadData();
        } catch (err: any) {
            alert("Error: " + err.message);
        }
    };

    const addItem = () => {
        setSelectedItems([...selectedItems, { productId: 0, quantity: 1 }]);
    };

    const removeItem = (index: number) => {
        setSelectedItems(selectedItems.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, productId: number, quantity: number) => {
        const newItems = [...selectedItems];
        newItems[index] = { productId, quantity };
        setSelectedItems(newItems);
    };

    const calculateTotal = () => {
        return selectedItems.length * 50000; // Simulated
    };

    return (
        <>
            <PageHeader
                title="Revenue & Orders"
                action={
                    <button className="btn-primary" onClick={() => setShowOrderModal(true)}>
                        <Plus size={18} style={{ marginRight: '8px' }} />
                        New Checkout
                    </button>
                }
            />

            <div style={{ padding: '0 40px' }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Refreshing sales ledger...</div>
                ) : orders.length === 0 ? (
                    <div style={{
                        padding: '80px 40px',
                        textAlign: 'center',
                        background: '#fff',
                        borderRadius: '20px',
                        border: '2px dashed #e2e8f0'
                    }}>
                        <div style={{ marginBottom: '20px', color: '#94a3b8' }}>
                            <ShoppingCart size={64} style={{ margin: '0 auto' }} />
                        </div>
                        <h2 style={{ marginBottom: '10px' }}>No Sales Recorded</h2>
                        <p style={{ color: '#64748b', marginBottom: '30px' }}>Start your first transaction to see order history and financial performance.</p>
                        <button className="btn-primary" onClick={() => setShowOrderModal(true)}>
                            Initiate First Sale
                        </button>
                    </div>
                ) : (
                    <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
                        <Table
                            columns={[
                                {
                                    header: "Order Reference",
                                    render: o => (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ padding: '8px', background: '#F1F5F9', borderRadius: '10px', color: '#64748b' }}>
                                                <Hash size={18} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>ORD-{o.id.toString().padStart(4, '0')}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{formatTimeAgo(o.orderDate)}</div>
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    header: "Customer",
                                    render: o => (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                background: getAvatarColor(o.customerName),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '0.75rem',
                                                fontWeight: 700
                                            }}>
                                                {(o.customerName || "W").charAt(0)}
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{o.customerName || "Walk-in Customer"}</span>
                                        </div>
                                    )
                                },
                                {
                                    header: "Grand Total",
                                    render: o => (
                                        <div style={{ fontWeight: 800, color: '#10b981', fontSize: '1rem' }}>
                                            Rp {o.totalAmount.toLocaleString()}
                                        </div>
                                    )
                                },
                                {
                                    header: "Status",
                                    render: o => (
                                        <StatusBadge
                                            status="active"
                                            label={o.status || "Completed"}
                                        />
                                    )
                                },
                                {
                                    header: "Quick Action",
                                    render: o => (
                                        <button className="btn-icon">
                                            <ArrowRight size={18} />
                                        </button>
                                    )
                                }
                            ]}
                            data={orders}
                        />
                    </div>
                )}
            </div>

            {showOrderModal && (
                <div className="modal-backdrop" onClick={() => setShowOrderModal(false)}>
                    <div className="modal" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ padding: '10px', background: '#F0FDF4', borderRadius: '12px', color: '#166534' }}>
                                <ShoppingCart size={24} />
                            </div>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>New Sales Checkout</h2>
                        </div>

                        <form onSubmit={handleCreateOrder} className="material-form">
                            <div className="form-group">
                                <label>Customer Association</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <select
                                        style={{ paddingLeft: '36px' }}
                                        value={selectedCustomerId}
                                        onChange={e => setSelectedCustomerId(e.target.value === "" ? "" : Number(e.target.value))}
                                    >
                                        <option value="">Walk-in Customer</option>
                                        {customers.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginTop: '24px', background: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 700 }}>
                                        <Package size={18} />
                                        Order Items
                                    </div>
                                    <button type="button" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#3B82F6' }} onClick={addItem}>
                                        <Plus size={14} style={{ marginRight: '4px' }} />
                                        Add Line
                                    </button>
                                </div>

                                {selectedItems.length === 0 ? (
                                    <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', border: '1px dashed #E2E8F0', borderRadius: '12px' }}>
                                        No products added to this basket yet.
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {selectedItems.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <select
                                                    style={{ flex: 2 }}
                                                    value={item.productId}
                                                    onChange={e => updateItem(idx, Number(e.target.value), item.quantity)}
                                                >
                                                    <option value={0}>Select Product...</option>
                                                    {products.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name} ({p.stock} in stock)</option>
                                                    ))}
                                                </select>
                                                <input
                                                    style={{ width: '80px', textAlign: 'center' }}
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={e => updateItem(idx, item.productId, Number(e.target.value))}
                                                />
                                                <button type="button" className="btn-icon delete" onClick={() => removeItem(idx)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 4px', borderTop: '1px solid #f1f5f9', marginTop: '16px' }}>
                                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Total Order Value</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981' }}>
                                    Rp {calculateTotal().toLocaleString()}
                                </div>
                            </div>

                            <div className="modal-actions" style={{ marginTop: '24px' }}>
                                <button type="button" className="btn-secondary" onClick={() => setShowOrderModal(false)}>
                                    Discard
                                </button>
                                <button type="submit" className="btn-primary" disabled={selectedItems.length === 0}>
                                    Finalize Sale
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
