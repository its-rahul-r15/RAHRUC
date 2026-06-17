import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Download, File, Loader, AlertCircle, Cloud } from 'lucide-react';

export default function PublicView() {
  const { slug } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://rahrucbackend.vercel.app/api/v1';
  const downloadUrl = `${apiBase}/files/public/${slug}/stream`;

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await axios.get(`${apiBase}/files/public/${slug}`);
        if (res.data.success) {
          setFile(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Shared file link is expired or invalid');
      } finally {
        setLoading(false);
      }
    };
    fetchMetadata();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center gap-3 font-inter">
        <Loader className="w-8 h-8 animate-spin text-orange-primary" />
        <span className="text-sm text-secondary-text">Loading shared file...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 font-inter">
        <div className="bg-white border border-border-subtle rounded-2xl p-8 max-w-sm w-full text-center shadow-xs">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-plus-jakarta font-bold text-lg text-heading-text mb-2">Access Denied</h3>
          <p className="text-sm text-secondary-text mb-6">{error}</p>
          <a
            href="/login"
            className="inline-block w-full py-2.5 bg-orange-primary hover:bg-orange-primary/95 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-inter">
      {/* Mini header */}
      <header className="h-16 bg-white border-b border-border-subtle px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Cloud className="text-orange-primary w-8 h-8" />
          <span className="font-plus-jakarta font-bold text-xl text-heading-text tracking-tight">TeleDrive</span>
        </div>
        <button
          onClick={() => window.open(downloadUrl, '_blank')}
          className="flex items-center gap-2 px-4 py-2 bg-orange-primary hover:bg-orange-primary/95 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </header>

      {/* Preview Container */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm max-w-4xl w-full flex flex-col items-center gap-6">
          <div className="w-full border-b border-border-subtle pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h1 className="font-plus-jakarta font-bold text-lg text-heading-text">{file.name}</h1>
              <p className="text-xs text-secondary-text mt-0.5">Shared publicly</p>
            </div>
            <span className="text-xs font-semibold text-secondary-text">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>

          <div className="w-full flex items-center justify-center min-h-64 bg-[#fbfbfb] border border-border-subtle rounded-xl p-4 overflow-hidden">
            {file.type === 'image' && (
              <img src={downloadUrl} alt={file.name} className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-md" />
            )}
            {file.type === 'video' && (
              <video src={downloadUrl} controls className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-md" />
            )}
            {file.type === 'pdf' && (
              <iframe src={downloadUrl} title={file.name} className="w-full h-[60vh] rounded-lg border-0 bg-white" />
            )}
            {file.type !== 'image' && file.type !== 'video' && file.type !== 'pdf' && (
              <div className="flex flex-col items-center justify-center text-center p-6">
                <File className="w-16 h-16 text-secondary-text mb-4" />
                <p className="text-sm font-semibold text-body-text">{file.name}</p>
                <p className="text-xs text-secondary-text mt-1 mb-6">No preview available for this file format.</p>
                <button
                  onClick={() => window.open(downloadUrl, '_blank')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-orange-primary hover:bg-orange-primary/95 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  <Download className="w-4.5 h-4.5" />
                  <span>Download File</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
