export interface PdfFile {
  id: string;
  path: string; // In Tauri, we work with file paths, not File objects
  name: string;
  pageCount: number;
  size: string;
}
