import { models } from '@/db/models';
import { validateInput } from '@/graphql/validation/validator';
import { patientIdSchema } from '@/graphql/validation/schemas';
import { LogService } from '@/utils/logging';
import { AppError } from '@/utils/errorHandling';

interface PatientArgs {
  idPatient: number;
}

export const patientQueries = {
  patients: async () => {
    try {
      LogService.debug('Fetching all patients');
      
      const patients = await models.Patient.findAll({
        include: [{
          model: models.Study,
          include: [{
            model: models.Series,
            include: [models.File]
          }]
        }]
      });
      
      LogService.info('Successfully fetched all patients', { count: patients.length });
      return patients;
      
    } catch (error) {
      LogService.error('Failed to fetch patients', { error });
      throw error instanceof AppError ? error : new AppError('Failed to fetch patients');
    }
  },

  patient: async (_: any, args: PatientArgs) => {
    try {
      const validatedArgs = validateInput(patientIdSchema, args);
      const { idPatient } = validatedArgs as unknown as PatientArgs;
      
      LogService.debug('Fetching patient by ID', { idPatient });
      
      const patient = await models.Patient.findByPk(idPatient, {
        include: [{
          model: models.Study,
          include: [{
            model: models.Series,
            include: [models.File]
          }]
        }]
      });

      if (!patient) {
        throw new AppError(`Patient with ID ${idPatient} not found`);
      }

      LogService.info('Successfully fetched patient', { idPatient });
      return patient;
      
    } catch (error) {
      LogService.error('Failed to fetch patient', { error, idPatient: args.idPatient });
      throw error instanceof AppError ? error : new AppError('Failed to fetch patient');
    }
  }
};
