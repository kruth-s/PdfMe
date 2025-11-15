import React from 'react';
import type { PdfFile } from '../types';
import { PdfIcon, CloseIcon } from '../constants';

interface PdfFileCardProps {
  file: PdfFile;
  onRemove: () => void;
}

export const PdfFileCard = ({ file, onRemove }: PdfFileCardProps): React.ReactElement => {
  return (
    <div className="relative bg-white border border-gray-200 rounded-lg p-4 shadow-sm h-full flex flex-col items-center justify-between text-center hover:shadow-md transition-shadow duration-200 aspect-square">
      <button
        onClick={(e) => {
            e.stopPropagation();
            onRemove();
        }}
        className="absolute top-2 right-2 p-1.5 bg-gray-200/80 rounded-full text-gray-600 hover:bg-red-500 hover:text-white transition-colors z-10 leading-none"
        aria-label={`Remove ${file.name}`}
      >
        <CloseIcon />
      </button>

      <div className="flex-shrink-0 mt-2">
        <PdfIcon />
      </div>

      <div className="mt-3 flex-grow flex flex-col justify-center overflow-hidden w-full">
        <p className="text-sm font-medium text-gray-800 break-words leading-tight px-1">
          {file.name}
        </p>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 flex-shrink-0">
        <span>{file.pageCount} Pages</span> &middot; <span>{file.size}</span>
      </div>
    </div>
  );
};
