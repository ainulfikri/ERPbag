import { useState } from "react";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard";
import Inventory from "./pages/inventory";
import Tailor from "./pages/tailor";
import Production from "./pages/production";
import Products from "./pages/products";
import Sales from "./pages/sales";
import Accounting from "./pages/accounting";
import Reports from "./pages/reports";
import AppSwitcher from "./components/appswitcher";
import "./styles/modal.css";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [isHome, setIsHome] = useState(true);

  const handleSelectApp = (appId: string) => {
    setPage(appId);
    setIsHome(false);
  };

  const renderContent = () => {
    if (isHome) {
      return <AppSwitcher onSelect={handleSelectApp} />;
    }

    switch (page) {
      case "inventory":
        return <Inventory />;
      case "tailor":
        return <Tailor />;
      case "products":
        return <Products />;
      case "production":
        return <Production />;
      case "sales":
        return <Sales />;
      case "accounting":
        return <Accounting />;
      case "reports":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout
      currentPage={page}
      onNavigate={setPage}
      onHome={() => setIsHome(true)}
      isHome={isHome}
    >
      {renderContent()}
    </Layout>
  );
}
