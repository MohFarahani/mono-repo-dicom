import { promises as fs } from 'fs';
import path from 'path';
import { AppError } from './errorHandling';
import { LogService } from './logging';
import { config } from '@/config';
import { BaseService } from './BaseService';
export class FileService extends BaseService {
  static readonly DICOM_FOLDER = config.paths.dicomFolder;

  static async verifyFile(filePath: string): Promise<void> {
    if (!(await this.fileExists(filePath))) {
      throw new AppError('File not found', 'FILE_NOT_FOUND', 404);
    }
  }

  static async readFile(filePath: string) {
    const fileBuffer = await fs.readFile(filePath);
    const fileName = path.basename(filePath);
    return { fileBuffer, fileName };
  }

  static async ensureDicomFolder(): Promise<void> {
    return this.ensureDirectory(FileService.DICOM_FOLDER);
  }

  static async createTempFile(file: File): Promise<string> {
    await this.ensureDicomFolder();
    const fileName = file.name;
    const filePath = path.join(this.DICOM_FOLDER, fileName);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);
      LogService.info(`File saved successfully`, { path: filePath });
      return filePath;
    } catch (error) {
      LogService.error('Error saving file', error);
      throw new AppError('Failed to save file', 'FILE_SAVE_ERROR', 500);
    }
  }

  static async cleanup(filePath: string): Promise<void> {
    try {
      if (await this.fileExists(filePath)) {
        await fs.unlink(filePath);
      }
    } catch (error) {
      LogService.error('Cleanup failed', error);
    }
  }
} 