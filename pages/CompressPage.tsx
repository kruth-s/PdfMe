import React, { useState, useCallback } from 'react';
import { FileDropzone } from '../components/FileDropzone';
import type { PdfFile } from '../types';
import { getFileInfo, compressPdf, selectFiles, downloadFile } from '../services/pdfService';
import { BackIcon, CheckCircleIcon, DownloadIcon, PdfIcon } from '../constants';

interface CompressPageProps {
    onBack: () => void;
}

interface CompressResultInfo {
    blob: Blob;
    name: string;
    size: string;
    originalSize: string;
    reduction: string;
}

type CompressionLevel = 'recommended' | 'extreme';

export function CompressPage({ onBack }: CompressPageProps): React.ReactElement {
  const [pdfFile, setPdfFile] = useState<PdfFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [compressResult, setCompressResult] = useState<CompressResultInfo | null>(null);

  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('recommended');

  const processFile = useCallback(async (file: File) => {
    setIsProcessingFile(true);
    setError(null);
    try {
      const fileInfo = await getFileInfo(file);
      setPdfFile(fileInfo);
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
      processFile(files[0]);
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
        processFile(acceptedFile);
      } else {
        setError("Only a single PDF file is accepted.");
      }
    }
  }, [processFile, isProcessingFile]);

  const handleCompress = async () => {
    if (!pdfFile) {
      setError("Please select a file first.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    try {
      const result = await compressPdf(pdfFile, compressionLevel);
      const originalSizeBytes = pdfFile.file.size;
      const newSizeBytes = result.blob.size;
      const reduction = originalSizeBytes > 0 
        ? Math.round(((originalSizeBytes - newSizeBytes) / originalSizeBytes) * 100)
        : 0;

      setCompressResult({
        ...result,
        originalSize: pdfFile.size,
        reduction: `${reduction}%`
      });

    } catch (e: any) {
      setError(e.message || "An error occurred while compressing the PDF.");
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (compressResult) {
      downloadFile(compressResult.blob, compressResult.name);
    }
  };

  const resetState = () => {
    setPdfFile(null);
    setCompressionLevel('recommended');
    setError(null);
    setCompressResult(null);
  };
  
  if (compressResult) {
    return (
        <div className="text-center max-w-2xl mx-auto py-16">
            <CheckCircleIcon />
            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-800">Compression Successful!</h1>
            <p className="mt-2 text-lg text-gray-600">
                Your file is now <span className="font-bold text-green-600">{compressResult.reduction}</span> smaller.
            </p>
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <p className="font-medium text-gray-700">{compressResult.name}</p>
                <div className="text-right">
                    <p className="text-sm text-gray-500 line-through">{compressResult.originalSize}</p>
                    <p className="font-bold text-gray-800">{compressResult.size}</p>
                </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={handleDownload}
                    className="w-full sm:w-auto bg-green-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-green-600 transition-all duration-200 flex items-center justify-center text-lg"
                >
                    <DownloadIcon />
                    Download File
                </button>
                <button
                    onClick={resetState}
                    className="w-full sm:w-auto bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition-all duration-200 text-lg"
                >
                    Compress Another PDF
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
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">Compress PDF file</h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Reduce the file size of your PDF while optimizing for maximal PDF quality.
        </p>
      </div>

      <div className="mt-8 max-w-4xl mx-auto">
        {!pdfFile ? (
          <FileDropzone
              onSelectClick={handleSelectClick}
              isDragging={isDragging}
              isProcessing={isProcessingFile}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
          />
        ) : (
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0 text-center">
                <PdfIcon />
                <p className="text-sm font-medium text-gray-800 break-all mt-2">{pdfFile.name}</p>
                <p className="text-xs text-gray-500 mt-1">{pdfFile.pageCount} Pages &middot; {pdfFile.size}</p>
                <button onClick={resetState} className="mt-4 text-sm text-red-500 hover:underline">Select a different file</button>
            </div>
            <div className="flex-grow">
                <h3 className="font-bold text-lg text-gray-800">Compression level</h3>
                <div className="mt-4 space-y-4">
                    <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:border-green-400 transition-colors">
                        <input type="radio" name="compress-level" value="recommended" checked={compressionLevel === 'recommended'} onChange={() => setCompressionLevel('recommended')} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 mt-1" />
                        <div className="ml-3">
                            <span className="text-sm font-medium text-gray-800">Recommended compression</span>
                            <p className="text-xs text-gray-500 mt-1">Good balance between file size and quality.</p>
                        </div>
                    </label>
                    <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:border-green-400 transition-colors">
                        <input type="radio" name="compress-level" value="extreme" checked={compressionLevel === 'extreme'} onChange={() => setCompressionLevel('extreme')} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 mt-1" />
                        <div className="ml-3">
                            <span className="text-sm font-medium text-gray-800">Extreme compression</span>
                            <p className="text-xs text-gray-500 mt-1">Highest compression for the smallest file size, may reduce quality.</p>
                        </div>
                    </label>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                    <strong>Note:</strong> Client-side compression offers limited size reduction, especially for image-heavy documents. The actual file size reduction may be minimal.
                </div>
                
                <div className="mt-6">
                    <button
                        onClick={handleCompress}
                        disabled={isProcessing}
                        className="w-full bg-green-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-green-600 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                    >
                        {isProcessing ? 'Compressing...' : `Compress PDF`}
                    </button>
                </div>
            </div>
          </div>
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