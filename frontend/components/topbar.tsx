import { LayoutGrid, Bell, Settings } from "lucide-react";

type Props = {
    appName: string;
    onHome: () => void;
};

export default function TopBar({ appName, onHome }: Props) {
    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="home-button" onClick={onHome} title="Home Menu">
                    <LayoutGrid size={20} />
                </button>
                <span className="app-name">{appName}</span>
            </div>

            <div className="topbar-right" style={{ display: 'flex', gap: '16px' }}>
                <button className="home-button">
                    <Bell size={18} />
                </button>
                <button className="home-button">
                    <Settings size={18} />
                </button>
            </div>
        </header>
    );
}
