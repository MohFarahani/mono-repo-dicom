import { sequelize } from '@/db/connection';
import { Transaction } from 'sequelize';
import type { DicomUploadInput } from '../../types';
import type { SqlError } from '@/types/errors';
import { models } from '@/db/models';
import { validateInput } from '@/graphql/validation/validator';
import { dicomUploadSchema } from '@/graphql/validation/schemas';
import { LogService } from '@/utils/logging';
import { AppError } from '@/utils/errorHandling';
import { DateService } from '@/utils/dates';
import { GraphQLError } from 'graphql';
import path from 'path';

// Import mutation functions
import { createOrFindPatient } from './patient';
import { createStudy } from './study';
import { createOrFindModality } from './modality';
import { createSeries } from './series';
import { createFile } from './file';

// Custom error class
export class DicomUploadError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'DicomUploadError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Constants
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Utility functions
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

const isDeadlockError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  const sqlError = error as any;
  return sqlError.original?.code === 'ER_LOCK_DEADLOCK';
};

const safeRollback = async (transaction: Transaction | null): Promise<void> => {
  if (!transaction) return;
  try {
    await transaction.rollback();
  } catch (rollbackError) {
    if (!(rollbackError instanceof Error) || 
        !rollbackError.message.includes('has been finished')) {
      console.error('Rollback error:', rollbackError);
    }
  }
};

const processDicomUploadWithRetry = async (input: DicomUploadInput, retryCount = 0) => {
  let transaction: Transaction | null = null;
  
  try {
    // Start transaction
    transaction = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
    });

    // Create or find patient
    const patient = await createOrFindPatient({
      PatientName: input.patientName,
      CreatedDate: new Date()
    }, transaction);

    // Create study
    const study = await createStudy({
      idPatient: patient.idPatient,
      StudyName: input.studyDescription || 'Unknown Study',
      StudyDate: DateService.formatDateString(input.studyDate),
      CreatedDate: new Date(),
    }, transaction);

    // Create or find modality
    const modality = await createOrFindModality({
      Name: input.modality
    }, transaction);

    // Create series
    const series = await createSeries({
      idPatient: patient.idPatient,
      idStudy: study.idStudy,
      idModality: modality.idModality,
      SeriesName: input.seriesDescription || 'Unknown Series',
      CreatedDate: new Date(),
    }, transaction);

    // Create file
    const file = await createFile({
      idPatient: patient.idPatient,
      idStudy: study.idStudy,
      idSeries: series.idSeries,
      FilePath: input.filePath,
      CreatedDate: new Date(),
    }, transaction);

    // Commit transaction
    await transaction.commit();
    return file;

  } catch (error) {
    // Rollback transaction on error
    await safeRollback(transaction);

    // Retry on deadlock
    if (isDeadlockError(error) && retryCount < MAX_RETRIES) {
      console.log(`Deadlock detected, retry attempt ${retryCount + 1} of ${MAX_RETRIES}`);
      await sleep(RETRY_DELAY * (retryCount + 1));
      return processDicomUploadWithRetry(input, retryCount + 1);
    }

    // Throw custom error
    throw new DicomUploadError(
      'Failed to process DICOM upload',
      error
    );
  }
};

// Main resolver function
export const processDicomUpload = async (_, { input }: { input: DicomUploadInput }) => {
  let transaction: Transaction | null = null;

  try {
    // Start transaction
    transaction = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
    });

    LogService.debug('Starting DICOM upload transaction', { input });

    // Get the base directory from environment variable
    const uploadDir = process.env.DICOM_FILES_PATH || path.join(__dirname, '../../../dicom_files');
    
    // Create relative file path
    const filePath = path.relative(uploadDir, path.join(uploadDir, input.filePath));
    
    LogService.debug('Processing file path', { 
      uploadDir,
      inputPath: input.filePath,
      relativePath: filePath
    });

    // Create or find patient
    const [patient] = await models.Patient.findOrCreate({
      where: { PatientName: input.patientName },
      defaults: { 
        PatientName: input.patientName,
        CreatedDate: new Date()
      },
      transaction,
      logging: (sql) => LogService.debug('Patient query:', { sql })
    });

    LogService.debug('Patient record processed', { patientId: patient.idPatient });

    // Create or find study
    const [study] = await models.Study.findOrCreate({
      where: { 
        idPatient: patient.idPatient,
        StudyDate: DateService.formatDateString(input.studyDate)
      },
      defaults: {
        idPatient: patient.idPatient,
        StudyDate: DateService.formatDateString(input.studyDate),
        StudyName: input.studyDescription || ''
      },
      transaction,
      logging: (sql) => LogService.debug('Study query:', { sql })
    });

    LogService.debug('Study record processed', { studyId: study.idStudy });

    // Create or find modality
    const [modality] = await models.Modality.findOrCreate({
      where: { Name: input.modality },
      defaults: { Name: input.modality },
      transaction,
      logging: (sql) => LogService.debug('Modality query:', { sql })
    });

    LogService.debug('Modality record processed', { modalityId: modality.idModality });

    // Create or find series
    const [series] = await models.Series.findOrCreate({
      where: {
        idStudy: study.idStudy,
        SeriesName: input.seriesDescription || '',
        idModality: modality.idModality
      },
      defaults: {
        idStudy: study.idStudy,
        SeriesName: input.seriesDescription || '',
        idModality: modality.idModality,
        idPatient: patient.idPatient
      },
      transaction,
      logging: (sql) => LogService.debug('Series query:', { sql })
    });

    LogService.debug('Series record processed', { seriesId: series.idSeries });

    // Create file record
    const file = await models.File.create({
      idPatient: patient.idPatient,
      idStudy: study.idStudy,
      idSeries: series.idSeries,
      FilePath: filePath,
      CreatedDate: new Date()
    }, { 
      transaction,
      logging: (sql) => LogService.debug('File query:', { sql })
    });

    LogService.debug('File record created', { fileId: file.idFile });

    // Commit transaction
    await transaction.commit();
    LogService.info('DICOM upload transaction committed successfully');

    return {
      id: file.idFile,
      idFile: file.idFile,
      idPatient: patient.idPatient,
      idStudy: study.idStudy,
      idSeries: series.idSeries,
      FilePath: file.FilePath,
      PatientName: patient.PatientName,
      StudyDate: study.StudyDate instanceof Date ? study.StudyDate.toISOString() : study.StudyDate,
      StudyDescription: study.StudyName,
      SeriesDescription: series.SeriesName,
      Modality: modality.Name,
      CreatedDate: file.CreatedDate.toISOString()
    };

  } catch (error) {
    // Rollback transaction on error
    if (transaction) {
      try {
        await transaction.rollback();
        LogService.info('Transaction rolled back successfully');
      } catch (rollbackError) {
        LogService.error('Error rolling back transaction', { error: rollbackError });
      }
    }

    LogService.error('Failed to process DICOM upload', { 
      error,
      input,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });

    throw new GraphQLError('Failed to process DICOM upload', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
};

// Export types for use in other files
export type { DicomUploadInput };