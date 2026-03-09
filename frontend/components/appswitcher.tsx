import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    ClipboardList,
    BadgeDollarSign
} from "lucide-react";

type AppDef = {
    id: string;
    label: string;
    icon: any;
    color: string;
};

type Props = {
    onSelect: (appId: string) => void;
};

const apps: AppDef[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "#00A09D" },
    { id: "inventory", label: "Inventory", icon: Package, color: "#875A7B" },
    { id: "products", label: "Catalog", icon: ShoppingBag, color: "#F06050" },
    { id: "tailor", label: "Tailors", icon: Users, color: "#E9AE1D" },
    { id: "production", label: "Production", icon: ClipboardList, color: "#21B799" },
    { id: "sales", label: "Sales & CRM", icon: BadgeDollarSign, color: "#455A64" },
];

export default function AppSwitcher({ onSelect }: Props) {
    return (
        <div className="app-switcher">
            <div className="app-grid">
                {apps.map((app) => {
                    const Icon = app.icon;
                    return (
                        <button
                            key={app.id}
                            className="app-item"
                            onClick={() => onSelect(app.id)}
                        >
                            <div className="app-icon-wrapper" style={{ color: app.color }}>
                                <Icon size={36} />
                            </div>
                            <span>{app.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
