import { useEffect, useState } from "react";
import PageHeader from "../components/pageheader";
import Table from "../components/table";
import { Plus, ShoppingCart, User, Search } from "lucide-react";

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

export default function SalesPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    // New Order State
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | "">("");
    const [selectedItems, setSelectedItems] = useState<{ productId: number; quantity: number }[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        if (!window.api) return;
        try {
            const ordersData = await window.api.sales.getAllOrders();
            setOrders(ordersData);

            const customersData = await window.api.sales.getAllCustomers();
            setCustomers(customersData);

            const productsData = await window.api.product.getAll();
            setProducts(productsData);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!window.api || selectedItems.length === 0) return;

        try {
            // For now, we'll fetch price from the product (simulated as 50000)
            const itemsWithPrice = selectedItems.map(item => ({
                ...item,
                price: 50000 // Default price for now
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

    const updateItem = (index: number, productId: number, quantity: number) => {
        const newItems = [...selectedItems];
        newItems[index] = { productId, quantity };
        setSelectedItems(newItems);
    };

    return (
        <>
            <PageHeader
                title="Sales Orders"
                action={
                    <button className="btn-primary" onClick={() => setShowOrderModal(true)}>
                        <Plus size={18} style={{ marginRight: '8px' }} />
                        New Sale
                    </button>
                }
            />

            <Table
                columns={[
                    { header: "Order #", render: o => `#${o.id.toString().padStart(4, '0')}` },
                    { header: "Customer", render: o => o.customerName || "Walk-in" },
                    { header: "Date", render: o => new Date(o.orderDate).toLocaleDateString() },
                    { header: "Total", render: o => `Rp ${o.totalAmount.toLocaleString()}` },
                    {
                        header: "Status",
                        render: o => (
                            <span style={{
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                background: '#dcfce7',
                                color: '#166534'
                            }}>
                                {o.status}
                            </span>
                        )
                    },
                ]}
                data={orders}
            />

            {showOrderModal && (
                <div className="modal-backdrop" onClick={() => setShowOrderModal(false)}>
                    <div className="modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
                            <ShoppingCart size={24} color="#00A09D" />
                            <h2 style={{ margin: 0 }}>Create Sales Order</h2>
                        </div>

                        <form onSubmit={handleCreateOrder} className="material-form">
                            <div className="form-group">
                                <label>Customer</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <select
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

                            <div style={{ marginTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <label style={{ fontWeight: 600 }}>Products</label>
                                    <button type="button" className="btn-secondary btn-sm" onClick={addItem}>
                                        + Add Item
                                    </button>
                                </div>

                                {selectedItems.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <select
                                            style={{ flex: 2 }}
                                            value={item.productId}
                                            onChange={e => updateItem(idx, Number(e.target.value), item.quantity)}
                                        >
                                            <option value={0}>Select Product...</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
                                            ))}
                                        </select>
                                        <input
                                            style={{ flex: 1 }}
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={e => updateItem(idx, item.productId, Number(e.target.value))}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="modal-actions" style={{ marginTop: '30px' }}>
                                <button type="button" className="btn-secondary" onClick={() => setShowOrderModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" disabled={selectedItems.length === 0}>
                                    Confirm Sale
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
