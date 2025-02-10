import { models } from '@/db/models';
import type { Transaction } from 'sequelize';
import { validateInput } from '@/graphql/validation/validator';
import { createPatientSchema, CreatePatientSchema } from '@/graphql/validation/schemas';
import { LogService } from '@/utils/logging';
import { AppError } from '@/utils/errorHandling';

export interface CreatePatientInput {
  PatientName: string;
  CreatedDate: Date;
}

export const createOrFindPatient = async (
  input: CreatePatientSchema,
  transaction: Transaction
) => {
  try {
    const validatedInput = validateInput(createPatientSchema, input);
    
    LogService.debug('Creating or finding patient', { input: validatedInput });
    
    const [patient] = await models.Patient.findOrCreate({
      where: { PatientName: validatedInput.PatientName },
      defaults: validatedInput,
      transaction,
      lock: true
    });
    
    LogService.info('Patient operation completed', { patientId: patient.idPatient });
    
    return patient;
  } catch (error) {
    LogService.error('Patient operation failed', { error });
    throw error instanceof AppError ? error : new AppError('Failed to create or find patient');
  }
};