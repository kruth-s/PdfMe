import React, { useRef } from 'react';
import type { ImageFile } from '../types';
import { ImageFileCard } from './ImageFileCard';

interface ImageFileListProps {
  files: ImageFile[];
  onRemoveFile: (id: string) => void;
  onReorderFiles: (dragIndex: number, hoverIndex: number) => void;
}

export const ImageFileList = ({ files, onRemoveFile, onReorderFiles }: ImageFileListProps): React.ReactElement => {
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleDragStart = (index: number) => {
        dragItem.current = index;
    };
    
    const handleDragEnter = (index: number) => {
        dragOverItem.current = index;
    };
    
    const handleDragEnd = () => {
        if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
            onReorderFiles(dragItem.current, dragOverItem.current);
        }
        dragItem.current = null;
        dragOverItem.current = null;
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
            onDragOver={handleDragOver}
        >
        {files.map((file, index) => (
            <div
                key={file.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                className="cursor-move"
            >
                <ImageFileCard file={file} onRemove={() => onRemoveFile(file.id)} />
            </div>
        ))}
        </div>
    );
};