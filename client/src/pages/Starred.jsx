import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import LightboxViewer from '../components/files/LightboxViewer';
import FileContextMenu from '../components/files/FileContextMenu';
import api from '../api/axiosInstance';
import { Star, File, MoreVertical, Loader, AlertCircle } from 'lucide-react';

export default function Starred() {
  const [starredFiles, setStarredFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePreviewFile, setActivePreviewFile] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const fetchStarred = async () => {
    setLoading(true);
    try {
      const res = await api.get('/files?isStarred=true&limit=100');
      if (res.data.success) {
        setStarredFiles(res.data.data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStarred();
  }, []);

  const handleStarToggle = async (file) => {
    try {
      const res = await api.patch(`/files/${file._id}/star`);
      if (res.data.success) {
        fetchStarred();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (file) => {
    if (!confirm("Move this file to trash?")) return;
    try {
      const res = await api.delete(`/files/${file._id}`);
      if (res.data.success) {
        fetchStarred();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleContextMenuOpen = (e, item) => {
    e.preventDefault();
    setContextMenu({
      item,
      type: 'file',
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 font-inter">
        <div>
          <h2 className="font-plus-jakarta font-bold text-2xl text-heading-text mb-1">Starred</h2>
          <p className="text-sm text-secondary-text">Quick access to your most important files.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader className="w-8 h-8 animate-spin text-orange-primary" />
            <span className="text-sm text-secondary-text">Loading starred items...</span>
          </div>
        ) : starredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-border-subtle rounded-2xl p-8 shadow-xs">
            <Star className="w-12 h-12 text-secondary-text mb-4" />
            <h3 className="font-plus-jakarta font-semibold text-base text-heading-text mb-1">No starred files</h3>
            <p className="text-sm text-secondary-text max-w-xs">
              Star important files from their menu options to see them grouped here.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-border-subtle rounded-xl overflow-hidden shadow-xs">
            <table className="min-w-full divide-y divide-border-subtle">
              <thead className="bg-[#fbfbfb]">
                <tr>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-secondary-text uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-secondary-text uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {starredFiles.map((file) => (
                  <tr
                    key={file._id}
                    onDoubleClick={() => setActivePreviewFile(file)}
                    className="hover:bg-surface-muted/50 cursor-pointer select-none"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-body-text flex items-center gap-3">
                      <File className="w-5 h-5 text-secondary-text" />
                      <span>{file.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-text capitalize">
                      {file.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => handleContextMenuOpen(e, file)}
                        className="p-1.5 rounded-lg hover:bg-surface-muted text-secondary-text transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {contextMenu && (
          <FileContextMenu
            item={contextMenu.item}
            type="file"
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onStar={handleStarToggle}
            onDelete={handleDelete}
            isTrashView={false}
          />
        )}

        {activePreviewFile && (
          <LightboxViewer
            file={activePreviewFile}
            onClose={() => setActivePreviewFile(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
