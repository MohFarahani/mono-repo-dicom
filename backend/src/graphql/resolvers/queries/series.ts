import { models } from '@/db/models';
import { validateInput } from '@/graphql/validation/validator';
import { seriesIdSchema } from '@/graphql/validation/schemas';
import { LogService } from '@/utils/logging';
import { AppError } from '@/utils/errorHandling';

interface SeriesArgs {
  idSeries: string;
}

export const seriesQueries = {
  allSeries: async () => {
    try {
      LogService.debug('Fetching all series');
      
      const series = await models.Series.findAll({
        include: [models.File]
      });
      
      LogService.info('Successfully fetched all series', { count: series.length });
      return series;
      
    } catch (error) {
      LogService.error('Failed to fetch series', { error });
      throw error instanceof AppError ? error : new AppError('Failed to fetch series');
    }
  },

  series: async (_: any, args: SeriesArgs) => {
    try {
      const validatedArgs = validateInput(seriesIdSchema, args);
      const { idSeries } = validatedArgs as SeriesArgs;
      
      LogService.debug('Fetching series by ID', { idSeries });
      
      const series = await models.Series.findByPk(parseInt(idSeries), {
        include: [models.File]
      });

      if (!series) {
        throw new AppError(`Series with ID ${idSeries} not found`);
      }

      LogService.info('Successfully fetched series', { idSeries });
      return series;
      
    } catch (error) {
      LogService.error('Failed to fetch series', { error, idSeries: args.idSeries });
      throw error instanceof AppError ? error : new AppError('Failed to fetch series');
    }
  }
};