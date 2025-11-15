export interface PdfFile {
  id: string;
  file: File; // In the browser, we work with File objects
  name: string;
  pageCount: number;
  size: string;
}