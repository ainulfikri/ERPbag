import "../styles/status-badge.css";

type Props = {
  status: "available" | "low" | "out" | "active" | "inactive";
  label?: string;
  onClick?: () => void;
};

export default function StatusBadge({ status, label, onClick }: Props) {
  const isClickable = Boolean(onClick);

  const Tag = isClickable ? "button" : "span";

  return (
    <Tag
      className={`status status-${status} ${isClickable ? "status-clickable" : ""}`}
      onClick={onClick}
    >
      {label || status.toUpperCase()}
    </Tag>
  );
}
