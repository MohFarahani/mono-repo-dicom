import fs from 'fs/promises';
import path from 'path';
import { AppError, ErrorCodes } from './errorHandling';
import { LogService } from './logging';

export abstract class BaseService {
  protected static async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  protected static async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  protected static async verifyFile(filePath: string): Promise<void> {
    if (!(await this.fileExists(filePath))) {
      throw new AppError('File not found', ErrorCodes.FILE_NOT_FOUND, 404);
    }
  }

  protected static async readFileBuffer(filePath: string): Promise<Buffer> {
    await this.verifyFile(filePath);
    return fs.readFile(filePath);
  }

  protected static async readFile(filePath: string) {
    const fileBuffer = await this.readFileBuffer(filePath);
    const fileName = path.basename(filePath);
    return { fileBuffer, fileName };
  }

  protected static async cleanup(filePath: string): Promise<void> {
    try {
      if (await this.fileExists(filePath)) {
        await fs.unlink(filePath);
      }
    } catch (error) {
      LogService.error('Cleanup failed', error);
    }
  }
}
