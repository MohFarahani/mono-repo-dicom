export const studyTypeDefs = `
  type Study {
    idStudy: ID!
    idPatient: ID!
    StudyName: String!
    CreatedDate: String!
    patient: Patient
    series: [Series]
  }
`;