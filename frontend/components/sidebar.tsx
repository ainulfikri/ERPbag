import {
  BarChart3,
  Box,
  ClipboardList,
  Users,
  ShoppingBag,
  History,
  AlertCircle,
  BadgeDollarSign
} from "lucide-react";

type Props = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export default function Sidebar({ currentPage, onNavigate }: Props) {
  const menuItems = [
    { id: "dashboard", label: "Overview", icon: BarChart3 },
    { id: "inventory", label: "Materials", icon: Box },
    { id: "products", label: "Finished Goods", icon: ShoppingBag },
    { id: "tailor", label: "Tailors", icon: Users },
    { id: "production", label: "Production Runs", icon: ClipboardList },
    { id: "sales", label: "Sales & Orders", icon: BadgeDollarSign },
  ];

  return (
    <aside className="odoo-sidebar">
      <nav className="odoo-sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`odoo-nav-item ${currentPage === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div style={{ padding: '24px 24px 10px 24px', opacity: 0.5, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
          Reports
        </div>
        <button className="odoo-nav-item">
          <History size={18} />
          <span>Activity Log</span>
        </button>
        <button className="odoo-nav-item">
          <AlertCircle size={18} />
          <span>Low Stock Alerts</span>
        </button>
      </nav>
    </aside>
  );
}
