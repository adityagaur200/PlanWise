
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

type MainLayoutProps = {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopBar />
        <main className="p-6 h-[calc(100vh-64px)] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
