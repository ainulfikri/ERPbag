import { useEffect, useState } from "react";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  BadgeDollarSign,
  ShoppingCart,
  Clock,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import PageHeader from "../components/pageheader";

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return date.toLocaleDateString();
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    activeBatches: 0,
    alerts: 0,
    catalogSize: 0
  });
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [recentBatches, setRecentBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!window.api) return;
    try {
      const [statsData, lowStock, sales, batches] = await Promise.all([
        window.api.analytics.getStats(),
        window.api.analytics.getLowStock(),
        window.api.analytics.getRecentSales(),
        window.api.analytics.getRecentBatches()
      ]);

      setStats(statsData);
      setLowStockItems(lowStock);
      setRecentSales(sales);
      setRecentBatches(batches);
    } catch (err) {
      console.error("Dashboard: Error loading data", err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      label: "Total Revenue",
      value: `Rp ${stats.revenue.toLocaleString()}`,
      icon: BadgeDollarSign,
      color: "#10B981", // Emerald
      bg: "linear-gradient(135deg, #10B981 0%, #059669 100%)"
    },
    {
      label: "Active Production",
      value: stats.activeBatches.toString(),
      icon: TrendingUp,
      color: "#3B82F6", // Blue
      bg: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"
    },
    {
      label: "Low Stock Alerts",
      value: stats.alerts.toString(),
      icon: AlertTriangle,
      color: "#EF4444", // Rose
      bg: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
    },
    {
      label: "Product Catalog",
      value: stats.catalogSize.toString(),
      icon: ShoppingCart,
      color: "#8B5CF6", // Purple
      bg: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)"
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
        <Clock className="animate-spin" size={24} style={{ marginRight: '12px' }} />
        <span>Loading insights...</span>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Business Overview" />

      <div className="dashboard-grid">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="stat-card" style={{ borderLeft: `4px solid ${card.color}` }}>
              <div
                className="stat-icon"
                style={{ background: `${card.color}15`, color: card.color }}
              >
                <Icon size={28} />
              </div>
              <div className="stat-info">
                <span className="stat-label">{card.label}</span>
                <span className="stat-value">{card.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>

        {/* Recent Sales Feed */}
        <section className="premium-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: '#F0FDF4', borderRadius: '10px', color: '#166534' }}>
                <BadgeDollarSign size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Recent Sales</h3>
            </div>
            <button className="btn-icon">
              <ArrowRight size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentSales.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No recent sales recorded.</p>
            ) : (
              recentSales.map((order) => (
                <div key={order.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{order.customerName || "Walk-in Customer"}</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Order #{order.id.toString().padStart(4, '0')} • {formatTimeAgo(order.createdAt)}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#059669' }}>Rp {order.totalAmount.toLocaleString()}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{order.status}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recent Production Feed */}
        <section className="premium-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: '#EFF6FF', borderRadius: '10px', color: '#1E40AF' }}>
                <TrendingUp size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Live Production</h3>
            </div>
            <button className="btn-icon">
              <ArrowRight size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentBatches.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No production activity.</p>
            ) : (
              recentBatches.map((batch) => (
                <div key={batch.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{batch.productName}</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Tailor: {batch.tailorName} • {formatTimeAgo(batch.createdAt)}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#2563EB' }}>{batch.quantity} Units</div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: batch.status === 'Completed' ? '#059669' : '#D97706',
                      fontWeight: 600
                    }}>{batch.status}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Alerts & Inventory Section */}
        <section className="premium-card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '8px', background: '#FEF2F2', borderRadius: '10px', color: '#991B1B' }}>
              <AlertTriangle size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Inventory Alerts</h3>
          </div>

          {lowStockItems.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', background: '#F0FDF4', borderRadius: '16px', border: '1px dashed #BBF7D0' }}>
              <p style={{ color: '#166534', margin: 0, fontWeight: 500 }}>Global inventory is healthy. All materials are above minimum levels.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {lowStockItems.map((item, idx) => (
                <div key={idx} style={{
                  padding: '16px',
                  background: '#fff',
                  borderRadius: '16px',
                  border: '1px solid #fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 2px 4px rgba(239, 68, 68, 0.05)'
                }}>
                  <div style={{ width: '8px', height: '40px', background: '#EF4444', borderRadius: '4px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>{item.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#EF4444', fontWeight: 600 }}>
                      Only {item.stock} {item.unit} left
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'right' }}>
                    Min: {item.minStock}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
