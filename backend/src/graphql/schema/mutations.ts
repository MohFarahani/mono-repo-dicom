export const mutationTypeDefs = `
  type Mutation {
    processDicomUpload(input: DicomUploadInput!): DicomFileData
  }
`;