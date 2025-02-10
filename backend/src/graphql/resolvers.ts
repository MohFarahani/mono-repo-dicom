// src/graphql/resolvers.ts

import { patientQueries } from './resolvers/queries/patient';
import { studyQueries } from './resolvers/queries/study';
import { seriesQueries } from './resolvers/queries/series';
import { fileQueries } from './resolvers/queries/file';
import { processDicomUpload } from './resolvers/mutations/processDicomUpload';
import { Patient } from './resolvers/types/patient';
import { Study } from './resolvers/types/study';
import { Series } from './resolvers/types/series';
import { File } from './resolvers/types/file';

export const resolvers = {
  Query: {
    ...patientQueries,
    ...studyQueries,
    ...seriesQueries,
    ...fileQueries,
  },
  Mutation: {
    processDicomUpload,
  },
  Patient,
  Study,
  Series,
  File,
};