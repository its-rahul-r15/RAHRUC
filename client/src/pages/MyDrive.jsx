import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import UploadDropzone from '../components/files/UploadDropzone';
import UploadQueue from '../components/files/UploadQueue';
import CreateFolderModal from '../components/folders/CreateFolderModal';
import MoveModal from '../components/folders/MoveModal';
import FileContextMenu from '../components/files/FileContextMenu';
import LightboxViewer from '../components/files/LightboxViewer';
import ShareModal from '../components/files/ShareModal';
import { useUploadStore } from '../store/uploadStore';
import { useUiStore } from '../store/uiStore';
import api from '../api/axiosInstance';
import { Folder, File, MoreVertical, Grid, List, Plus, FolderPlus, ArrowLeft, Star, Trash, ChevronRight, HardDrive, AlertCircle, Loader } from 'lucide-react';

export default function MyDrive() {
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);

  // Context menu
  const [contextMenu, setContextMenu] = useState(null); // { item, type, x, y }

  // Lightbox
  const [activePreviewFile, setActivePreviewFile] = useState(null);

  // Zustand stores
  const uploadFile = useUploadStore((s) => s.uploadFile);
  const { viewMode, setViewMode } = useUiStore();

  const fetchContents = async () => {
    setLoading(true);
    try {
      const folderParam = currentFolderId ? currentFolderId : 'root';
      const endpoint = searchQuery 
        ? `/search?q=${searchQuery}${currentFolderId ? `&folderId=${currentFolderId}` : ''}`
        : `/folders/${folderParam}/contents`;

      const res = await api.get(endpoint);
      if (res.data.success) {
        if (searchQuery) {
          setFolders(res.data.data.folders || []);
          setFiles(res.data.data.files || []);
          setBreadcrumbs([]);
        } else {
          setFolders(res.data.data.folders || []);
          setFiles(res.data.data.files || []);
          setBreadcrumbs(res.data.data.breadcrumbs || []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [currentFolderId, searchQuery]);

  const handleUpload = async (file) => {
    const uploaded = await uploadFile(file, currentFolderId);
    if (uploaded) {
      fetchContents();
      window.dispatchEvent(new Event('file-uploaded'));
    }
  };

  const handleCreateFolder = async (name) => {
    try {
      const res = await api.post('/folders', { name, parentFolder: currentFolderId });
      if (res.data.success) {
        fetchContents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRename = async (item, type) => {
    const newName = prompt(`Rename ${type}:`, item.name);
    if (!newName || !newName.trim()) return;

    try {
      const endpoint = type === 'folder' ? `/folders/${item._id}` : `/files/${item._id}`;
      const res = await api.patch(endpoint, { name: newName.trim() });
      if (res.data.success) {
        fetchContents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveTrigger = (item, type) => {
    setSelectedItem(item);
    setSelectedItemType(type);
    setIsMoveModalOpen(true);
  };

  const handleMoveSubmit = async (targetFolderId) => {
    if (!selectedItem) return;

    try {
      const endpoint = selectedItemType === 'folder'
        ? `/folders/${selectedItem._id}/move`
        : `/files/${selectedItem._id}/move`;

      const payload = selectedItemType === 'folder'
        ? { parentFolder: targetFolderId }
        : { folderId: targetFolderId };

      const res = await api.patch(endpoint, payload);
      if (res.data.success) {
        setIsMoveModalOpen(false);
        setSelectedItem(null);
        fetchContents();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Move failed');
    }
  };

  const handleStar = async (file) => {
    try {
      const res = await api.patch(`/files/${file._id}/star`);
      if (res.data.success) {
        fetchContents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShareTrigger = (file) => {
    setSelectedItem(file);
    setIsShareModalOpen(true);
  };

  const handleShareUpdated = (updatedFile) => {
    setSelectedItem(updatedFile);
    setFiles(prev => prev.map(f => f._id === updatedFile._id ? updatedFile : f));
  };

  const handleDelete = async (item, type, permanent) => {
    const confirmMsg = permanent 
      ? `Are you sure you want to permanently delete this ${type}?`
      : `Move this ${type} to trash?`;

    if (!confirm(confirmMsg)) return;

    try {
      const endpoint = type === 'folder' ? `/folders/${item._id}` : `/files/${item._id}`;
      const res = await api.delete(endpoint);
      if (res.data.success) {
        fetchContents();
        window.dispatchEvent(new Event('file-uploaded'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFolderDoubleClick = (folder) => {
    setCurrentFolderId(folder._id);
  };

  const handleFileDoubleClick = (file) => {
    setActivePreviewFile(file);
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

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <DashboardLayout onSearch={setSearchQuery}>
      <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 font-inter">
        {/* Breadcrumbs & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-secondary-text">
            <button
              onClick={() => setCurrentFolderId(null)}
              className="hover:text-orange-primary flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <HardDrive className="w-4 h-4" />
              <span>Root</span>
            </button>
            {breadcrumbs.map((crumb) => (
              <React.Fragment key={crumb.id}>
                <ChevronRight className="w-3.5 h-3.5" />
                <button
                  onClick={() => setCurrentFolderId(crumb.id)}
                  className="hover:text-orange-primary font-medium transition-colors cursor-pointer"
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="border border-border-subtle bg-white rounded-lg p-0.5 flex items-center">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md cursor-pointer transition-all ${
                  viewMode === 'grid' ? 'bg-surface-muted text-heading-text' : 'text-secondary-text hover:text-body-text'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md cursor-pointer transition-all ${
                  viewMode === 'list' ? 'bg-surface-muted text-heading-text' : 'text-secondary-text hover:text-body-text'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsFolderModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 border border-border-subtle hover:bg-surface-muted bg-white rounded-lg text-xs font-semibold text-body-text transition-all cursor-pointer shadow-xs"
            >
              <FolderPlus className="w-4 h-4 text-orange-primary" />
              <span>New Folder</span>
            </button>
          </div>
        </div>

        {/* Upload Dropzone */}
        <UploadDropzone onUpload={handleUpload} />

        {/* Content Explorer */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader className="w-8 h-8 animate-spin text-orange-primary" />
            <span className="text-sm text-secondary-text">Fetching files...</span>
          </div>
        ) : folders.length === 0 && files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-border-subtle rounded-2xl p-8 shadow-xs">
            <AlertCircle className="w-12 h-12 text-secondary-text mb-4" />
            <h3 className="font-plus-jakarta font-semibold text-base text-heading-text mb-1">No items found</h3>
            <p className="text-sm text-secondary-text max-w-xs">
              {searchQuery ? 'Try matching files/folders by other search words.' : 'This folder is empty. Drag and drop files to get started.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Folders Grid/List */}
            {folders.length > 0 && (
              <div>
                <h3 className="font-plus-jakarta font-semibold text-sm text-heading-text mb-3">Folders</h3>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {folders.map((folder) => (
                      <div
                        key={folder._id}
                        onDoubleClick={() => handleFolderDoubleClick(folder)}
                        className="bg-white border border-border-subtle rounded-xl p-4 flex items-center justify-between gap-3 hover:border-orange-primary/30 transition-all cursor-pointer select-none group relative shadow-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Folder className="w-10 h-10 text-orange-primary fill-orange-primary/10 shrink-0" />
                          <span className="text-sm font-medium text-body-text truncate">{folder.name}</span>
                        </div>
                        <button
                          onClick={(e) => handleContextMenuOpen(e, folder, 'folder')}
                          className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-surface-muted text-secondary-text transition-all cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-border-subtle rounded-xl overflow-hidden shadow-xs">
                    <table className="min-w-full divide-y divide-border-subtle">
                      <tbody className="divide-y divide-border-subtle">
                        {folders.map((folder) => (
                          <tr
                            key={folder._id}
                            onDoubleClick={() => handleFolderDoubleClick(folder)}
                            className="hover:bg-surface-muted/50 cursor-pointer select-none"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-body-text flex items-center gap-3">
                              <Folder className="w-5 h-5 text-orange-primary" />
                              <span>{folder.name}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-text">—</td>
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
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Files Grid/List */}
            {files.length > 0 && (
              <div>
                <h3 className="font-plus-jakarta font-semibold text-sm text-heading-text mb-3">Files</h3>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {files.map((file) => {
                      const thumbUrl = file.thumbnailFileId 
                        ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/files/${file._id}/thumbnail`
                        : null;

                      return (
                        <div
                          key={file._id}
                          onDoubleClick={() => handleFileDoubleClick(file)}
                          className="bg-white border border-border-subtle rounded-xl overflow-hidden hover:border-orange-primary/30 transition-all cursor-pointer select-none group relative shadow-xs flex flex-col"
                        >
                          {/* File Preview block */}
                          <div className="h-28 bg-[#fbfbfb] border-b border-border-subtle flex items-center justify-center relative overflow-hidden">
                            {thumbUrl ? (
                              <img src={thumbUrl} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <File className="w-10 h-10 text-secondary-text" />
                            )}
                            {file.isStarred && (
                              <Star className="w-4 h-4 fill-amber-warning text-amber-warning absolute top-2 left-2" />
                            )}
                          </div>
                          <div className="p-3 flex items-center justify-between gap-3 min-w-0">
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-semibold text-body-text truncate">{file.name}</span>
                              <span className="text-[10px] text-secondary-text">{formatBytes(file.size)}</span>
                            </div>
                            <button
                              onClick={(e) => handleContextMenuOpen(e, file, 'file')}
                              className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-surface-muted text-secondary-text transition-all cursor-pointer shrink-0"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white border border-border-subtle rounded-xl overflow-hidden shadow-xs">
                    <table className="min-w-full divide-y divide-border-subtle">
                      <thead className="bg-[#fbfbfb]">
                        <tr>
                          <th className="px-6 py-3 text-left text-[11px] font-semibold text-secondary-text uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-[11px] font-semibold text-secondary-text uppercase tracking-wider">Size</th>
                          <th className="px-6 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle">
                        {files.map((file) => (
                          <tr
                            key={file._id}
                            onDoubleClick={() => handleFileDoubleClick(file)}
                            className="hover:bg-surface-muted/50 cursor-pointer select-none"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-body-text flex items-center gap-3">
                              <File className="w-5 h-5 text-secondary-text" />
                              <div className="flex items-center gap-2">
                                <span>{file.name}</span>
                                {file.isStarred && <Star className="w-3.5 h-3.5 fill-amber-warning text-amber-warning shrink-0" />}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-text">
                              {formatBytes(file.size)}
                            </td>
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
              </div>
            )}
          </div>
        )}

        {/* Modals and Overlays */}
        <CreateFolderModal
          isOpen={isFolderModalOpen}
          onClose={() => setIsFolderModalOpen(false)}
          onCreate={handleCreateFolder}
        />

        <MoveModal
          isOpen={isMoveModalOpen}
          onClose={() => { setIsMoveModalOpen(false); setSelectedItem(null); }}
          onMove={handleMoveSubmit}
          currentItem={selectedItem}
        />

        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => { setIsShareModalOpen(false); setSelectedItem(null); }}
          file={selectedItem}
          onShareUpdated={handleShareUpdated}
        />

        {contextMenu && (
          <FileContextMenu
            item={contextMenu.item}
            type={contextMenu.type}
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onRename={handleRename}
            onMove={() => handleMoveTrigger(contextMenu.item, contextMenu.type)}
            onStar={handleStar}
            onShare={handleShareTrigger}
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

        <UploadQueue />
      </div>
    </DashboardLayout>
  );
}
