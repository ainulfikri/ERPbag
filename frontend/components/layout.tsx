import Sidebar from "./sidebar";
import TopBar from "./topbar";

type Props = {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onHome: () => void;
  isHome: boolean;
};

export default function Layout({ children, currentPage, onNavigate, onHome, isHome }: Props) {
  const getAppName = () => {
    switch (currentPage) {
      case "dashboard": return "Dashboard";
      case "inventory": return "Inventory";
      case "tailor": return "Tailors";
      case "products": return "Product Catalog";
      case "production": return "Production";
      case "sales": return "Sales & CRM";
      default: return "ERPBag";
    }
  };

  if (isHome) {
    return <main>{children}</main>;
  }

  return (
    <div className="layout-container">
      <TopBar appName={getAppName()} onHome={onHome} />
      <div className="odoo-layout">
        <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
        <main className="odoo-main">
          <div className="odoo-content-padding">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
