// src/services/fileService.ts
export class FileService {
  private collectedFiles: File[] = [];

  addFiles(files: File[]): void {
    this.collectedFiles = [...this.collectedFiles, ...files];
  }

  removeFile(index: number): void {
    this.collectedFiles.splice(index, 1);
  }

  getFiles(): File[] {
    return this.collectedFiles;
  }

  clear(): void {
    this.collectedFiles = [];
  }

  async processFiles(): Promise<string[]> {
    if (this.collectedFiles.length === 0) {
      throw new Error('No files to process');
    }

    const formData = new FormData();
    this.collectedFiles.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(`${window.location.origin}/api/process-files`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.knowledge || [];
  }
}