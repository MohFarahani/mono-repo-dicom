import {  models } from '@/db/models';
import { FileInstance } from '@/db/models/File';
import { AppError } from '@/utils/errorHandling';
import { LogService } from '@/utils/logging';
import { validateInput } from '@/graphql/validation/validator';
import { fileIdSchema, filePathSchema, FileIdSchema, FilePathSchema } from '@/graphql/validation/schemas';
import { DateService } from '@/utils/dates';

interface FileIdArgs {
  idFile: string;
}

interface FilePathArgs {
  filePath: string;
}

export const fileQueries = {
  files: async () => {
    try {
      LogService.debug('Fetching all files');
      
      const files = await models.File.findAll();
      LogService.info('Successfully fetched all files', { count: files.length });
      return files;
      
    } catch (error) {
      LogService.error('Failed to fetch files', { error });
      throw error instanceof AppError ? error : new AppError('Failed to fetch files');
    }
  },

  file: async (_: any, args: any) => {
    try {
      const validatedInput = validateInput(fileIdSchema, args);
      
      LogService.debug('Fetching file', { input: validatedInput });
      
      const file = await models.File.findByPk(validatedInput.idFile);
      if (!file) {
        throw new AppError('File not found');
      }
      
      LogService.info('File fetched successfully', { fileId: file.idFile });
      
      return file;
    } catch (error) {
      LogService.error('Failed to fetch file', { error });
      throw error instanceof AppError ? error : new AppError('Failed to fetch file');
    }
  },

  getAllDicomFiles: async () => {
    try {
      const files = await models.File.findAll({
        include: [
          {
            model: models.Patient,
            attributes: ['PatientName'],
            required: true,
          },
          {
            model: models.Study,
            attributes: ['StudyDate', 'StudyName'],
            required: true,
          },
          {
            model: models.Series,
            attributes: ['SeriesName'],
            required: true,
            include: [
              {
                model: models.Modality,
                attributes: ['Name'],
                required: true,
              },
            ],
          },
        ],
        order: [['CreatedDate', 'DESC']],
      });

      return files.map((file) => {
        const studyDate = file.Study?.StudyDate;
        const formattedStudyDate = studyDate instanceof Date 
          ? studyDate.toISOString().split('T')[0].replace(/-/g, '')
          : typeof studyDate === 'string' 
            ? studyDate 
            : '';

        const createdDate = file.CreatedDate;
        const formattedCreatedDate = createdDate instanceof Date
          ? createdDate.toISOString()
          : typeof createdDate === 'string'
            ? createdDate
            : '';

        return {
          id: file.idFile.toString(),
          idFile: file.idFile.toString(),
          idPatient: file.idPatient.toString(),
          idStudy: file.idStudy.toString(),
          idSeries: file.idSeries.toString(),
          FilePath: file.FilePath,
          PatientName: file.Patient?.PatientName ?? '',
          StudyDate: formattedStudyDate,
          StudyDescription: file.Study?.StudyName ?? '',
          SeriesDescription: file.Series?.SeriesName ?? '',
          Modality: file.Series?.Modality?.Name ?? '',
          CreatedDate: formattedCreatedDate
        };
      });
    } catch (error) {
      LogService.error('Query getAllDicomFiles error:', error);
      throw error;
    }
  },

  checkFilePathExists: async (_: any, args: FilePathArgs) => {
    try {
      const validatedArgs = validateInput(filePathSchema, args);
      const { filePath } = validatedArgs as FilePathArgs;
      
      LogService.debug('Checking if file path exists', { filePath });
      
      const file = await models.File.findOne({
        where: { FilePath: filePath }
      });

      const exists = !!file;
      LogService.info('File path existence check completed', { filePath, exists });
      return exists;
      
    } catch (error) {
      LogService.error('Failed to check file path', { error, filePath: args.filePath });
      throw error instanceof AppError ? error : new AppError('Failed to check file path');
    }
  },
};