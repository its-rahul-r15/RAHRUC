import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import FileContextMenu from '../components/files/FileContextMenu';
import api from '../api/axiosInstance';
import { Trash2, Folder, File, MoreVertical, Loader, AlertCircle } from 'lucide-react';

export default function Trash() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  const fetchTrash = async () => {
    setLoading(true);
    try {
      const res = await api.get('/trash');
      if (res.data.success) {
        setFolders(res.data.data.folders || []);
        setFiles(res.data.data.files || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestore = async (item, type) => {
    try {
      const res = await api.patch(`/trash/${item._id}/restore?type=${type}`);
      if (res.data.success) {
        fetchTrash();
        window.dispatchEvent(new Event('file-uploaded'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePermanently = async (item, type) => {
    if (!confirm(`Are you sure you want to permanently delete this ${type}? This action CANNOT be undone.`)) return;

    try {
      const res = await api.delete(`/trash/${item._id}?type=${type}`);
      if (res.data.success) {
        fetchTrash();
        window.dispatchEvent(new Event('file-uploaded'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEmptyTrash = async () => {
    if (!confirm("Are you sure you want to empty the Trash? All items will be permanently deleted from Telegram and your database.")) return;

    try {
      const res = await api.delete('/trash/empty');
      if (res.data.success) {
        fetchTrash();
        window.dispatchEvent(new Event('file-uploaded'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleContextMenuOpen = (e, item, type) => {
    e.preventDefault();
    setContextMenu({
      item,
      type,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const totalItems = folders.length + files.length;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 font-inter">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-plus-jakarta font-bold text-2xl text-heading-text mb-1">Trash</h2>
            <p className="text-sm text-secondary-text">Deleted items are kept here temporarily.</p>
          </div>
          {totalItems > 0 && (
            <button
              onClick={handleEmptyTrash}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Empty Trash
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader className="w-8 h-8 animate-spin text-orange-primary" />
            <span className="text-sm text-secondary-text">Loading Trash...</span>
          </div>
        ) : totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-border-subtle rounded-2xl p-8 shadow-xs">
            <Trash2 className="w-12 h-12 text-secondary-text mb-4" />
            <h3 className="font-plus-jakarta font-semibold text-base text-heading-text mb-1">Trash is empty</h3>
            <p className="text-sm text-secondary-text max-w-xs">
              Deleted folders and files will appear here until they are permanently removed.
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
                {/* Folders */}
                {folders.map((folder) => (
                  <tr key={folder._id} className="hover:bg-surface-muted/50 select-none">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-body-text flex items-center gap-3">
                      <Folder className="w-5 h-5 text-orange-primary shrink-0" />
                      <span>{folder.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-text">Folder</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => handleContextMenuOpen(e, folder, 'folder')}
                        className="p-1.5 rounded-lg hover:bg-surface-muted text-secondary-text transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Files */}
                {files.map((file) => (
                  <tr key={file._id} className="hover:bg-surface-muted/50 select-none">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-body-text flex items-center gap-3">
                      <File className="w-5 h-5 text-secondary-text shrink-0" />
                      <span>{file.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-text capitalize">{file.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => handleContextMenuOpen(e, file, 'file')}
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
            type={contextMenu.type}
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onRestore={handleRestore}
            onDelete={handleDeletePermanently}
            isTrashView={true}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
