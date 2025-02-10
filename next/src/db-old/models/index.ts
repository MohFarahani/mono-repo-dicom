import { Patient } from './Patient';
import { Study } from './Study';
import { Modality } from './Modality';
import { Series } from './Series';
import { File } from './File';

// Define associations
Patient.hasMany(Study, { foreignKey: 'idPatient' });
Study.belongsTo(Patient, { foreignKey: 'idPatient' });

Patient.hasMany(Series, { foreignKey: 'idPatient' });
Series.belongsTo(Patient, { foreignKey: 'idPatient' });

Patient.hasMany(File, { foreignKey: 'idPatient' });
File.belongsTo(Patient, { foreignKey: 'idPatient' });

Study.hasMany(Series, { foreignKey: 'idStudy' });
Series.belongsTo(Study, { foreignKey: 'idStudy' });

Study.hasMany(File, { foreignKey: 'idStudy' });
File.belongsTo(Study, { foreignKey: 'idStudy' });

Modality.hasMany(Series, { foreignKey: 'idModality' });
Series.belongsTo(Modality, { foreignKey: 'idModality' });

Series.hasMany(File, { foreignKey: 'idSeries' });
File.belongsTo(Series, { foreignKey: 'idSeries' });

export const models = {
  Patient,
  Study,
  Modality,
  Series,
  File,
};