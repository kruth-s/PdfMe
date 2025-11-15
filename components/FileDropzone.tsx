import React, { useState, useCallback } from 'react';

interface FileDropzoneProps {
  onFilesAdded: (files: string[]) => void;
  onSelectClick: () => void;
  isDragging: boolean;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const FileDropzone = ({ 
    onSelectClick,
    isDragging,
    onDragEnter,
    onDragLeave,
    onDrop
}: FileDropzoneProps): React.ReactElement => {
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={handleDragOver}
      onDrop={onDrop}
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${isDragging ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
    >
      <div className="flex flex-col items-center">
        <button
          onClick={onSelectClick}
          className="bg-red-500 text-white font-bold py-4 px-10 rounded-lg shadow-md hover:bg-red-600 transition-all duration-200 text-xl"
        >
          Select PDF files
        </button>
        <p className="mt-4 text-gray-500">or drop PDFs here</p>
      </div>
    </div>
  );
};
