import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { FileDropzone } from '../components/FileDropzone';
import { PdfFileList } from '../components/PdfFileList';
import type { PdfFile } from '../types';
import { getFileInfo, mergePdfs, selectFiles } from '../services/pdfService';
import { PlusIcon, BackIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '../constants';

interface MergePageProps {
    onBack: () => void;
}

export function MergePage({ onBack }: MergePageProps): React.ReactElement {
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // State for encryption
  const [isProtectionEnabled, setIsProtectionEnabled] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const processFiles = useCallback(async (files: File[]) => {
    setError(null);
    const newPdfFiles: PdfFile[] = [];
    const existingFileSignatures = new Set(pdfFiles.map(f => `${f.name}-${f.size}`));
    
    for (const file of files) {
       const signature = `${file.name}-${file.size}`;
      if (!existingFileSignatures.has(signature)) {
        try {
          const fileInfo = await getFileInfo(file);
          newPdfFiles.push(fileInfo);
        } catch (err) {
          setError(`Could not process file: ${file.name}. It may be corrupted or protected.`);
          console.error(err);
        }
      }
    }
    if (newPdfFiles.length > 0) {
      setPdfFiles(prev => [...prev, ...newPdfFiles]);
    }
  }, [pdfFiles]);
  
  // Effect to listen for file drops on the window
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };
    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Use a timeout to prevent flickering when dragging over child elements
        if (!e.relatedTarget) {
            setIsDragging(false);
        }
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer?.files;
      if (droppedFiles && droppedFiles.length > 0) {
        const acceptedFiles = Array.from(droppedFiles).filter(file => file.type === 'application/pdf');
        if (acceptedFiles.length > 0) {
          processFiles(acceptedFiles);
        } else {
          setError("Only PDF files are accepted.");
        }
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [processFiles]);

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

  const passwordError = useMemo(() => {
    if (!isProtectionEnabled) return null;
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters long.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  }, [isProtectionEnabled, password, confirmPassword]);

  const handleMerge = async () => {
    if (pdfFiles.length < 2) {
      setError("Please add at least two PDF files to merge.");
      return;
    }
    if (isProtectionEnabled && passwordError) {
        setError(passwordError);
        return;
    }
    setIsMerging(true);
    setError(null);
    try {
      await mergePdfs(pdfFiles, isProtectionEnabled ? password : undefined);
      // Reset state after successful merge
      setPdfFiles([]);
      setIsProtectionEnabled(false);
      setPassword('');
      setConfirmPassword('');
// FIX: Explicitly type the caught error as unknown to handle potential TypeScript errors.
    } catch (e: unknown) {
      setError("An error occurred while merging the PDFs. Please try again.");
      console.error(e);
    } finally {
      setIsMerging(false);
    }
  };
  
  const handleSelectClick = async () => {
    const files = await selectFiles();
    if (files.length > 0) {
        processFiles(files);
    }
  };
  
  const handleDropzoneDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer?.files;
    if (droppedFiles && droppedFiles.length > 0) {
        const acceptedFiles = Array.from(droppedFiles).filter(file => file.type === 'application/pdf');
        if (acceptedFiles.length > 0) {
            processFiles(acceptedFiles);
        } else {
            setError("Only PDF files are accepted.");
        }
    }
  }, [processFiles]);


  const totalSize = useMemo(() => {
    const totalBytes = pdfFiles.reduce((acc, curr) => acc + curr.file.size, 0);
    if (totalBytes === 0) return '0 MB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(totalBytes) / Math.log(k));
    return parseFloat((totalBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, [pdfFiles]);

  const isMergeDisabled = isMerging || pdfFiles.length < 2 || (isProtectionEnabled && !!passwordError);

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
                isDragging={isDragging}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDropzoneDrop}
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
      {error && !isMerging && (
          <div className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg max-w-3xl mx-auto">
              {error}
          </div>
      )}

      {pdfFiles.length > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto flex flex-col xl:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-4 flex-shrink-0">
                <p className="text-sm text-gray-600">{pdfFiles.length} files selected</p>
                <p className="text-sm text-gray-500 font-medium">Total size: {totalSize}</p>
             </div>

             {/* Encryption Options */}
             <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="protect" checked={isProtectionEnabled} onChange={(e) => setIsProtectionEnabled(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                    <label htmlFor="protect" className="text-sm font-medium text-gray-700">Add password protection</label>
                </div>
                 {isProtectionEnabled && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full sm:w-auto form-input px-3 py-1.5 text-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                         <div className="relative">
                             <input
                                 type={showPassword ? 'text' : 'password'}
                                 placeholder="Confirm password"
                                 value={confirmPassword}
                                 onChange={(e) => setConfirmPassword(e.target.value)}
                                 className="w-full sm:w-auto form-input px-3 py-1.5 text-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                             />
                             <button
                                 type="button"
                                 onClick={() => setShowPassword(p => !p)}
                                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                             >
                                 {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                             </button>
                         </div>
                         {passwordError && <p className="text-xs text-red-600 mt-1 sm:mt-0">{passwordError}</p>}
                    </div>
                )}
             </div>

             <div className="flex items-center gap-2 w-full md:w-auto flex-shrink-0">
                <button onClick={handleSelectClick} className="p-3 rounded-full hover:bg-gray-200 transition-colors" aria-label="Add more files">
                    <PlusIcon />
                </button>
                <button
                    onClick={handleMerge}
                    disabled={isMergeDisabled}
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