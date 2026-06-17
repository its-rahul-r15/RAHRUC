import React, { useState } from 'react';

export default function CreateFolderModal({ isOpen, onClose, onCreate }) {
  const [folderName, setFolderName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreate(folderName.trim());
      setFolderName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 font-inter">
      <div className="bg-white border border-border-subtle rounded-2xl w-full max-w-md p-6 shadow-xl">
        <h3 className="font-plus-jakarta font-bold text-lg text-heading-text mb-4">New Folder</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Folder name"
            required
            autoFocus
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-primary focus:border-orange-primary bg-white"
          />
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border-subtle rounded-lg text-sm font-medium hover:bg-surface-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-primary hover:bg-orange-primary/95 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
