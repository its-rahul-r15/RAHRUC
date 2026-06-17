import React, { useState, useEffect } from 'react';
import { Menu, Search, User as UserIcon, Sun, Moon } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

export default function Topbar({ onSearch }) {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Simple debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchQuery);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  return (
    <header className="h-16 border-b border-border-subtle bg-page-background px-6 flex items-center justify-between gap-4 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="text-muted-text hover:text-body-text hover:bg-surface-muted p-2 rounded-lg transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-secondary-text absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search files and folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-muted border border-transparent rounded-lg text-sm text-body-text placeholder-secondary-text focus:outline-none focus:bg-white focus:border-border-subtle transition-all"
          />
        </div>
      </div>

      {/* Dark Mode Toggle & Profile Info */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-muted-text hover:text-body-text hover:bg-surface-muted p-2 rounded-xl transition-all cursor-pointer"
          title="Toggle Dark Mode"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-warning" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="font-plus-jakarta font-medium text-sm text-heading-text">{user?.name}</span>
            <span className="text-xs text-secondary-text">{user?.email}</span>
          </div>
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-border-subtle object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-orange-primary/10 border border-orange-primary/20 flex items-center justify-center text-orange-primary font-medium text-sm">
              <UserIcon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
