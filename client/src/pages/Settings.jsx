import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuthStore } from '../store/authStore';
import api from '../api/axiosInstance';
import { Settings as SettingsIcon, ShieldAlert, Loader } from 'lucide-react';

export default function Settings() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [telegramBotToken, setTelegramBotToken] = useState(user?.telegramBotToken || '');
  const [telegramChatId, setTelegramChatId] = useState(user?.telegramChatId || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [message, setMessage] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    setMessage(null);
    try {
      const res = await api.patch('/users/profile', { name, telegramBotToken, telegramChatId });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
        // Update user state locally
        const updatedUser = { ...user, name, telegramBotToken, telegramChatId };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        useAuthStore.setState({ user: updatedUser });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoadingPassword(true);
    setMessage(null);
    try {
      const res = await api.patch('/users/password', { oldPassword, newPassword });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Password updated successfully' });
        setOldPassword('');
        setNewPassword('');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto flex flex-col gap-6 font-inter">
        <div>
          <h2 className="font-plus-jakarta font-bold text-2xl text-heading-text mb-1">Settings</h2>
          <p className="text-sm text-secondary-text">Manage your profile and security credentials.</p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-sm font-medium border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-success' 
              : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="bg-white border border-border-subtle rounded-2xl p-6 shadow-xs flex flex-col gap-4">
            <h3 className="font-plus-jakarta font-semibold text-base text-heading-text">Profile Details</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-secondary-text mb-1">Email (Read only)</label>
                <input
                  type="text"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3 py-2 bg-surface-muted border border-border-subtle rounded-lg text-sm text-muted-text cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-secondary-text mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-primary focus:border-orange-primary bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-secondary-text mb-1">Custom Telegram Bot Token (Optional)</label>
                <input
                  type="password"
                  value={telegramBotToken}
                  onChange={(e) => setTelegramBotToken(e.target.value)}
                  placeholder="e.g. 1234567890:ABCdefGhI..."
                  className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-primary focus:border-orange-primary bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-secondary-text mb-1">Custom Telegram Chat ID (Optional)</label>
                <input
                  type="text"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="e.g. -100123456789"
                  className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-primary focus:border-orange-primary bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={loadingProfile}
                className="px-4 py-2 bg-orange-primary hover:bg-orange-primary/95 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loadingProfile ? <Loader className="w-3.5 h-3.5 animate-spin" /> : 'Save Profile'}
              </button>
            </form>
          </div>

          {/* Security Card */}
          <div className="bg-white border border-border-subtle rounded-2xl p-6 shadow-xs flex flex-col gap-4">
            <h3 className="font-plus-jakarta font-semibold text-base text-heading-text">Update Password</h3>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-secondary-text mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-primary focus:border-orange-primary bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-secondary-text mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-primary focus:border-orange-primary bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={loadingPassword}
                className="px-4 py-2 bg-orange-primary hover:bg-orange-primary/95 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loadingPassword ? <Loader className="w-3.5 h-3.5 animate-spin" /> : 'Update Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Telegram Link Card */}
        <TelegramLinkCard />
      </div>
    </DashboardLayout>
  );
}

function TelegramLinkCard() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateToken = async () => {
    setLoading(true);
    try {
      const res = await api.post('/auth/link-token');
      if (res.data.success) {
        setToken(res.data.data.token);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-border-subtle rounded-2xl p-6 shadow-xs flex flex-col gap-4">
      <div>
        <h3 className="font-plus-jakarta font-semibold text-base text-heading-text">Telegram Account Linking</h3>
        <p className="text-xs text-secondary-text mt-1">
          Link your MERN account with Telegram to send or forward files directly to the Bot and catalog them instantly.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-muted p-4 rounded-xl border border-border-subtle">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-body-text">
            {token ? `Your Pairing Token: ${token}` : 'Not Linked / Generate pairing code'}
          </p>
          {token && (
            <p className="text-[11px] text-muted-text">
              Message <strong>/link {token}</strong> to your Telegram Bot to link your account.
            </p>
          )}
        </div>
        <button
          onClick={handleGenerateToken}
          disabled={loading}
          className="px-4 py-2.5 bg-orange-primary hover:bg-orange-primary/95 text-white rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer disabled:opacity-50"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : token ? 'Regenerate Token' : 'Generate Token'}
        </button>
      </div>
    </div>
  );
}
