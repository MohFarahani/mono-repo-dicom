import { models } from '@/db/models';
import { validateInput } from '@/graphql/validation/validator';
import { studyIdSchema } from '@/graphql/validation/schemas';
import { LogService } from '@/utils/logging';
import { AppError } from '@/utils/errorHandling';

interface StudyArgs {
  idStudy: string;
}

export const studyQueries = {
  studies: async () => {
    try {
      LogService.debug('Fetching all studies');
      
      const studies = await models.Study.findAll({
        include: [{
          model: models.Series,
          include: [models.File]
        }]
      });
      
      LogService.info('Successfully fetched all studies', { count: studies.length });
      return studies;
      
    } catch (error) {
      LogService.error('Failed to fetch studies', { error });
      throw error instanceof AppError ? error : new AppError('Failed to fetch studies');
    }
  },

  study: async (_: any, args: StudyArgs) => {
    try {
      const validatedArgs = validateInput(studyIdSchema, args);
      const { idStudy } = validatedArgs as StudyArgs;
      
      LogService.debug('Fetching study by ID', { idStudy });
      
      const study = await models.Study.findByPk(parseInt(idStudy), {
        include: [{
          model: models.Series,
          include: [models.File]
        }]
      });

      if (!study) {
        throw new AppError(`Study with ID ${idStudy} not found`);
      }

      LogService.info('Successfully fetched study', { idStudy });
      return study;
      
    } catch (error) {
      LogService.error('Failed to fetch study', { error, idStudy: args.idStudy });
      throw error instanceof AppError ? error : new AppError('Failed to fetch study');
    }
  }
};