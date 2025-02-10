
export const fileTypeDefs = `
  type File {
    idFile: ID!
    idPatient: ID!
    idStudy: ID!
    idSeries: ID!
    FilePath: String!
    CreatedDate: String!
    series: Series
    study: Study     
    patient: Patient 
  }
`;