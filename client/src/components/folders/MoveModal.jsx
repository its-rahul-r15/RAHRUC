import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { Folder, ChevronRight, Loader } from 'lucide-react';

export default function MoveModal({ isOpen, onClose, onMove, currentItem }) {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchFolders = async () => {
        setLoading(true);
        try {
          // Fetch folder lists at root to select destination
          const res = await api.get('/folders/root/contents');
          if (res.data.success) {
            // Filter out currentItem itself if it is a folder to prevent moving inside itself
            const filteredFolders = res.data.data.folders.filter(
              (f) => f._id !== currentItem?._id
            );
            setFolders(filteredFolders);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchFolders();
    }
  }, [isOpen, currentItem]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 font-inter">
      <div className="bg-white border border-border-subtle rounded-2xl w-full max-w-md p-6 shadow-xl flex flex-col max-h-[80vh]">
        <h3 className="font-plus-jakarta font-bold text-lg text-heading-text mb-4">Move Item</h3>
        
        <div className="flex-1 overflow-y-auto mb-4 border border-border-subtle rounded-xl p-2 min-h-48">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="w-6 h-6 animate-spin text-orange-primary" />
            </div>
          ) : (
            <div className="space-y-1">
              <button
                onClick={() => onMove(null)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-surface-muted flex items-center gap-2 font-medium text-orange-primary cursor-pointer"
              >
                <Folder className="w-4 h-4" />
                <span>[Root Directory]</span>
              </button>
              {folders.length === 0 ? (
                <p className="text-center text-xs text-secondary-text py-8">No other folders available</p>
              ) : (
                folders.map((f) => (
                  <button
                    key={f._id}
                    onClick={() => onMove(f._id)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-surface-muted flex items-center gap-2 text-body-text cursor-pointer"
                  >
                    <Folder className="w-4 h-4 text-secondary-text" />
                    <span>{f.name}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mt-auto">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border-subtle rounded-lg text-sm font-medium hover:bg-surface-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
