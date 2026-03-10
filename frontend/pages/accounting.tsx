import { useEffect, useState } from "react";
import PageHeader from "../components/pageheader";
import Table from "../components/table";
import {
    Plus,
    Wallet,
    TrendingUp,
    TrendingDown,
    Calendar,
    FileText,
    BadgeDollarSign,
    ArrowUpRight,
    ArrowDownLeft,
    Receipt,
    Search
} from "lucide-react";

type Transaction = {
    id: number;
    categoryId: number;
    categoryName: string;
    categoryType: 'Income' | 'Expense';
    amount: number;
    description: string;
    date: string;
    referenceId?: number;
    referenceType?: string;
};

type Category = {
    id: number;
    name: string;
    type: 'Income' | 'Expense';
};

type ProfitLoss = {
    income: number;
    expense: number;
    profit: number;
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

export default function AccountingPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [pl, setPl] = useState<ProfitLoss>({ income: 0, expense: 0, profit: 0 });
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form State
    const [categoryId, setCategoryId] = useState<number | "">("");
    const [amount, setAmount] = useState<number | "">("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        if (!window.api) return;
        try {
            const [txData, catData, plData] = await Promise.all([
                window.api.accounting.getAllTransactions(),
                window.api.accounting.getAllCategories(),
                window.api.accounting.getProfitLoss()
            ]);
            setTransactions(txData);
            setCategories(catData);
            setPl(plData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!window.api || !categoryId || !amount) return;

        try {
            await window.api.accounting.addTransaction({
                categoryId: Number(categoryId),
                amount: Number(amount),
                description,
                date: new Date(date).toISOString()
            });

            setShowModal(false);
            setCategoryId("");
            setAmount("");
            setDescription("");
            loadData();
        } catch (err: any) {
            alert("Error: " + err.message);
        }
    };

    return (
        <>
            <PageHeader
                title="Financial Ledger"
                action={
                    <button className="btn-primary" onClick={() => setShowModal(true)}>
                        <Plus size={18} style={{ marginRight: '8px' }} />
                        Log Entry
                    </button>
                }
            />

            <div style={{ padding: '0 40px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                    <div className="premium-card" style={{
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
                        border: '1px solid #dcfce7',
                        padding: '24px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div style={{ padding: '10px', background: '#dcfce7', borderRadius: '12px', color: '#16a34a' }}>
                                <TrendingUp size={24} />
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', background: '#ecfdf5', padding: '4px 8px', borderRadius: '8px' }}>
                                Total Inflow
                            </div>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#14532d' }}>
                            Rp {pl.income.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Aggregated revenue streams</div>
                    </div>

                    <div className="premium-card" style={{
                        background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)',
                        border: '1px solid #fee2e2',
                        padding: '24px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div style={{ padding: '10px', background: '#fee2e2', borderRadius: '12px', color: '#dc2626' }}>
                                <TrendingDown size={24} />
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', background: '#fef2f2', padding: '4px 8px', borderRadius: '8px' }}>
                                Total Outflow
                            </div>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#7f1d1d' }}>
                            Rp {pl.expense.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Operational & raw material costs</div>
                    </div>

                    <div className="premium-card" style={{
                        background: pl.profit >= 0
                            ? 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)'
                            : 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)',
                        border: pl.profit >= 0 ? '1px solid #dbeafe' : '1px solid #ffedd5',
                        padding: '24px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div style={{
                                padding: '10px',
                                background: pl.profit >= 0 ? '#dbeafe' : '#ffedd5',
                                borderRadius: '12px',
                                color: pl.profit >= 0 ? '#2563eb' : '#ea580c'
                            }}>
                                <Wallet size={24} />
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: pl.profit >= 0 ? '#2563eb' : '#ea580c',
                                background: pl.profit >= 0 ? '#eff6ff' : '#fff7ed',
                                padding: '4px 8px',
                                borderRadius: '8px'
                            }}>
                                Retained Profit
                            </div>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 900, color: pl.profit >= 0 ? '#1e3a8a' : '#7c2d12' }}>
                            Rp {pl.profit.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Net financial standing</div>
                    </div>
                </div>

                <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Calculating balances...</div>
                    ) : transactions.length === 0 ? (
                        <div style={{ padding: '60px', textAlign: 'center' }}>
                            <Receipt size={48} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
                            <h3>No transactions yet</h3>
                            <p style={{ color: '#64748b' }}>Your financial history will appear here once you log entries.</p>
                        </div>
                    ) : (
                        <Table
                            columns={[
                                {
                                    header: "Timeline",
                                    render: t => (
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 700 }}>{new Date(t.date).toLocaleDateString()}</span>
                                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{formatTimeAgo(t.date)}</span>
                                        </div>
                                    )
                                },
                                {
                                    header: "Classification", render: t => (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {t.categoryType === 'Income' ? (
                                                <ArrowUpRight size={14} style={{ color: '#16a34a' }} />
                                            ) : (
                                                <ArrowDownLeft size={14} style={{ color: '#dc2626' }} />
                                            )}
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '10px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                background: t.categoryType === 'Income' ? '#dcfce7' : '#fee2e2',
                                                color: t.categoryType === 'Income' ? '#166534' : '#991b1b'
                                            }}>
                                                {t.categoryName}
                                            </span>
                                        </div>
                                    )
                                },
                                {
                                    header: "Details",
                                    render: t => (
                                        <div style={{ color: '#475569', fontSize: '0.9rem' }}>
                                            {t.description || <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>No memo provided</span>}
                                            {t.referenceType && (
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                                                    Linking: {t.referenceType} #{t.referenceId}
                                                </div>
                                            )}
                                        </div>
                                    )
                                },
                                {
                                    header: "Transaction Value",
                                    render: t => (
                                        <div style={{
                                            fontWeight: 800,
                                            fontSize: '1rem',
                                            color: t.categoryType === 'Income' ? '#16a34a' : '#dc2626'
                                        }}>
                                            {t.categoryType === 'Income' ? '+' : '-'} Rp {t.amount.toLocaleString()}
                                        </div>
                                    )
                                },
                            ]}
                            data={transactions}
                        />
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="modal" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ padding: '10px', background: '#F0F9FF', borderRadius: '12px', color: '#0369a1' }}>
                                <BadgeDollarSign size={24} />
                            </div>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Log Financial Entry</h2>
                        </div>

                        <form onSubmit={handleAddTransaction} className="material-form">
                            <div className="form-group">
                                <label>Accounting Category</label>
                                <div style={{ position: 'relative' }}>
                                    <FileText size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <select
                                        style={{ paddingLeft: '36px' }}
                                        required
                                        value={categoryId}
                                        onChange={e => setCategoryId(Number(e.target.value))}
                                    >
                                        <option value="">Select Category...</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.type}: {c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Amount (Rp)</label>
                                    <div style={{ position: 'relative' }}>
                                        <Wallet size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        <input
                                            style={{ paddingLeft: '36px' }}
                                            required
                                            type="number"
                                            value={amount}
                                            onChange={e => setAmount(Number(e.target.value))}
                                            placeholder="50000"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Posting Date</label>
                                    <input
                                        required
                                        type="date"
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Memo / Description</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Brief details about this transaction..."
                                    rows={3}
                                />
                            </div>

                            <div className="modal-actions" style={{ marginTop: '32px' }}>
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                                    Discard
                                </button>
                                <button type="submit" className="btn-primary">
                                    Save Entry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
