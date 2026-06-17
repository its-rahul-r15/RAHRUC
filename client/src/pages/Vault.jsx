import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import UploadDropzone from '../components/files/UploadDropzone';
import UploadQueue from '../components/files/UploadQueue';
import FileContextMenu from '../components/files/FileContextMenu';
import { encryptFile, decryptFile } from '../lib/vaultCrypto';
import { useUploadStore } from '../store/uploadStore';
import api from '../api/axiosInstance';
import { Shield, Key, Eye, EyeOff, File, MoreVertical, Loader, Lock, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function Vault() {
  const [passphrase, setPassphrase] = useState(sessionStorage.getItem('vault_passphrase') || '');
  const [tempPass, setTempPass] = useState('');
  const [unlocked, setUnlocked] = useState(!!sessionStorage.getItem('vault_passphrase'));
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  
  // Custom upload progress
  const [uploadingEncrypted, setUploadingEncrypted] = useState(false);

  const fetchEncryptedFiles = async () => {
    if (!unlocked) return;
    setLoading(true);
    try {
      // Fetch files with no folder constraint but flagged as encrypted
      const res = await api.get('/files?limit=100');
      if (res.data.success) {
        const encrypted = res.data.data.items.filter(file => file.isEncrypted);
        setFiles(encrypted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncryptedFiles();
  }, [unlocked]);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (tempPass.trim().length >= 4) {
      sessionStorage.setItem('vault_passphrase', tempPass);
      setPassphrase(tempPass);
      setUnlocked(true);
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem('vault_passphrase');
    setPassphrase('');
    setUnlocked(false);
    setFiles([]);
  };

  const handleUploadEncrypted = async (file) => {
    setUploadingEncrypted(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        // Encrypt locally
        const { ciphertext, saltHex, ivHex } = await encryptFile(arrayBuffer, passphrase);
        
        // Build FormData with ciphertext blob
        const encryptedBlob = new Blob([ciphertext], { type: 'application/octet-stream' });
        const formData = new FormData();
        formData.append('file', encryptedBlob, file.name);
        formData.append('isEncrypted', 'true');
        formData.append('iv', ivHex);
        formData.append('salt', saltHex);

        await api.post('/files/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        fetchEncryptedFiles();
        setUploadingEncrypted(false);
        window.dispatchEvent(new Event('file-uploaded'));
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error(err);
      alert('Encryption upload failed');
      setUploadingEncrypted(false);
    }
  };

  const handleDownloadDecrypted = async (file) => {
    try {
      const streamUrl = `${import.meta.env.VITE_API_BASE_URL || 'https://rahrucbackend.vercel.app/api/v1'}/files/${file._id}/stream?token=${localStorage.getItem('accessToken')}`;
      const res = await api.get(streamUrl, { responseType: 'arraybuffer' });
      
      const decryptedBuffer = await decryptFile(
        res.data,
        passphrase,
        file.encryptionMetadata.salt,
        file.encryptionMetadata.iv
      );

      // Trigger file download locally
      const decryptedBlob = new Blob([decryptedBuffer], { type: file.mimeType });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(decryptedBlob);
      downloadLink.download = file.name;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      alert('Decryption failed. Ensure your passphrase is correct.');
    }
  };

  const handleDelete = async (file) => {
    if (!confirm('Move this encrypted file to Trash?')) return;
    try {
      const res = await api.delete(`/files/${file._id}`);
      if (res.data.success) {
        fetchEncryptedFiles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 font-inter">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-plus-jakarta font-bold text-2xl text-heading-text mb-1 flex items-center gap-2">
              <Shield className="w-6 h-6 text-orange-primary" />
              <span>Private Encrypted Vault</span>
            </h2>
            <p className="text-sm text-secondary-text">Zero-Knowledge client-side encrypted storage.</p>
          </div>
          {unlocked && (
            <button
              onClick={handleLock}
              className="px-4 py-2 border border-border-subtle hover:bg-surface-muted bg-white text-body-text rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Lock Vault
            </button>
          )}
        </div>

        {!unlocked ? (
          <div className="max-w-md w-full mx-auto mt-12 bg-white border border-border-subtle rounded-2xl p-8 shadow-sm text-center">
            <div className="w-12 h-12 bg-orange-primary/10 rounded-full flex items-center justify-center text-orange-primary mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-plus-jakarta font-bold text-lg text-heading-text mb-2">Unlock Your Vault</h3>
            <p className="text-xs text-secondary-text mb-6">
              Enter your vault security passphrase. The passphrase never leaves your browser.
            </p>

            <form onSubmit={handleUnlock} className="space-y-4">
              <input
                type="password"
                placeholder="Vault Passphrase (min 4 chars)"
                required
                value={tempPass}
                onChange={(e) => setTempPass(e.target.value)}
                className="w-full px-3 py-2.5 border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-primary focus:border-orange-primary bg-white text-center"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-orange-primary hover:bg-orange-primary/95 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>Unlock Vault</span>
              </button>
            </form>

            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 text-left">
              <AlertTriangle className="w-5 h-5 text-amber-warning shrink-0" />
              <p className="text-[10px] text-amber-800 leading-normal font-medium">
                <strong>WARNING</strong>: If you forget this passphrase, your vault contents cannot be decrypted or recovered by anyone (including administrators).
              </p>
            </div>
          </div>
        ) : (
          <>
            <UploadDropzone onUpload={handleUploadEncrypted} />
            {uploadingEncrypted && (
              <div className="p-4 bg-orange-primary/10 border border-orange-primary/20 text-orange-primary rounded-xl text-xs font-semibold flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Encrypting and uploading file locally...</span>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader className="w-8 h-8 animate-spin text-orange-primary" />
                <span className="text-sm text-secondary-text">Opening Vault...</span>
              </div>
            ) : files.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-border-subtle rounded-2xl p-8 shadow-xs">
                <Shield className="w-12 h-12 text-secondary-text mb-4" />
                <h3 className="font-plus-jakarta font-semibold text-base text-heading-text mb-1">Vault is empty</h3>
                <p className="text-sm text-secondary-text max-w-xs">
                  Files dropped here are automatically encrypted in your browser before uploading.
                </p>
              </div>
            ) : (
              <div className="bg-white border border-border-subtle rounded-xl overflow-hidden shadow-xs">
                <table className="min-w-full divide-y divide-border-subtle">
                  <thead className="bg-[#fbfbfb]">
                    <tr>
                      <th className="px-6 py-3 text-left text-[11px] font-semibold text-secondary-text uppercase tracking-wider">Secure File</th>
                      <th className="px-6 py-3 text-left text-[11px] font-semibold text-secondary-text uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {files.map((file) => (
                      <tr
                        key={file._id}
                        onDoubleClick={() => handleDownloadDecrypted(file)}
                        className="hover:bg-surface-muted/50 cursor-pointer select-none"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-body-text flex items-center gap-3">
                          <Lock className="w-5 h-5 text-orange-primary shrink-0" />
                          <span>{file.name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-text">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setContextMenu({
                                item: file,
                                type: 'file',
                                x: e.clientX,
                                y: e.clientY,
                              });
                            }}
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
          </>
        )}

        {contextMenu && (
          <FileContextMenu
            item={contextMenu.item}
            type="file"
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onRename={() => {}}
            onMove={() => {}}
            onStar={() => {}}
            onDelete={handleDelete}
            isTrashView={false}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
