import { useState, useEffect } from "react";
import PageHeader from "../components/pageheader";
import {
    BarChart3,
    TrendingUp,
    Calendar,
    Layers,
    Filter,
    ArrowRight,
    ChevronRight,
    PieChart,
    Download
} from "lucide-react";

type MonthlySalesRow = {
    month: string;
    totalOrders: number;
    totalRevenue: number;
};

type MaterialUsageRow = {
    materialName: string;
    unit: string;
    totalUsed: number;
    totalBatches: number;
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatCurrency(n: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

/* ── Monthly Sales Tab ─────────────────────────────────────────────────────── */
function MonthlySalesReport() {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [data, setData] = useState<MonthlySalesRow[]>([]);
    const [loading, setLoading] = useState(false);

    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const load = async (y: number) => {
        setLoading(true);
        const rows = await window.api.analytics.getMonthlySales(y);
        setData(rows);
        setLoading(false);
    };

    useEffect(() => { load(year); }, [year]);

    const maxRevenue = Math.max(...data.map(d => d.totalRevenue), 1);
    const totalRevenue = data.reduce((s, d) => s + d.totalRevenue, 0);
    const totalOrders = data.reduce((s, d) => s + d.totalOrders, 0);

    return (
        <div>
            {/* Filter Section */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, padding: '0 4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                    <Filter size={16} />
                    Fiscal Year:
                </div>
                <select
                    value={year}
                    onChange={e => setYear(Number(e.target.value))}
                    style={{
                        padding: "8px 16px",
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        fontSize: '0.9rem',
                        cursor: "pointer",
                        background: '#fff',
                        fontWeight: 600
                    }}
                >
                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>

            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
                <div className="premium-card" style={{
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '24px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                            <TrendingUp size={24} />
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '8px' }}>
                            ANNUAL REVENUE
                        </div>
                    </div>
                    <div style={{ fontSize: '1.85rem', fontWeight: 900 }}>{formatCurrency(totalRevenue)}</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '4px' }}>Gross sales performance for {year}</div>
                </div>

                <div className="premium-card" style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '24px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                            <BarChart3 size={24} />
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '8px' }}>
                            ORDER VOLUME
                        </div>
                    </div>
                    <div style={{ fontSize: '1.85rem', fontWeight: 900 }}>{totalOrders.toLocaleString()}</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '4px' }}>Successfully processed transactions</div>
                </div>
            </div>

            {/* Visual Analytics */}
            {loading ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Generating year-over-year insights...</div>
            ) : data.length === 0 ? (
                <div className="premium-card" style={{ padding: '60px', textAlign: 'center', background: '#f8fafc' }}>
                    <BarChart3 size={48} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
                    <h3 style={{ margin: '0 0 8px 0' }}>Data Insufficient</h3>
                    <p style={{ color: '#64748b', margin: 0 }}>No transaction history found for the fiscal year {year}.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className="premium-card" style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b' }}>Monthly Revenue Trajectory</div>
                            <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: '#94a3b8', alignItems: 'center' }}>
                                <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '2px' }}></div>
                                Targeted Inflow
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "flex-end", gap: '14px', height: 220, paddingBottom: '20px' }}>
                            {MONTH_LABELS.map((label, i) => {
                                const monthKey = `${year}-${String(i + 1).padStart(2, "0")}`;
                                const row = data.find(d => d.month === monthKey);
                                const rev = row?.totalRevenue || 0;
                                const pct = rev > 0 ? Math.max((rev / maxRevenue) * 100, 4) : 0;
                                return (
                                    <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, height: '100%' }}>
                                        <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                                            <div
                                                title={rev > 0 ? formatCurrency(rev) : "No activity"}
                                                style={{
                                                    width: "100%",
                                                    height: `${pct}%`,
                                                    background: rev > 0 ? "linear-gradient(180deg, #3b82f6 0%, #60a5fa 100%)" : "#f1f5f9",
                                                    borderRadius: "12px 12px 6px 6px",
                                                    transition: "height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    boxShadow: rev > 0 ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none'
                                                }}
                                                className="chart-bar"
                                            />
                                        </div>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: rev > 0 ? "#475569" : "#cbd5e1" }}>{label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, color: '#1e293b' }}>
                            Tabular Breakdown
                        </div>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ background: "#F8FAFC" }}>
                                    <th style={{ padding: "14px 24px", textAlign: "left", color: "#64748b", fontWeight: 700 }}>FISCAL MONTH</th>
                                    <th style={{ padding: "14px 24px", textAlign: "right", color: "#64748b", fontWeight: 700 }}>TRANSACTIONS</th>
                                    <th style={{ padding: "14px 24px", textAlign: "right", color: "#64748b", fontWeight: 700 }}>REVENUE INFLOW</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, idx) => (
                                    <tr key={row.month} style={{ borderTop: "1px solid #f1f5f9" }}>
                                        <td style={{ padding: "14px 24px", fontWeight: 600, color: '#1e293b' }}>{row.month}</td>
                                        <td style={{ padding: "14px 24px", textAlign: "right", color: '#64748b' }}>{row.totalOrders}</td>
                                        <td style={{ padding: "14px 24px", textAlign: "right", fontWeight: 800, color: "#0ea5e9" }}>{formatCurrency(row.totalRevenue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Material Usage Tab ────────────────────────────────────────────────────── */
function MaterialUsageReport() {
    const [data, setData] = useState<MaterialUsageRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const load = async () => {
        setLoading(true);
        const rows = await window.api.analytics.getMaterialUsage(
            startDate || undefined,
            endDate || undefined
        );
        setData(rows);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const totalUsed = data.reduce((s, d) => s + d.totalUsed, 0);

    return (
        <div>
            {/* Filter Section */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap", padding: '0 4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                    <Calendar size={16} />
                    Date Range:
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="date" value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: '0.9rem', fontWeight: 600 }}
                    />
                    <ArrowRight size={14} style={{ color: '#cbd5e1' }} />
                    <input
                        type="date" value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: '0.9rem', fontWeight: 600 }}
                    />
                </div>
                <button
                    onClick={load}
                    className="btn-primary"
                    style={{ padding: "8px 20px", fontSize: '0.85rem' }}
                >
                    Extract Report
                </button>
                {(startDate || endDate) && (
                    <button
                        onClick={() => { setStartDate(""); setEndDate(""); setTimeout(load, 0); }}
                        className="btn-secondary"
                        style={{ padding: "8px 16px", fontSize: '0.85rem' }}
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
                <div className="premium-card" style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '24px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                            <Layers size={24} />
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '8px' }}>
                            RESOURCE VARIETY
                        </div>
                    </div>
                    <div style={{ fontSize: '1.85rem', fontWeight: 900 }}>{data.length} Types</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '4px' }}>Unique materials utilized in production</div>
                </div>

                <div className="premium-card" style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '24px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                            <PieChart size={24} />
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '8px' }}>
                            TOTAL CONSUMPTION
                        </div>
                    </div>
                    <div style={{ fontSize: '1.85rem', fontWeight: 900 }}>{totalUsed.toLocaleString()} Units</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '4px' }}>Aggregated raw material outflow</div>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Analyzing workshop logs...</div>
            ) : data.length === 0 ? (
                <div className="premium-card" style={{ padding: '60px', textAlign: 'center', background: '#f8fafc' }}>
                    <Layers size={48} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
                    <h3 style={{ margin: '0 0 8px 0' }}>No Consumption Logs</h3>
                    <p style={{ color: '#64748b', margin: 0 }}>No production activities recorded for the selected period.</p>
                </div>
            ) : (
                <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, color: '#1e293b', display: 'flex', justifyContent: 'space-between' }}>
                        Resource Allocation Ledger
                        <Download size={18} style={{ color: '#94a3b8', cursor: 'pointer' }} />
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ background: "#F8FAFC" }}>
                                <th style={{ padding: "14px 24px", textAlign: "left", color: "#64748b", fontWeight: 700 }}>MATERIAL NAME</th>
                                <th style={{ padding: "14px 24px", textAlign: "right", color: "#64748b", fontWeight: 700 }}>ALLOCATED</th>
                                <th style={{ padding: "14px 24px", textAlign: "right", color: "#64748b", fontWeight: 700 }}>PROJECTS</th>
                                <th style={{ padding: "14px 24px", textAlign: "right", color: "#64748b", fontWeight: 700 }}>ALLOCATION RATIO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, idx) => {
                                const maxUsage = Math.max(...data.map(d => d.totalUsed), 1);
                                const pct = Math.round((row.totalUsed / maxUsage) * 100);
                                return (
                                    <tr key={row.materialName} style={{ borderTop: "1px solid #f1f5f9" }}>
                                        <td style={{ padding: "14px 24px" }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                                                <span style={{ fontWeight: 700, color: '#1e293b' }}>{row.materialName}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: "14px 24px", textAlign: "right" }}>
                                            <span style={{ fontWeight: 800, color: '#475569' }}>{row.totalUsed.toLocaleString()}</span>
                                            <span style={{ color: "#94a3b8", fontSize: '0.75rem', marginLeft: '4px' }}>{row.unit}</span>
                                        </td>
                                        <td style={{ padding: "14px 24px", textAlign: "right", fontWeight: 600, color: '#64748b' }}>{row.totalBatches}</td>
                                        <td style={{ padding: "14px 24px" }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
                                                <div style={{ width: 100, height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                                                    <div style={{ width: `${pct}%`, height: "100%", background: "#10b981", borderRadius: 4 }} />
                                                </div>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: "#64748b", width: 32, textAlign: "right" }}>{pct}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

/* ── Main Reports Page ─────────────────────────────────────────────────────── */
export default function Reports() {
    const [tab, setTab] = useState<"sales" | "materials">("sales");

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <PageHeader
                title="Business Intelligence"
                action={
                    <div style={{ display: "inline-flex", background: "#f1f5f9", borderRadius: 14, padding: 4, gap: 4 }}>
                        <button
                            className={`btn-primary ${tab !== 'sales' ? 'btn-ghost' : ''}`}
                            style={{
                                padding: "8px 20px",
                                fontSize: '0.85rem',
                                border: 'none',
                                background: tab === 'sales' ? '#3b82f6' : 'transparent',
                                color: tab === 'sales' ? '#fff' : '#64748b',
                                borderRadius: 10,
                                boxShadow: tab === 'sales' ? '0 2px 8px rgba(59, 130, 246, 0.25)' : 'none'
                            }}
                            onClick={() => setTab("sales")}
                        >
                            Revenue
                        </button>
                        <button
                            className={`btn-primary ${tab !== 'materials' ? 'btn-ghost' : ''}`}
                            style={{
                                padding: "8px 20px",
                                fontSize: '0.85rem',
                                border: 'none',
                                background: tab === 'materials' ? '#10b981' : 'transparent',
                                color: tab === 'materials' ? '#fff' : '#64748b',
                                borderRadius: 10,
                                boxShadow: tab === 'materials' ? '0 2px 8px rgba(16, 185, 129, 0.25)' : 'none'
                            }}
                            onClick={() => setTab("materials")}
                        >
                            Inventory
                        </button>
                    </div>
                }
            />

            <div style={{ padding: '0 40px' }}>
                <div style={{ marginBottom: 32, padding: '0 4px' }}>
                    <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: "#94a3b8", margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Operational Insights
                    </h2>
                    <p style={{ color: "#64748b", marginTop: 4, fontSize: '1rem', fontWeight: 500 }}>
                        {tab === 'sales'
                            ? "Advanced analysis of monthly revenue streams and fiscal performance."
                            : "Deep dive into production efficiency and raw resource allocation."
                        }
                    </p>
                </div>

                {tab === "sales" ? <MonthlySalesReport /> : <MaterialUsageReport />}
            </div>
        </div>
    );
}
