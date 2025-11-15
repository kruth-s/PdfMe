import React from 'react';
import type { ImageFile } from '../types';
import { CloseIcon } from '../constants';

interface ImageFileCardProps {
  file: ImageFile;
  onRemove: () => void;
}

export const ImageFileCard = ({ file, onRemove }: ImageFileCardProps): React.ReactElement => {
  return (
    <div className="relative group bg-white border border-gray-200 rounded-lg p-2 shadow-sm h-full flex flex-col text-center hover:shadow-md transition-shadow duration-200 aspect-[4/3]">
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
      
      <div className="flex-grow w-full h-full overflow-hidden rounded-md flex items-center justify-center">
        <img 
            src={file.previewUrl} 
            alt={file.name} 
            className="max-w-full max-h-full object-contain" 
        />
      </div>

      <div className="mt-2 flex-shrink-0 w-full overflow-hidden">
        <p className="text-xs font-medium text-gray-800 break-words truncate px-1">
          {file.name}
        </p>
      </div>
    </div>
  );
};