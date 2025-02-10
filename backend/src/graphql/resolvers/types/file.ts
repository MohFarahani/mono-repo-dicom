import { models } from '@/db/models';

export const File = {
  series: async (parent: { idSeries: string }) => {
    return await models.Series.findByPk(parent.idSeries);
  },
  study: async (parent: { idStudy: string }) => {
    return await models.Study.findByPk(parent.idStudy);
  },
  patient: async (parent: { idPatient: string }) => {
    return await models.Patient.findByPk(parent.idPatient);
  }
};