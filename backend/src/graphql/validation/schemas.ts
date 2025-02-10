import { z } from 'zod';
import { ERROR_MESSAGES } from '@/utils/errorMessages';

// Upload schemas
export const dicomUploadSchema = z.object({
  patientName: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  studyDate: z.string().regex(/^\d{8}$/, ERROR_MESSAGES.VALIDATION.INVALID_DATE),
  studyDescription: z.string().optional(),
  seriesDescription: z.string().optional(),
  modality: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  filePath: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

// ID schemas
export const fileIdSchema = z.object({
  idFile: z.string().min(1, ERROR_MESSAGES.VALIDATION.INVALID_ID)
});

export const filePathSchema = z.object({
  filePath: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
});

export const patientIdSchema = z.object({
  idPatient: z.number().int().positive(ERROR_MESSAGES.VALIDATION.INVALID_ID)
});

export const studyIdSchema = z.object({
  idStudy: z.string().min(1, ERROR_MESSAGES.VALIDATION.INVALID_ID)
});

export const seriesIdSchema = z.object({
  idSeries: z.string().min(1, ERROR_MESSAGES.VALIDATION.INVALID_ID)
});

// Create schemas
export const createFileSchema = z.object({
  idPatient: z.number().int().positive(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  idStudy: z.number().int().positive(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  idSeries: z.number().int().positive(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  FilePath: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  CreatedDate: z.date()
});

export const createModalitySchema = z.object({
  Name: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
});

export const createPatientSchema = z.object({
  PatientName: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  CreatedDate: z.date()
});

export const createSeriesSchema = z.object({
  idPatient: z.number().int().positive(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  idStudy: z.number().int().positive(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  idModality: z.number().int().positive(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  SeriesName: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  CreatedDate: z.date()
});

export const createStudySchema = z.object({
  idPatient: z.number().int().positive(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  StudyName: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  StudyDate: z.date(),
  CreatedDate: z.date()
});

// Type exports
export type DicomUploadSchema = z.infer<typeof dicomUploadSchema>;
export type FileIdSchema = z.infer<typeof fileIdSchema>;
export type FilePathSchema = z.infer<typeof filePathSchema>;
export type PatientIdSchema = z.infer<typeof patientIdSchema>;
export type StudyIdSchema = z.infer<typeof studyIdSchema>;
export type SeriesIdSchema = z.infer<typeof seriesIdSchema>;
export type CreateFileSchema = z.infer<typeof createFileSchema>;
export type CreateModalitySchema = z.infer<typeof createModalitySchema>;
export type CreatePatientSchema = z.infer<typeof createPatientSchema>;
export type CreateSeriesSchema = z.infer<typeof createSeriesSchema>;
export type CreateStudySchema = z.infer<typeof createStudySchema>;