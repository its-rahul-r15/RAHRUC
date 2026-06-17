import React, { useState } from 'react';
import api from '../../api/axiosInstance';
import { X, Copy, Check, Link2, Share2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, file, onShareUpdated }) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !file) return null;

  const handleToggleShare = async () => {
    setLoading(true);
    try {
      const res = await api.patch(`/files/${file._id}/share`);
      if (res.data.success) {
        onShareUpdated(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = `${window.location.origin}/shared/${file.shareSlug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 font-inter">
      <div className="bg-white border border-border-subtle rounded-2xl w-full max-w-md p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-secondary-text hover:text-body-text cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-primary/10 rounded-lg text-orange-primary">
            <Share2 className="w-5 h-5" />
          </div>
          <h3 className="font-plus-jakarta font-bold text-lg text-heading-text">Share File</h3>
        </div>

        <p className="text-xs text-secondary-text mb-6">
          File Name: <span className="font-medium text-body-text">{file.name}</span>
        </p>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4">
            <div>
              <p className="text-sm font-semibold text-body-text">Public Link Sharing</p>
              <p className="text-xs text-secondary-text">Anyone with the link can view or download this file.</p>
            </div>
            <button
              onClick={handleToggleShare}
              disabled={loading}
              className="text-orange-primary transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {file.isPublic ? (
                <ToggleRight className="w-12 h-12" />
              ) : (
                <ToggleLeft className="w-12 h-12 text-secondary-text" />
              )}
            </button>
          </div>

          {file.isPublic && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-secondary-text">Shareable Link</label>
              <div className="flex items-center gap-2 bg-surface-muted border border-border-subtle rounded-lg p-1.5 pl-3">
                <span className="text-xs text-body-text truncate flex-1 select-all">{shareUrl}</span>
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 bg-white border border-border-subtle rounded-md hover:bg-surface-muted text-secondary-text transition-colors flex items-center justify-center cursor-pointer shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-success" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
