import type { PdfFile, ImageFile } from '../types';

// pdf-lib and jszip are loaded from a CDN script in index.html
declare const PDFLib: any;
declare const JSZip: any;

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export async function selectFiles(multiple = true, accept = 'application/pdf'): Promise<File[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = multiple;
    input.accept = accept;
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

export async function splitPdf(
    file: PdfFile, 
    mode: 'ranges' | 'all', 
    ranges: string
): Promise<{ blob: Blob; name: string; size: string }> {
    const { PDFDocument } = PDFLib;
    const fileBuffer = await file.file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });

    if (mode === 'all') {
        const zip = new JSZip();
        for (let i = 0; i < pdfDoc.getPageCount(); i++) {
            const newDoc = await PDFDocument.create();
            const [copiedPage] = await newDoc.copyPages(pdfDoc, [i]);
            newDoc.addPage(copiedPage);
            const pdfBytes = await newDoc.save();
            zip.file(`${file.name.replace('.pdf', '')}-page-${i + 1}.pdf`, pdfBytes);
        }
        const blob = await zip.generateAsync({ type: 'blob' });
        return {
            blob,
            name: `${file.name.replace('.pdf', '')}-split.zip`,
            size: formatBytes(blob.size),
        };

    } else { // mode === 'ranges'
        const newDoc = await PDFDocument.create();
        const pagesToCopy = new Set<number>();
        
        // Parse ranges: "1-3, 5, 8-10"
        ranges.split(',').forEach(range => {
            range = range.trim();
            if (range.includes('-')) {
                const [start, end] = range.split('-').map(num => parseInt(num, 10));
                for (let i = start; i <= end; i++) {
                    if (i > 0 && i <= pdfDoc.getPageCount()) pagesToCopy.add(i - 1);
                }
            } else {
                const pageNum = parseInt(range, 10);
                if (pageNum > 0 && pageNum <= pdfDoc.getPageCount()) pagesToCopy.add(pageNum - 1);
            }
        });

        if (pagesToCopy.size === 0) {
            throw new Error("Invalid page ranges provided. Please check your input.");
        }

        const sortedPages = Array.from(pagesToCopy).sort((a, b) => a - b);
        const copiedPages = await newDoc.copyPages(pdfDoc, sortedPages);
        copiedPages.forEach(page => newDoc.addPage(page));

        const pdfBytes = await newDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        return {
            blob,
            name: `${file.name.replace('.pdf', '')}-extracted.pdf`,
            size: formatBytes(blob.size),
        };
    }
}


export async function rotatePdf(
    file: PdfFile, 
    rotations: { [pageIndex: number]: number }
): Promise<{ blob: Blob; name: string; size: string }> {
    const { PDFDocument, degrees } = PDFLib;
    const fileBuffer = await file.file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });

    Object.entries(rotations).forEach(([pageIndexStr, angle]) => {
        const pageIndex = parseInt(pageIndexStr, 10);
        if (pageIndex >= 0 && pageIndex < pdfDoc.getPageCount()) {
            const page = pdfDoc.getPage(pageIndex);
            const currentRotation = page.getRotation().angle;
            page.setRotation(degrees(currentRotation + angle));
        }
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    return {
        blob,
        name: `${file.name.replace('.pdf', '')}-rotated.pdf`,
        size: formatBytes(blob.size),
    };
}


export async function compressPdf(
    file: PdfFile,
    level: 'recommended' | 'extreme' // Level is for future use, logic is the same for now
): Promise<{ blob: Blob; name: string; size: string }> {
    const { PDFDocument } = PDFLib;
    const fileBuffer = await file.file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });

    // The primary client-side optimization is to rebuild the document,
    // which can clean up unused objects and optimize the structure.
    // `useObjectStreams` helps group objects to reduce file size.
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    return {
        blob,
        name: `${file.name.replace('.pdf', '')}-compressed.pdf`,
        size: formatBytes(blob.size),
    };
}

export async function getImageInfo(file: File): Promise<ImageFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          id: `${file.name}-${file.lastModified}-${file.size}`,
          file,
          name: file.name,
          previewUrl: img.src,
          width: img.width,
          height: img.height,
          size: formatBytes(file.size),
        });
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function convertImagesToPdf(
    images: ImageFile[], 
    options: { pageSize: string; orientation: 'portrait' | 'landscape' }
): Promise<{ blob: Blob; name: string; size: string }> {
    const { PDFDocument, PageSizes } = PDFLib;
    const pdfDoc = await PDFDocument.create();

    const getPageSize = () => {
        const size = options.pageSize === 'Letter' ? PageSizes.Letter : PageSizes.A4;
        return options.orientation === 'portrait' ? size : [size[1], size[0]];
    }

    for (const imageFile of images) {
        const page = pdfDoc.addPage(getPageSize());
        const { width: pageWidth, height: pageHeight } = page.getSize();
        
        const imageBytes = await imageFile.file.arrayBuffer();
        const image = await (imageFile.file.type === 'image/png' 
            ? pdfDoc.embedPng(imageBytes)
            : pdfDoc.embedJpg(imageBytes));

        const imageDims = image.scaleToFit(pageWidth - 50, pageHeight - 50); // add some margin

        page.drawImage(image, {
            x: (pageWidth - imageDims.width) / 2,
            y: (pageHeight - imageDims.height) / 2,
            width: imageDims.width,
            height: imageDims.height,
        });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    return {
        blob,
        name: 'converted.pdf',
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

// Utility to render a PDF page to a canvas for thumbnail previews
export async function renderPdfPageAsCanvas(file: File, pageNumber: number, maxWidth: number): Promise<HTMLCanvasElement> {
    const { pdfjsLib } = PDFLib;
    // The worker is needed for pdf.js to work
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const fileBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
    const page = await pdf.getPage(pageNumber);

    const viewport = page.getViewport({ scale: 1 });
    const scale = maxWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;

    if (!context) {
        throw new Error('Could not get canvas context');
    }

    await page.render({ canvasContext: context, viewport: scaledViewport }).promise;
    return canvas;
}