import { models } from '@/db/models';

export const Series = {
  study: async (parent: { idStudy: string }) => {
    return await models.Study.findByPk(parent.idStudy);
  },
  modality: async (parent: { idModality: string }) => {
    return await models.Modality.findByPk(parent.idModality);
  },
  files: async (parent: { idSeries: string }) => {
    return await models.File.findAll({
      where: { idSeries: parent.idSeries }
    });
  }
};