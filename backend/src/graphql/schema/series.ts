
export const seriesTypeDefs = `
  type Series {
    idSeries: ID!
    idPatient: ID!
    idStudy: ID!
    idModality: ID!
    SeriesName: String!
    CreatedDate: String!
    study: Study
    modality: Modality
    files: [File]
  }
`;