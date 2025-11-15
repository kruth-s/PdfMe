export interface PdfFile {
  id: string;
  file: File; // In the browser, we work with File objects
  name: string;
  pageCount: number;
  size: string;
}

export interface ImageFile {
  id: string;
  file: File;
  name: string;
  previewUrl: string; // For displaying a thumbnail
  width: number;
  height: number;
  size: string;
}