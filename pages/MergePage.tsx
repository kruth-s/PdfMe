import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { FileDropzone } from '../components/FileDropzone';
import { PdfFileList } from '../components/PdfFileList';
import type { PdfFile } from '../types';
import { getFileInfo, mergePdfs, selectFiles } from '../services/pdfService';
import { PlusIcon, BackIcon } from '../constants';

// In a real Tauri app, you would import the event listener
// import { listen } from '@tauri-apps/api/event';

interface MergePageProps {
    onBack: () => void;
}

export function MergePage({ onBack }: MergePageProps): React.ReactElement {
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFilePaths = useCallback(async (paths: string[]) => {
    setError(null);
    const newPdfFiles: PdfFile[] = [];
    const existingPaths = new Set(pdfFiles.map(f => f.path));
    
    for (const path of paths) {
      if (!existingPaths.has(path)) {
        try {
          // In a real app, this would be very fast as it's local IPC
          const fileInfo = await getFileInfo(path);
          newPdfFiles.push(fileInfo);
        } catch (err) {
          setError(`Could not process file: ${path}. It may be corrupted or protected.`);
          console.error(err);
        }
      }
    }
    setPdfFiles(prev => [...prev, ...newPdfFiles]);
  }, [pdfFiles]);
  
  // Effect to listen for file drops on the window (Tauri-specific)
  useEffect(() => {
    // MOCK: Simulating Tauri's event listener for window-wide drag-n-drop
    const handleWindowDrop = (e: DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            // In Tauri, you get paths. Here we simulate that.
            const paths = Array.from(files).map(f => (f as any).path || f.name);
            processFilePaths(paths);
        }
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent) => e.preventDefault();
    const handleDragEnter = () => setIsDragging(true);
    
    window.addEventListener('drop', handleWindowDrop);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragenter', handleDragEnter);
    
    // In a real Tauri app, you'd do something like this:
    // const unlisten = listen('tauri://file-drop', event => {
    //   const paths = event.payload as string[];
    //   processFilePaths(paths);
    // });
    // return () => { unlisten.then(f => f()); };

    return () => {
        window.removeEventListener('drop', handleWindowDrop);
        window.removeEventListener('dragover', handleDragOver);
        window.removeEventListener('dragenter', handleDragEnter);
    };
  }, [processFilePaths]);

  const handleRemoveFile = useCallback((id: string) => {
    setPdfFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleReorderFiles = useCallback((dragIndex: number, hoverIndex: number) => {
    setPdfFiles(prev => {
      const newFiles = [...prev];
      const [draggedItem] = newFiles.splice(dragIndex, 1);
      newFiles.splice(hoverIndex, 0, draggedItem);
      return newFiles;
    });
  }, []);

  const handleMerge = async () => {
    if (pdfFiles.length < 2) {
      setError("Please add at least two PDF files to merge.");
      return;
    }
    setIsMerging(true);
    setError(null);
    try {
      await mergePdfs(pdfFiles.map(f => f.path));
      setPdfFiles([]); // Reset after successful merge
    } catch (e) {
      setError("An error occurred while merging the PDFs. Please try again.");
      console.error(e);
    } finally {
      setIsMerging(false);
    }
  };
  
  const handleSelectClick = async () => {
    const paths = await selectFiles();
    if (paths.length > 0) {
        processFilePaths(paths);
    }
  };

  const totalSize = useMemo(() => {
    // This is a mock; in reality, the backend would provide accurate sizes.
    return `${(pdfFiles.length * 3.5).toFixed(2)} MB`;
  }, [pdfFiles]);

  return (
    <div className="relative">
        <button onClick={onBack} className="absolute -top-4 left-0 flex items-center text-sm font-medium text-gray-600 hover:text-red-500 transition-colors">
            <BackIcon />
            Back to Tools
        </button>
      {pdfFiles.length === 0 ? (
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800">Merge PDF files</h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Combine PDFs in the order you want with the easiest PDF merger available.
          </p>
          <div className="mt-8 max-w-2xl mx-auto">
            <FileDropzone
                onSelectClick={handleSelectClick}
                onFilesAdded={processFilePaths}
                isDragging={isDragging}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const files = e.dataTransfer?.files;
                  if (files && files.length > 0) {
                      // Fix: Explicitly type 'f' as File to resolve 'unknown' type error.
                      const paths = Array.from(files).map((f: File) => (f as any).path || f.name);
                      processFilePaths(paths);
                  }
                }}
            />
          </div>
        </div>
      ) : (
        <div>
          <PdfFileList
            files={pdfFiles}
            onRemoveFile={handleRemoveFile}
            onReorderFiles={handleReorderFiles}
          />
        </div>
      )}
      {error && (
          <div className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg max-w-2xl mx-auto">
              {error}
          </div>
      )}

      {pdfFiles.length > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">{pdfFiles.length} files selected</p>
                <p className="text-sm text-gray-500 font-medium">Total size: {totalSize}</p>
             </div>
             <div className="flex items-center gap-2 w-full md:w-auto">
                <button onClick={handleSelectClick} className="p-3 rounded-full hover:bg-gray-200 transition-colors" aria-label="Add more files">
                    <PlusIcon />
                </button>
                <button
                    onClick={handleMerge}
                    disabled={isMerging || pdfFiles.length < 2}
                    className="w-full md:w-auto bg-red-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-red-600 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                >
                    {isMerging ? 'Merging...' : `Merge PDF`}
                </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
