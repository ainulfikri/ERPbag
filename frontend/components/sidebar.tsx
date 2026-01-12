type Props = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export default function Sidebar({ currentPage, onNavigate }: Props) {
  return (
    <aside className="sidebar">
      <h2>ERPBag</h2>

      <button onClick={() => onNavigate("dashboard")}>
        Dashboard
      </button>

      <button onClick={() => onNavigate("inventory")}>
        Inventory
      </button>

      <button onClick={() => onNavigate("tailor")}>
        Tailor
      </button>

      <button onClick={() => onNavigate("production")}>
        Production
      </button>
    </aside>
  );
}
