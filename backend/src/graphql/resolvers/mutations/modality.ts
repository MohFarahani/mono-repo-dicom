import { models } from '@/db/models';
import type { Transaction } from 'sequelize';
import { validateInput } from '@/graphql/validation/validator';
import { createModalitySchema, CreateModalitySchema } from '@/graphql/validation/schemas';
import { LogService } from '@/utils/logging';
import { AppError } from '@/utils/errorHandling';

export interface CreateModalityInput {
  Name: string;
}

export const createOrFindModality = async (
  input: CreateModalitySchema,
  transaction: Transaction
) => {
  try {
    const validatedInput = validateInput(createModalitySchema, input);
    
    LogService.debug('Creating or finding modality', { input: validatedInput });
    
    const [modality] = await models.Modality.findOrCreate({
      where: { Name: validatedInput.Name },
      defaults: { Name: validatedInput.Name },
      transaction,
      lock: true
    });
    
    LogService.info('Modality operation completed', { modalityId: modality.idModality });
    
    return modality;
  } catch (error) {
    LogService.error('Modality operation failed', { error });
    throw error instanceof AppError ? error : new AppError('Failed to create or find modality');
  }
};