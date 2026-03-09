import { useEffect, useState } from "react";
import type { Tailor } from "../types/tailor";
import PageHeader from "../components/pageheader";
import Table from "../components/table";
import StatusBadge from "../components/statusbadge";
import { UserPlus } from "lucide-react";

export default function TailorPage() {
  const [tailors, setTailors] = useState<Tailor[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    loadTailors();
  }, []);

  const loadTailors = () => {
    if (!window.api) return;
    window.api.tailor.getAll()
      .then(setTailors)
      .catch(console.error);
  };

  const handleToggleActive = (id: number, currentStatus: boolean) => {
    if (!window.api) return;
    window.api.tailor.toggleActive(id, currentStatus ? 0 : 1)
      .then(loadTailors)
      .catch(console.error);
  };

  const handleAddTailor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.api) return;

    window.api.tailor.add({ name, phone })
      .then(() => {
        setShowAdd(false);
        setName("");
        setPhone("");
        loadTailors();
      })
      .catch(err => {
        alert("Error adding tailor: " + err.message);
      });
  };

  return (
    <>
      <PageHeader
        title="Tailors"
        action={
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            <UserPlus size={18} style={{ marginRight: '8px' }} />
            Add Tailor
          </button>
        }
      />

      <Table
        columns={[
          { header: "Name", render: t => t.name },
          { header: "Phone", render: t => t.phone || "-" },
          {
            header: "Status",
            render: t => (
              <StatusBadge
                status={t.active ? "active" : "inactive"}
                label={t.active ? "Active" : "Inactive"}
                onClick={() => handleToggleActive(t.id, !!t.active)}
              />
            ),
          },
        ]}
        data={tailors}
      />

      {showAdd && (
        <div className="modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Add New Tailor</h2>
            <form onSubmit={handleAddTailor} className="material-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Pak Budi"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 0812..."
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Tailor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}