import { patientQueries } from './queries/patient';
import { studyQueries } from './queries/study';
import { seriesQueries } from './queries/series';
import { fileQueries } from './queries/file';
import { processDicomUpload } from './mutations/processDicomUpload';
import { Patient } from './types/patient';
import { Study } from './types/study';
import { Series } from './types/series';
import { File } from './types/file';

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