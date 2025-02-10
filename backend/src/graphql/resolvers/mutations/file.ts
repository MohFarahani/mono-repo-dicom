import { models } from '@/db/models';
import type { Transaction } from 'sequelize';
import { validateInput } from '@/graphql/validation/validator';
import { createFileSchema, CreateFileSchema } from '@/graphql/validation/schemas';
import { LogService } from '@/utils/logging';
import { AppError } from '@/utils/errorHandling';

export const createFile = async (
  input: CreateFileSchema,
  transaction: Transaction
) => {
  try {
    const validatedInput = validateInput(createFileSchema, input);
    
    LogService.debug('Creating file record', { input: validatedInput });
    
    const file = await models.File.create(validatedInput, { transaction });
    
    LogService.info('File record created successfully', { fileId: file.idFile });
    
    return file;
  } catch (error) {
    LogService.error('Failed to create file record', { error });
    throw error instanceof AppError ? error : new AppError('Failed to create file record');
  }
};