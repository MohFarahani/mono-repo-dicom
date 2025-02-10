
export const patientTypeDefs = `
  type Patient {
    idPatient: ID!
    Name: String!
    CreatedDate: String!
    studies: [Study]
  }
`;