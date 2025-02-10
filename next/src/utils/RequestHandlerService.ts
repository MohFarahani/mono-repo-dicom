import { NextRequest } from 'next/server';
import { AppError } from '@/utils/errorHandling';
import { LogService } from '@/utils/logging';
import { FileService } from './FileService';
import { BaseService } from './BaseService';

export interface ProcessOptions {
  filePath: string;
  shouldCleanup?: boolean;
}

export class RequestHandlerService extends BaseService {
  static async handleFileUpload(request: NextRequest): Promise<ProcessOptions> {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new AppError('No file provided', 'MISSING_FILE', 400);
    }

    LogService.info('Received file', { filename: file.name });

    try {
      const filePath = await FileService.createTempFile(file);
      LogService.debug('File saved', { path: filePath });
      return { filePath, shouldCleanup: false };
    } catch (error) {
      LogService.error('Error in handleFileUpload', error);
      throw error;
    }
  }

  static async handleFilePath(request: NextRequest): Promise<ProcessOptions> {
    const body = await request.json();
    
    if (!body.filePath) {
      throw new AppError('No file path provided', 'MISSING_FILE_PATH', 400);
    }

    await FileService.verifyFile(body.filePath);
    return { filePath: body.filePath, shouldCleanup: false };
  }
} 