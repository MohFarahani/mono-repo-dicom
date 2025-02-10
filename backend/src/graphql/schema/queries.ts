export const queryTypeDefs = `
  type DicomFileData {
    id: ID!
    idFile: ID!
    idPatient: ID!
    idStudy: ID!
    idSeries: ID!
    FilePath: String!
    PatientName: String!
    StudyDate: String!
    StudyDescription: String
    SeriesDescription: String
    Modality: String!
    CreatedDate: String!
  }

  type Query {
    patients: [Patient]
    patient(idPatient: ID!): Patient
    studies: [Study]
    study(idStudy: ID!): Study
    allSeries: [Series]
    series(idSeries: ID!): Series
    files: [File]
    file(idFile: ID!): File
    getAllDicomFiles: [DicomFileData!]!
    checkFilePathExists(filePath: String!): Boolean!
  }
`;