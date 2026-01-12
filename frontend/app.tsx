import { useState } from "react";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard";
import Inventory from "./pages/inventory";
import Tailor from "./pages/tailor";
import Production from "./pages/production";
import "./styles/modal.css";

export default function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "inventory":
        return <Inventory />;
      case "tailor":
        return <Tailor />;
      case "production":
        return <Production />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      {renderPage()}
    </Layout>
  );
}
