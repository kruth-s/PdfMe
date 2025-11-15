import React, { useState, useCallback, useEffect } from 'react';
import { FileDropzone } from '../components/FileDropzone';
import type { PdfFile } from '../types';
import { getFileInfo, rotatePdf, selectFiles, downloadFile, renderPdfPageAsCanvas } from '../services/pdfService';
import { BackIcon, CheckCircleIcon, DownloadIcon, RotateCcwIcon } from '../constants';

interface RotatePageProps {
    onBack: () => void;
}

interface RotateResultInfo {
    blob: Blob;
    name: string;
    size: string;
}

export function RotatePage({ onBack }: RotatePageProps): React.ReactElement {
  const [pdfFile, setPdfFile] = useState<PdfFile | null>(null);
  const [pagePreviews, setPagePreviews] = useState<string[]>([]);
  const [rotations, setRotations] = useState<{ [pageIndex: number]: number }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotateResult, setRotateResult] = useState<RotateResultInfo | null>(null);

  const generatePreviews = useCallback(async (file: File) => {
    setIsProcessingFile(true);
    setError(null);
    const newPreviews: string[] = [];
    try {
        const fileInfo = await getFileInfo(file);
        setPdfFile(fileInfo);
        
        for (let i = 1; i <= fileInfo.pageCount; i++) {
            const canvas = await renderPdfPageAsCanvas(file, i, 200);
            newPreviews.push(canvas.toDataURL());
        }
        setPagePreviews(newPreviews);
    } catch (err) {
        setError(`Could not process file: ${file.name}. It may be corrupted or protected.`);
        console.error(err);
    }
    setIsProcessingFile(false);
  }, []);
  
  const handleSelectClick = async () => {
    if (isProcessingFile) return;
    const files = await selectFiles(false); // only single file
    if (files.length > 0) {
      generatePreviews(files[0]);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isProcessingFile) return;
    const droppedFiles = e.dataTransfer?.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const acceptedFile = Array.from(droppedFiles).find(file => file.type === 'application/pdf');
      if (acceptedFile) {
        generatePreviews(acceptedFile);
      } else {
        setError("Only a single PDF file is accepted.");
      }
    }
  }, [generatePreviews, isProcessingFile]);

  const handleRotate = (pageIndex: number, angle: number) => {
    setRotations(prev => ({
        ...prev,
        [pageIndex]: ((prev[pageIndex] || 0) + angle + 360) % 360
    }));
  };

  const handleApplyRotation = async () => {
    if (!pdfFile) return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await rotatePdf(pdfFile, rotations);
      setRotateResult(result);
    } catch (e: any) {
      setError(e.message || "An error occurred while rotating the PDF.");
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (rotateResult) {
      downloadFile(rotateResult.blob, rotateResult.name);
    }
  };

  const resetState = () => {
    setPdfFile(null);
    setPagePreviews([]);
    setRotations({});
    setError(null);
    setRotateResult(null);
  };

  if (rotateResult) {
    return (
        <div className="text-center max-w-2xl mx-auto py-16">
            <CheckCircleIcon />
            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-800">Rotation Successful!</h1>
            <p className="mt-2 text-lg text-gray-600">Your PDF has been rotated and is ready for download.</p>
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <p className="font-medium text-gray-700">{rotateResult.name}</p>
                <p className="text-sm text-gray-500">{rotateResult.size}</p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={handleDownload}
                    className="w-full sm:w-auto bg-teal-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-teal-600 transition-all duration-200 flex items-center justify-center text-lg"
                >
                    <DownloadIcon />
                    Download Rotated PDF
                </button>
                <button
                    onClick={resetState}
                    className="w-full sm:w-auto bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition-all duration-200 text-lg"
                >
                    Rotate Another PDF
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

       <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800">Rotate PDF</h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Rotate your PDF files just the way you want. You can rotate multiple pages at once.
          </p>
        </div>

        <div className="mt-8">
            {!pdfFile ? (
                <div className="max-w-2xl mx-auto">
                    <FileDropzone
                        onSelectClick={handleSelectClick}
                        isDragging={isDragging}
                        isProcessing={isProcessingFile}
                        onDragEnter={() => setIsDragging(true)}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                    />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {pagePreviews.map((previewSrc, index) => (
                            <div key={index} className="relative group aspect-[3/4]">
                                <img
                                    src={previewSrc}
                                    alt={`Page ${index + 1}`}
                                    className="w-full h-full object-contain border border-gray-300 rounded-md bg-white"
                                    style={{ transform: `rotate(${rotations[index] || 0}deg)` }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                    <button onClick={() => handleRotate(index, -90)} className="bg-white/80 rounded-full p-2 hover:bg-white" title="Rotate left">
                                        <RotateCcwIcon />
                                    </button>
                                     <button onClick={() => handleRotate(index, 90)} className="bg-white/80 rounded-full p-2 hover:bg-white transform scale-x-[-1]" title="Rotate right">
                                        <RotateCcwIcon />
                                    </button>
                                </div>
                                <p className="text-center text-xs mt-1 text-gray-600">Page {index + 1}</p>
                            </div>
                        ))}
                    </div>

                    <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
                        <div className="container mx-auto flex items-center justify-center">
                             <button
                                onClick={handleApplyRotation}
                                disabled={isProcessing || Object.keys(rotations).length === 0}
                                className="bg-teal-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-teal-600 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                            >
                                {isProcessing ? 'Applying changes...' : `Apply Changes`}
                            </button>
                        </div>
                    </footer>
                </>
            )}
            {error && (
                <div className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg max-w-3xl mx-auto">
                    {error}
                </div>
            )}
        </div>
    </div>
  );
}
