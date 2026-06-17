import React from 'react';
import { X, Download, FileText, File } from 'lucide-react';

export default function LightboxViewer({ file, onClose }) {
  if (!file) return null;

  const streamUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/files/${file._id}/stream`;

  const handleDownload = () => {
    window.open(streamUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col justify-between z-50 font-inter">
      {/* Header */}
      <div className="h-16 px-6 flex items-center justify-between text-white border-b border-white/10">
        <div className="flex flex-col">
          <span className="text-sm font-medium">{file.name}</span>
          <span className="text-[11px] text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white cursor-pointer"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        {file.type === 'image' && (
          <img
            src={streamUrl}
            alt={file.name}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />
        )}
        {file.type === 'video' && (
          <video
            src={streamUrl}
            controls
            autoPlay
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />
        )}
        {file.type === 'pdf' && (
          <iframe
            src={streamUrl}
            title={file.name}
            className="w-full max-w-4xl h-[75vh] bg-white rounded-lg shadow-2xl border-0"
          />
        )}
        {file.type !== 'image' && file.type !== 'video' && file.type !== 'pdf' && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-white max-w-sm">
            <File className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-sm font-medium mb-2">{file.name}</p>
            <p className="text-xs text-gray-400 mb-6 text-center">Preview not available for this file type.</p>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-orange-primary hover:bg-orange-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
