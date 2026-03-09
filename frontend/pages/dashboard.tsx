import { useEffect, useState } from "react";
import {
  Package,
  AlertTriangle,
  Users,
  TrendingUp,
  BadgeDollarSign,
  ShoppingCart
} from "lucide-react";
import PageHeader from "../components/pageheader";

export default function Dashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    activeBatches: 0,
    alerts: 0,
    catalogSize: 0
  });
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!window.api) return;
    try {
      const data = await window.api.analytics.getStats();
      setStats(data);

      const lowStock = await window.api.analytics.getLowStock();
      setLowStockItems(lowStock);
    } catch (err) {
      console.error("Dashboard: Error loading stats", err);
    }
  };

  const cards = [
    {
      label: "Total Revenue",
      value: `Rp ${stats.revenue.toLocaleString()}`,
      icon: BadgeDollarSign,
      color: "#10b981"
    },
    {
      label: "Active Production",
      value: stats.activeBatches.toString(),
      icon: TrendingUp,
      color: "#3b82f6"
    },
    {
      label: "Stock Alerts",
      value: stats.alerts.toString(),
      icon: AlertTriangle,
      color: "#ef4444"
    },
    {
      label: "Product Catalog",
      value: stats.catalogSize.toString(),
      icon: ShoppingCart,
      color: "#8b5cf6"
    },
  ];

  return (
    <>
      <PageHeader title="Overview" />

      <div className="dashboard-grid">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="stat-card">
              <div
                className="stat-icon"
                style={{ backgroundColor: `${card.color}15`, color: card.color }}
              >
                <Icon size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">{card.label}</span>
                <span className="stat-value">{card.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-sections">
        <section className="dashboard-section highlight">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <AlertTriangle size={20} color="#ef4444" />
            <h3 style={{ margin: 0 }}>Low Stock Materials</h3>
          </div>

          {lowStockItems.length === 0 ? (
            <p style={{ color: '#666' }}>All raw materials are within safe levels.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lowStockItems.map((item, idx) => (
                <div key={idx} style={{
                  padding: '12px',
                  background: '#fff',
                  borderRadius: '8px',
                  borderLeft: '4px solid #ef4444',
                  display: 'flex',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                  <span style={{ color: '#ef4444' }}>
                    Only {item.stock} {item.unit} left (Min: {item.minStock})
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <h3>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <button className="btn-secondary" style={{ padding: '15px', textAlign: 'center' }}>
              Weekly Report
            </button>
            <button className="btn-secondary" style={{ padding: '15px', textAlign: 'center' }}>
              Backup Database
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
