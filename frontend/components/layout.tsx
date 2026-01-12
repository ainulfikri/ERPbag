import Sidebar from "./sidebar";

type Props = {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
};

export default function Layout({ children, currentPage, onNavigate }: Props) {
  return (
    <div className="layout">
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
      />
      <main className="content">{children}</main>
    </div>
  );
}
