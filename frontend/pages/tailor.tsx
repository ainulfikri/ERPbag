import { useEffect, useState } from "react";
import type { Tailor } from "../types/tailor";
import PageHeader from "../components/pageheader";
import Table from "../components/table";
import StatusBadge from "../components/statusbadge";
import { UserPlus, Phone, Users, User, ArrowRight } from "lucide-react";

function getAvatarColor(name: string) {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function TailorPage() {
  const [tailors, setTailors] = useState<Tailor[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTailors();
  }, []);

  const loadTailors = async () => {
    if (!window.api) return;
    try {
      const data = await window.api.tailor.getAll();
      setTailors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
        title="Production Partners"
        action={
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            <UserPlus size={18} style={{ marginRight: '8px' }} />
            Add Tailor
          </button>
        }
      />

      <div style={{ padding: '0 40px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading records...</div>
        ) : tailors.length === 0 ? (
          <div style={{
            padding: '80px 40px',
            textAlign: 'center',
            background: '#fff',
            borderRadius: '20px',
            border: '2px dashed #e2e8f0'
          }}>
            <div style={{ marginBottom: '20px', color: '#94a3b8' }}>
              <Users size={64} style={{ margin: '0 auto' }} />
            </div>
            <h2 style={{ marginBottom: '10px' }}>No Tailors Onboarded</h2>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>Add tailors to start assigning production batches and tracking performance.</p>
            <button className="btn-primary" onClick={() => setShowAdd(true)}>
              Register First Tailor
            </button>
          </div>
        ) : (
          <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
            <Table
              columns={[
                {
                  header: "Tailor Details",
                  render: t => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: getAvatarColor(t.name),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1rem'
                      }}>
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#94a3b8' }}>
                          <Phone size={10} />
                          {t.phone || "No phone recorded"}
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  header: "Status",
                  render: t => (
                    <div style={{ cursor: 'pointer' }} onClick={() => handleToggleActive(t.id, !!t.active)}>
                      <StatusBadge
                        status={t.active ? "active" : "inactive"}
                        label={t.active ? "Full Active" : "On Leave / Inactive"}
                      />
                    </div>
                  ),
                },
                {
                  header: "Quick Action",
                  render: t => (
                    <button
                      className="btn-icon"
                      onClick={() => handleToggleActive(t.id, !!t.active)}
                      title={t.active ? "Deactivate" : "Activate"}
                    >
                      <ArrowRight size={18} />
                    </button>
                  )
                }
              ]}
              data={tailors}
            />
          </div>
        )}
      </div>

      {showAdd && (
        <div className="modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="modal" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '10px', background: '#F0F9FF', borderRadius: '12px', color: '#0369A1' }}>
                <UserPlus size={24} />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Add New Tailor</h2>
            </div>

            <form onSubmit={handleAddTailor} className="material-form">
              <div className="form-group">
                <label>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    style={{ paddingLeft: '36px' }}
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Pak Budi"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    style={{ paddingLeft: '36px' }}
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 0812..."
                  />
                </div>
              </div>
              <div className="modal-actions" style={{ marginTop: '32px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Register Tailor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
