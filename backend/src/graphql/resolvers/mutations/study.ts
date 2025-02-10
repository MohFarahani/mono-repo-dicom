import { models } from '@/db/models';
import type { Transaction } from 'sequelize';
import { validateInput } from '@/graphql/validation/validator';
import { createStudySchema, CreateStudySchema } from '@/graphql/validation/schemas';
import { LogService } from '@/utils/logging';
import { AppError } from '@/utils/errorHandling';

export const createStudy = async (
  input: CreateStudySchema,
  transaction: Transaction
) => {
  try {
    const validatedInput = validateInput(createStudySchema, input);
    
    LogService.debug('Creating study', { input: validatedInput });
    
    const study = await models.Study.create(validatedInput, { transaction });
    
    LogService.info('Study created successfully', { studyId: study.idStudy });
    
    return study;
  } catch (error) {
    LogService.error('Failed to create study', { error });
    throw error instanceof AppError ? error : new AppError('Failed to create study');
  }
};