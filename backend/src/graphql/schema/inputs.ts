
export const inputTypeDefs = `
  input DicomUploadInput {
    patientName: String!
    studyDate: String!
    studyDescription: String
    seriesDescription: String
    modality: String!
    filePath: String!
  }
`;