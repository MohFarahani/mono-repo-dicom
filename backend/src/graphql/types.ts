import { IncomingMessage } from 'http';

export interface Context {
  req: IncomingMessage;
}

export interface Patient {
  idPatient: string;
  Name: string;
  CreatedDate: Date;
}

export interface Study {
  idStudy: string;
  idPatient: string;
  StudyName: string;
  CreatedDate: Date;
}

export interface Series {
  idSeries: string;
  idPatient: string;
  idStudy: string;
  idModality: string;
  SeriesName: string;
  CreatedDate: Date;
}

export interface File {
  idFile: string;
  idPatient: string;
  idStudy: string;
  idSeries: string;
  FilePath: string;
  CreatedDate: Date;
}

export interface DicomUploadInput {
  patientName: string;
  studyDate: string;
  studyDescription?: string;
  seriesDescription?: string;
  modality: string;
  filePath: string;
}

export interface DicomData {
  id?: string | number;
  PatientName: string;
  StudyDate: string;
  StudyDescription?: string;
  SeriesDescription?: string;
  Modality: string;
  FilePath: string;
}