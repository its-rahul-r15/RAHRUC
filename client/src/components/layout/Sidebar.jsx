import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HardDrive, Image, Star, Trash2, Settings, Cloud, LogOut, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import api from '../../api/axiosInstance';

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout);
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const [storage, setStorage] = useState({ used: 0, limit: 15 * 1024 * 1024 * 1024, percentage: 0 });

  useEffect(() => {
    const fetchStorage = async () => {
      try {
        const res = await api.get('/users/storage');
        if (res.data.success) {
          setStorage(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load storage details:', err.message);
      }
    };
    fetchStorage();
    // Refresh storage stats on window upload events
    const handleUpload = () => fetchStorage();
    window.addEventListener('file-uploaded', handleUpload);
    return () => window.removeEventListener('file-uploaded', handleUpload);
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const menuItems = [
    { name: 'My Drive', path: '/drive', icon: HardDrive },
    { name: 'Photos', path: '/photos', icon: Image },
    { name: 'Vault', path: '/vault', icon: Shield },
    { name: 'Starred', path: '/starred', icon: Star },
    { name: 'Trash', path: '/trash', icon: Trash2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  if (!sidebarOpen) return null;

  return (
    <aside className="fixed md:static inset-y-0 left-0 z-50 w-64 border-r border-border-subtle bg-page-background h-screen flex flex-col justify-between p-4 transition-all duration-300 shadow-2xl md:shadow-none">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="w-9 h-9 bg-orange-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-primary/25 shrink-0">
            <Cloud className="w-5 h-5" />
          </div>
          <span className="font-plus-jakarta font-extrabold text-xl text-heading-text tracking-tight">RAHRUC</span>
        </div>

        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-orange-primary/10 text-orange-primary shadow-xs'
                    : 'text-muted-text hover:bg-slate-100/60 hover:text-heading-text'
                }`
              }
            >
              <item.icon className="w-4.5 h-4.5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        {/* Storage Bar */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2.5 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-muted-text uppercase tracking-wider">
            <span>Storage Used</span>
            <span className="text-orange-primary">{storage.percentage}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-orange-primary h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${Math.min(100, Number(storage.percentage))}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-secondary-text font-medium">
            {formatBytes(storage.used)} of {formatBytes(storage.limit)}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50/60 hover:text-red-600 transition-all w-full text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
}
