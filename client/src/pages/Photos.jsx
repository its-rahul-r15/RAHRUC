import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import LightboxViewer from '../components/files/LightboxViewer';
import api from '../api/axiosInstance';
import { Image, Video, Calendar, Loader, AlertCircle } from 'lucide-react';

export default function Photos() {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePreviewFile, setActivePreviewFile] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        // Fetch files of type image
        const resImg = await api.get('/files?type=image&limit=100');
        const resVid = await api.get('/files?type=video&limit=100');
        
        const combined = [
          ...(resImg.data.data.items || []),
          ...(resVid.data.data.items || []),
        ].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        
        setMediaFiles(combined);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  // Group media items by date
  const groupMediaByDate = (files) => {
    return files.reduce((groups, file) => {
      const date = new Date(file.uploadDate).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(file);
      return groups;
    }, {});
  };

  const groupedMedia = groupMediaByDate(mediaFiles);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 font-inter">
        <div>
          <h2 className="font-plus-jakarta font-bold text-2xl text-heading-text mb-1">Photos & Videos</h2>
          <p className="text-sm text-secondary-text">A beautiful gallery of your cloud-backed memories.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader className="w-8 h-8 animate-spin text-orange-primary" />
            <span className="text-sm text-secondary-text">Loading gallery...</span>
          </div>
        ) : mediaFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-border-subtle rounded-2xl p-8 shadow-xs">
            <AlertCircle className="w-12 h-12 text-secondary-text mb-4" />
            <h3 className="font-plus-jakarta font-semibold text-base text-heading-text mb-1">No media files</h3>
            <p className="text-sm text-secondary-text max-w-xs">
              Upload images and videos in My Drive to see them cataloged here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.keys(groupedMedia).map((date) => (
              <div key={date} className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-body-text">
                  <Calendar className="w-4 h-4 text-orange-primary" />
                  <span>{date}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {groupedMedia[date].map((file) => {
                    const thumbUrl = file.thumbnailFileId 
                      ? `${import.meta.env.VITE_API_BASE_URL || 'https://rahrucbackend.vercel.app/api/v1'}/files/${file._id}/thumbnail`
                      : null;

                    return (
                      <div
                        key={file._id}
                        onClick={() => setActivePreviewFile(file)}
                        className="bg-white border border-border-subtle rounded-xl overflow-hidden hover:border-orange-primary/30 transition-all cursor-pointer shadow-xs aspect-square relative group"
                      >
                        {thumbUrl ? (
                          <img src={thumbUrl} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full bg-[#fbfbfb] flex items-center justify-center">
                            {file.type === 'video' ? <Video className="w-8 h-8 text-secondary-text" /> : <Image className="w-8 h-8 text-secondary-text" />}
                          </div>
                        )}
                        {file.type === 'video' && (
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white rounded px-1.5 py-0.5 text-[10px] font-semibold flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            <span>Video</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
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
