import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ children, onSearch }) {
  return (
    <div className="flex w-full h-screen overflow-hidden bg-page-background">
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
