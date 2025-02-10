import { models } from '@/db/models';
import type { Transaction } from 'sequelize';
import { validateInput } from '@/graphql/validation/validator';
import { createSeriesSchema, CreateSeriesSchema } from '@/graphql/validation/schemas';
import { LogService } from '@/utils/logging';
import { AppError } from '@/utils/errorHandling';

export const createSeries = async (
  input: CreateSeriesSchema,
  transaction: Transaction
) => {
  try {
    const validatedInput = validateInput(createSeriesSchema, input);
    
    LogService.debug('Creating series', { input: validatedInput });
    
    const series = await models.Series.create(validatedInput, { transaction });
    
    LogService.info('Series created successfully', { seriesId: series.idSeries });
    
    return series;
  } catch (error) {
    LogService.error('Failed to create series', { error });
    throw error instanceof AppError ? error : new AppError('Failed to create series');
  }
};