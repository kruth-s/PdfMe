import type { PdfFile } from '../types';

// pdf-lib is loaded from a CDN script in index.html
declare const PDFLib: any;

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export async function selectFiles(): Promise<File[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'application/pdf';
    input.onchange = () => {
      resolve(input.files ? Array.from(input.files) : []);
    };
    input.click();
  });
}

export async function getFileInfo(file: File): Promise<PdfFile> {
  const { PDFDocument } = PDFLib;
  const fileBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileBuffer, { 
      ignoreEncryption: true // Allows reading page count of encrypted files
  });
  
  return {
    id: `${file.name}-${file.lastModified}-${file.size}`,
    file: file,
    name: file.name,
    pageCount: pdfDoc.getPageCount(),
    size: formatBytes(file.size),
  };
}

export async function mergePdfs(files: PdfFile[], password?: string): Promise<{ blob: Blob; name: string; size: string }> {
    const { PDFDocument } = PDFLib;
    const mergedPdf = await PDFDocument.create();

    for (const pdfFile of files) {
        const fileBuffer = await pdfFile.file.arrayBuffer();
        // Load the PDF, ignoring encryption for compatibility
        const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    
    if (password) {
        console.warn("PDF Encryption is not supported by the client-side pdf-lib library. The merged file will not be password protected.");
        alert("Password protection is not supported in this version. The merged PDF will be created without encryption.");
    }

    const mergedPdfBytes = await mergedPdf.save({ useObjectStreams: true });
    
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    
    return {
        blob,
        name: 'merged.pdf',
        size: formatBytes(blob.size),
    };
}

export function downloadFile(blob: Blob, fileName: string): void {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}