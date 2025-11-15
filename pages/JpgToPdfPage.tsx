import React, { useState, useCallback, useMemo } from 'react';
import { FileDropzone } from '../components/FileDropzone';
import { ImageFileList } from '../components/ImageFileList';
import type { ImageFile } from '../types';
import { getImageInfo, convertImagesToPdf, selectFiles, downloadFile } from '../services/pdfService';
import { PlusIcon, BackIcon, SpinnerIcon, CheckCircleIcon, DownloadIcon } from '../constants';

interface JpgToPdfPageProps {
    onBack: () => void;
}

interface ConvertedFileInfo {
    blob: Blob;
    name: string;
    size: string;
}

type PageSize = 'A4' | 'Letter';
type Orientation = 'portrait' | 'landscape';

export function JpgToPdfPage({ onBack }: JpgToPdfPageProps): React.ReactElement {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [convertedFile, setConvertedFile] = useState<ConvertedFileInfo | null>(null);

  // Conversion options
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [orientation, setOrientation] = useState<Orientation>('portrait');

  const processFiles = useCallback(async (files: File[]) => {
    setIsProcessingFiles(true);
    setError(null);
    const newImageFiles: ImageFile[] = [];
    const existingFileSignatures = new Set(imageFiles.map(f => `${f.name}-${f.size}`));
    
    for (const file of files) {
       const signature = `${file.name}-${file.size}`;
      if (!existingFileSignatures.has(signature)) {
        try {
          const fileInfo = await getImageInfo(file);
          newImageFiles.push(fileInfo);
        } catch (err) {
          setError(`Could not process file: ${file.name}. It may be an unsupported format.`);
          console.error(err);
        }
      }
    }
    if (newImageFiles.length > 0) {
      setImageFiles(prev => [...prev, ...newImageFiles]);
    }
    setIsProcessingFiles(false);
  }, [imageFiles]);
  
  const handleSelectClick = async () => {
    if (isProcessingFiles) return;
    const files = await selectFiles(true, 'image/jpeg, image/png, image/bmp, image/tiff');
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isProcessingFiles) return;
    const droppedFiles = e.dataTransfer?.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const acceptedFiles = Array.from(droppedFiles).filter(file => file.type.startsWith('image/'));
      if (acceptedFiles.length > 0) {
        processFiles(acceptedFiles);
      } else {
        setError("Only image files are accepted.");
      }
    }
  }, [processFiles, isProcessingFiles]);

  const handleRemoveFile = useCallback((id: string) => {
    setImageFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleReorderFiles = useCallback((dragIndex: number, hoverIndex: number) => {
    setImageFiles(prev => {
      const newFiles = [...prev];
      const [draggedItem] = newFiles.splice(dragIndex, 1);
      newFiles.splice(hoverIndex, 0, draggedItem);
      return newFiles;
    });
  }, []);

  const handleConvert = async () => {
    if (imageFiles.length === 0) {
      setError("Please add at least one image file to convert.");
      return;
    }
    setIsConverting(true);
    setError(null);
    try {
      const result = await convertImagesToPdf(imageFiles, { pageSize, orientation });
      setConvertedFile(result);
    } catch (e) {
      setError("An error occurred while converting the images. Please try again.");
      console.error(e);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (convertedFile) {
      downloadFile(convertedFile.blob, convertedFile.name);
    }
  };

  const resetState = () => {
    setImageFiles([]);
    setError(null);
    setConvertedFile(null);
  };

  const isConvertDisabled = isConverting || imageFiles.length === 0;

  if (convertedFile) {
    return (
        <div className="text-center max-w-2xl mx-auto py-16">
            <CheckCircleIcon />
            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-800">Conversion Successful!</h1>
            <p className="mt-2 text-lg text-gray-600">Your PDF has been created and is ready for download.</p>
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <p className="font-medium text-gray-700">{convertedFile.name}</p>
                <p className="text-sm text-gray-500">{convertedFile.size}</p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={handleDownload}
                    className="w-full sm:w-auto bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-yellow-600 transition-all duration-200 flex items-center justify-center text-lg"
                >
                    <DownloadIcon />
                    Download PDF
                </button>
                <button
                    onClick={resetState}
                    className="w-full sm:w-auto bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition-all duration-200 text-lg"
                >
                    Convert More
                </button>
            </div>
             <button onClick={onBack} className="mt-8 flex items-center mx-auto text-sm font-medium text-gray-600 hover:text-red-500 transition-colors">
                <BackIcon />
                Back to Tools
            </button>
        </div>
    );
  }

  return (
    <div className="relative">
      <button onClick={onBack} className="absolute -top-4 left-0 flex items-center text-sm font-medium text-gray-600 hover:text-red-500 transition-colors">
        <BackIcon />
        Back to Tools
      </button>
      {imageFiles.length === 0 ? (
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800">JPG to PDF</h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Convert JPG, PNG, and other images to a PDF in seconds.
          </p>
          <div className="mt-8 max-w-2xl mx-auto">
            <FileDropzone
                onSelectClick={handleSelectClick}
                isDragging={isDragging}
                isProcessing={isProcessingFiles}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            />
          </div>
        </div>
      ) : (
        <div>
          <ImageFileList
            files={imageFiles}
            onRemoveFile={handleRemoveFile}
            onReorderFiles={handleReorderFiles}
          />
        </div>
      )}
      {error && !isConverting && (
          <div className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg max-w-3xl mx-auto">
              {error}
          </div>
      )}

      {imageFiles.length > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto flex flex-col xl:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-4 flex-shrink-0">
                <p className="text-sm text-gray-600">{imageFiles.length} images selected</p>
             </div>

             {/* Conversion Options */}
             <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="page-size" className="text-sm font-medium text-gray-700">Page Size:</label>
                    <select id="page-size" value={pageSize} onChange={(e) => setPageSize(e.target.value as PageSize)} className="form-select text-sm rounded-md border-gray-300">
                        <option value="A4">A4</option>
                        <option value="Letter">Letter</option>
                    </select>
                </div>
                 <div className="flex items-center gap-2">
                    <label htmlFor="orientation" className="text-sm font-medium text-gray-700">Orientation:</label>
                    <select id="orientation" value={orientation} onChange={(e) => setOrientation(e.target.value as Orientation)} className="form-select text-sm rounded-md border-gray-300">
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                    </select>
                </div>
             </div>

             <div className="flex items-center gap-2 w-full md:w-auto flex-shrink-0">
                <button onClick={handleSelectClick} className="p-3 rounded-full hover:bg-gray-200 transition-colors disabled:cursor-not-allowed" aria-label="Add more images" disabled={isProcessingFiles}>
                    {isProcessingFiles ? <SpinnerIcon /> : <PlusIcon />}
                </button>
                <button
                    onClick={handleConvert}
                    disabled={isConvertDisabled}
                    className="w-full md:w-auto bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-yellow-600 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                >
                    {isConverting ? 'Converting...' : `Convert to PDF`}
                </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}