import { models } from '@/db/models';

export const Patient = {
  studies: async (parent: { idPatient: string }) => {
    return await models.Study.findAll({
      where: { idPatient: parent.idPatient }
    });
  }
};