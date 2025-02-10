export interface DicomData {
  PatientName: string;
  StudyDate: string;
  StudyDescription?: string;
  SeriesDescription?: string;
  Modality: string;
  FilePath: string;
} 