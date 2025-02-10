import { models } from '@/db/models';

export const Study = {
  patient: async (parent: { idPatient: string }) => {
    return await models.Patient.findByPk(parent.idPatient);
  },
  series: async (parent: { idStudy: string }) => {
    return await models.Series.findAll({
      where: { idStudy: parent.idStudy }
    });
  }
};