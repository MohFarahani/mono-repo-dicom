import { LogService } from './logging';

export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: any) => {
  LogService.error('API Error:', error);

  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
    };
  }

  return {
    statusCode: 500,
    message: 'Internal Server Error',
  };
}; 