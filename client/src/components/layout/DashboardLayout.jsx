import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useUiStore } from '../../store/uiStore';

export default function DashboardLayout({ children, onSearch }) {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-page-background relative">
      {/* Sidebar mobile backdrop */}
      {sidebarOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/45 z-40 md:hidden transition-opacity duration-300"
        />
      )}
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar onSearch={onSearch} />
        <main className="flex-1 overflow-y-auto bg-page-background">
          {children}
        </main>
      </div>
    </div>
  );
}
