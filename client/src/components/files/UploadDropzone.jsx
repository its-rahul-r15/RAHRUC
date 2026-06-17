import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';

export default function UploadDropzone({ onUpload }) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      Array.from(e.dataTransfer.files).forEach((file) => {
        onUpload(file);
      });
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      Array.from(e.target.files).forEach((file) => {
        onUpload(file);
      });
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${
        isDragActive ? 'border-orange-primary bg-orange-primary/5' : 'border-border-subtle hover:border-orange-primary/50'
      }`}
    >
      <UploadCloud className="w-12 h-12 text-secondary-text mb-4" />
      <p className="text-sm font-medium text-heading-text mb-1 text-center">
        Drag and drop your files here
      </p>
      <p className="text-xs text-secondary-text mb-4 text-center">
        Any files up to 50MB
      </p>
      <label className="px-4 py-2 bg-orange-primary hover:bg-orange-primary/95 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-sm">
        Browse Files
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
