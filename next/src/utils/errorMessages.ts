export const ErrorMessages = {
  // Validation errors
  REQUIRED_PATIENT_NAME: 'Patient name is required',
  REQUIRED_STUDY_DATE: 'Study date must be in YYYYMMDD format',
  REQUIRED_MODALITY: 'Modality name is required',
  REQUIRED_FILE_PATH: 'File path is required',
  REQUIRED_FILE_ID: 'File ID is required',
  REQUIRED_PATIENT_ID: 'Patient ID must be a positive integer',
  REQUIRED_STUDY_ID: 'Study ID must be a positive integer',
  REQUIRED_SERIES_ID: 'Series ID must be a positive integer',
  REQUIRED_MODALITY_ID: 'Modality ID must be a positive integer',
  REQUIRED_SERIES_NAME: 'Series name is required',
  REQUIRED_STUDY_NAME: 'Study name is required',

  // Not found errors
  FILE_NOT_FOUND: (id: string) => `File with ID ${id} not found`,
  PATIENT_NOT_FOUND: (id: string) => `Patient with ID ${id} not found`,
  STUDY_NOT_FOUND: (id: string) => `Study with ID ${id} not found`,
  SERIES_NOT_FOUND: (id: string) => `Series with ID ${id} not found`,

  // Operation errors
  FAILED_FILE_CHECK: 'Failed to check file existence',
  FAILED_CREATE_FILE: 'Failed to create file record',
  FAILED_CREATE_PATIENT: 'Failed to create or find patient',
  FAILED_CREATE_STUDY: 'Failed to create study',
  FAILED_CREATE_SERIES: 'Failed to create series',
  FAILED_CREATE_MODALITY: 'Failed to create or find modality'
} as const; 