import { NextRequest } from 'next/server';
import { AppError } from '@/utils/errorHandling';

export const validateRequest = {
  filePath: (request: NextRequest) => {
    const filePath = request.nextUrl.searchParams.get('filePath');
    if (!filePath) {
      throw new AppError('No file path provided', 'MISSING_FILE_PATH', 400);
    }
    return filePath;
  },
  
  fileUpload: async (request: NextRequest) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      throw new AppError('No file provided', 'MISSING_FILE', 400);
    }
    return file;
  }
}; 