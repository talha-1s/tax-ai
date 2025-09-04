import React from 'react';

type UploadZoneProps = {
  onUpload: (files: File[]) => void;
  children?: React.ReactNode;
};

export const UploadZone = ({ onUpload, children }: UploadZoneProps) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    onUpload(newFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      role="button"
      tabIndex={0}
      className="border-dashed border-2 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    >
      {children || (
        <p className="text-gray-500 text-sm">Drag & drop files here</p>
      )}
    </div>
  );
};
