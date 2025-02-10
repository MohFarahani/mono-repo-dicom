export const typeDefs = `
  type DicomData {
    PatientName: String!
    StudyDate: String!
    StudyDescription: String
    SeriesDescription: String
    Modality: String!
    FilePath: String!
  }

  type Query {
    getAllDicomFiles: [DicomData!]!
    checkFilePathExists(filePath: String!): Boolean!
  }

  input DicomUploadInput {
    patientName: String!
    studyDate: String!
    studyDescription: String
    seriesDescription: String
    modality: String!
    filePath: String!
  }

  type Mutation {
    processDicomUpload(input: DicomUploadInput!): DicomData
  }
`; 