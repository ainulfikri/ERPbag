import { useState } from "react";
import type { Tailor } from "../types/tailor";
import PageHeader from "../components/pageheader";
import Table from "../components/table";
import StatusBadge from "../components/statusbadge";


const initialTailors: Tailor[] = [
  { id: 1, name: "Pak Budi", phone: "08123456789", active: true },
  { id: 2, name: "Bu Sari", phone: "08129876543", active: true },
  { id: 3, name: "Mas Andi", active: false },
];

export default function TailorPage() {
  const [tailors, setTailors] = useState<Tailor[]>(initialTailors);

  const toggleActive = (id: number) => {
    setTailors(prev =>
      prev.map(t =>
        t.id === id ? { ...t, active: !t.active } : t
      )
    );
  };
  
  return (
    <>
      <PageHeader title="Tailor" action={<button>Add Tailor</button>} />

      <Table
        columns={[
          { header: "Name", render: t => t.name },
          { header: "Phone", render: t => t.phone || "-" },
          {
            header: "Status",
            render: t => (
              <StatusBadge
                status={t.active ? "active" : "inactive"}
                onClick={() => toggleActive(t.id)}
              />
            ),
          },
        ]}
        data={tailors}
      />
    </>
  );
}