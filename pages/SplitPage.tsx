import React, { useState, useCallback } from 'react';
import { FileDropzone } from '../components/FileDropzone';
import type { PdfFile } from '../types';
import { getFileInfo, splitPdf, selectFiles, downloadFile } from '../services/pdfService';
import { BackIcon, CheckCircleIcon, DownloadIcon, PdfIcon } from '../constants';

interface SplitPageProps {
    onBack: () => void;
}

interface SplitResultInfo {
    blob: Blob;
    name: string;
    size: string;
}

type SplitMode = 'ranges' | 'all';

export function SplitPage({ onBack }: SplitPageProps): React.ReactElement {
  const [pdfFile, setPdfFile] = useState<PdfFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [splitResult, setSplitResult] = useState<SplitResultInfo | null>(null);

  const [splitMode, setSplitMode] = useState<SplitMode>('ranges');
  const [ranges, setRanges] = useState('');

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

  const handleSplit = async () => {
    if (!pdfFile) {
      setError("Please select a file first.");
      return;
    }
    if (splitMode === 'ranges' && !ranges.trim()) {
      setError("Please specify the page ranges to extract.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    try {
      const result = await splitPdf(pdfFile, splitMode, ranges);
      setSplitResult(result);
    } catch (e: any) {
      setError(e.message || "An error occurred while splitting the PDF.");
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (splitResult) {
      downloadFile(splitResult.blob, splitResult.name);
    }
  };

  const resetState = () => {
    setPdfFile(null);
    setSplitMode('ranges');
    setRanges('');
    setError(null);
    setSplitResult(null);
  };
  
  if (splitResult) {
    return (
        <div className="text-center max-w-2xl mx-auto py-16">
            <CheckCircleIcon />
            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-800">Split Successful!</h1>
            <p className="mt-2 text-lg text-gray-600">Your PDF has been split and is ready for download.</p>
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <p className="font-medium text-gray-700">{splitResult.name}</p>
                <p className="text-sm text-gray-500">{splitResult.size}</p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={handleDownload}
                    className="w-full sm:w-auto bg-orange-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-orange-600 transition-all duration-200 flex items-center justify-center text-lg"
                >
                    <DownloadIcon />
                    Download File
                </button>
                <button
                    onClick={resetState}
                    className="w-full sm:w-auto bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition-all duration-200 text-lg"
                >
                    Split Another PDF
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
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">Split PDF file</h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Separate one page or a whole set for easy conversion into independent PDF files.
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
                <h3 className="font-bold text-lg text-gray-800">Split options</h3>
                <div className="mt-4 space-y-4">
                    <div className="p-3 border rounded-lg " >
                         <label className="flex items-center cursor-pointer">
                            <input type="radio" name="split-mode" value="ranges" checked={splitMode === 'ranges'} onChange={() => setSplitMode('ranges')} className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300" />
                            <span className="ml-3 text-sm font-medium text-gray-700">Extract pages</span>
                        </label>
                        {splitMode === 'ranges' && (
                            <div className="mt-2 pl-7">
                                <p className="text-xs text-gray-500">Extract specific pages from the PDF.</p>
                                <input 
                                    type="text"
                                    value={ranges}
                                    onChange={(e) => setRanges(e.target.value)}
                                    placeholder="e.g. 1-3, 5, 8-10"
                                    className="mt-2 form-input w-full max-w-sm px-3 py-1.5 text-sm border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                        )}
                    </div>
                     <div className="p-3 border rounded-lg">
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name="split-mode" value="all" checked={splitMode === 'all'} onChange={() => setSplitMode('all')} className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300" />
                            <span className="ml-3 text-sm font-medium text-gray-700">Split all pages</span>
                        </label>
                         {splitMode === 'all' && <p className="mt-2 pl-7 text-xs text-gray-500">Create a separate PDF file for each page. The result will be a .zip file.</p>}
                    </div>
                </div>
                <div className="mt-6">
                    <button
                        onClick={handleSplit}
                        disabled={isProcessing}
                        className="w-full bg-orange-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-orange-600 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                    >
                        {isProcessing ? 'Splitting...' : `Split PDF`}
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
