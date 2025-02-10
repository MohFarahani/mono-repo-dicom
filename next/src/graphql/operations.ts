import { gql } from '@apollo/client';

export const CHECK_FILE_PATH_EXISTS = gql`
  query CheckFilePathExists($filePath: String!) {
    checkFilePathExists(filePath: $filePath)
  }
`;

export const PROCESS_DICOM_UPLOAD = gql`
  mutation ProcessDicomUpload($input: DicomUploadInput!) {
    processDicomUpload(input: $input) {
      idFile
      idPatient
      idStudy
      idSeries
      FilePath
      CreatedDate
    }
  }
`;

export const GET_ALL_DICOM_FILES = gql`
  query GetAllDicomFiles {
    getAllDicomFiles {
      id
      idFile
      idPatient
      idStudy
      idSeries
      FilePath
      PatientName
      StudyDate
      SeriesDescription
      Modality
      CreatedDate
    }
  }
`; 