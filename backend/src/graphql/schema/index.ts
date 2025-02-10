import { patientTypeDefs } from './patient';
import { studyTypeDefs } from './study';
import { seriesTypeDefs } from './series';
import { fileTypeDefs } from './file';
import { modalityTypeDefs } from './modality';
import { inputTypeDefs } from './inputs';
import { queryTypeDefs } from './queries';
import { mutationTypeDefs } from './mutations';

export const typeDefs = `
  ${patientTypeDefs}
  ${studyTypeDefs}
  ${seriesTypeDefs}
  ${fileTypeDefs}
  ${modalityTypeDefs}
  ${inputTypeDefs}
  ${queryTypeDefs}
  ${mutationTypeDefs}
`;