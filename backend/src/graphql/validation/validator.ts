import { z } from 'zod';
import { AppError } from '@/utils/errorHandling';
import { LogService } from '@/utils/logging';

export const validateInput = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue: z.ZodIssue) => issue.message).join(', ');
      LogService.error('Validation failed', { error: issues });
      throw new AppError(`Validation failed: ${issues}`);
    }
    throw error;
  }
}; 