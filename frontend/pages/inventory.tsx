import { useEffect ,useState } from "react";

// layout & shared UI
import Layout from "../components/layout";
import PageHeader from "../components/pageheader";
import Table from "../components/table";
import StatusBadge from "../components/statusbadge";
import type { Material } from "../types/material";

/* ---------------- HELPERS ---------------- */
function getStockStatus(material: Material) {
  if (material.stock === 0) return "out";
  if (material.stock < material.minStock) return "low";
  return "available";
}

/* ---------------- COMPONENT ---------------- */
export default function Inventory() {
  // State for table data
  const [data, setData] = useState<Material[]>([]);

  const [showAdd, setShowAdd] = useState(false);

  // Load data ONCE when page opens
  useEffect(() => {
  console.log("window.api:", window.api);

  if (!window.api) {
    console.error("API not found");
    return;
  }

  window.api.inventory.getAll()
    .then(setData)
    .catch(console.error);
}, []);

  return (
    <>
      <PageHeader
        title="Inventory"
        action={
          data.length > 0 ?(
            <button onClick={() => setShowAdd(true)}>
            Add Material
            </button>
          ) : null
        }
      />

      {/* EMPTY STATE */}
      {data.length === 0 && (
        <div className="empty-state">
          <p>No materials yet.</p>
          <button onClick={() => setShowAdd(true)}>
            Add your first material
          </button>
        </div>
      )}

      {/*table for displaying materials*/}
      {data.length > 0 && (
        <Table
          columns={[
            { header: "Name", render: m => m.name },
            { header: "Category", render: m => m.category },
            { header: "Stock", render: m => m.stock },
            { header: "Unit", render: m => m.unit },
            { header: "Min Stock", render: m => m.minStock },
            {
              header: "Status",
              render: m => (
                <StatusBadge status={getStockStatus(m)} />
              ),
            },
          ]}
          data={data}
        />
      )}

      {/*modal for adding material*/}
      {showAdd && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Add Material</h3>

            <p>Form goes here…</p>

            <button onClick={() => setShowAdd(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}