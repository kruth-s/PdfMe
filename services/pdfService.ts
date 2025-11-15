import type { PdfFile } from '../types';

// In a real Tauri app, you would import the `invoke` function:
// import { invoke } from '@tauri-apps/api/tauri';
// import { open } from '@tauri-apps/api/dialog';

// Mocks for demonstration purposes, to be replaced with Tauri API calls.
const invoke = async (command: string, args?: any): Promise<any> => {
  console.log(`Invoking backend command: ${command}`, args);
  // Simulate backend processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (command === 'get_file_info') {
    // Mock response for file info
    return {
        id: `${args.filePath}-${Date.now()}`,
        path: args.filePath,
        name: args.filePath.split(/[\\/]/).pop() || 'unknown.pdf',
        pageCount: Math.floor(Math.random() * 20) + 1, // random page count
        size: `${(Math.random() * 5).toFixed(2)} MB`,
    };
  }
  if (command === 'merge_pdfs') {
      // Mock a successful merge by returning a fake path
      return 'path/to/merged.pdf';
  }
  return null;
};

export async function selectFiles(): Promise<string[]> {
    // REAL IMPLEMENTATION:
    // const selected = await open({
    //   multiple: true,
    //   filters: [{ name: 'PDF', extensions: ['pdf'] }]
    // });
    // return Array.isArray(selected) ? selected : (selected ? [selected] : []);

    // MOCK IMPLEMENTATION:
    alert("This would open a native file dialog. Using mock files for now.");
    return ["C:/Users/Demo/Documents/report.pdf", "C:/Users/Demo/Documents/presentation.pdf"];
}

export async function getFileInfo(filePath: string): Promise<PdfFile> {
  // REAL IMPLEMENTATION:
  // return await invoke('get_file_info', { filePath });
  
  // MOCK IMPLEMENTATION:
  return await invoke('get_file_info', { filePath });
}

export async function mergePdfs(filePaths: string[]): Promise<string> {
  // REAL IMPLEMENTATION:
  // return await invoke('merge_pdfs', { filePaths });

  // MOCK IMPLEMENTATION:
  const resultPath = await invoke('merge_pdfs', { filePaths });
  alert(`PDFs merged successfully! Saved to: ${resultPath}`);
  return resultPath;
}
