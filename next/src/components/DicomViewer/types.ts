export interface DicomViewerfData {
  image: {
    data: string;
    width: number;
    height: number;
  };
  PatientName: string;
  StudyDate: string;
  StudyDescription: string;
  SeriesDescription: string;
  Modality: string;
}

export interface DicomViewerProps {
  filePath: string;
} 