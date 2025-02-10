import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../connection';
import type { Patient } from './Patient';
import type { Study } from './Study';
import type { Series } from './Series';
import type { Modality } from './Modality';

interface FileAttributes {
  idPatient: number;
  idStudy: number;
  idSeries: number;
  idFile?: number;
  FilePath: string;
  CreatedDate: Date;
}

interface FileInstance extends Model<FileAttributes>, FileAttributes {
  Patient?: Patient & { Name: string };
  Study?: Study & { StudyDate: Date; StudyName: string };
  Series?: Series & { 
    SeriesName: string;
    Modality?: Modality & { Name: string };
  };
}

export const File = sequelize.define<FileInstance>(
  'File',
  {
    idPatient: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Patients',
        key: 'idPatient',
      },
    },
    idStudy: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Studies',
        key: 'idStudy',
      },
    },
    idSeries: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Series',
        key: 'idSeries',
      },
    },
    idFile: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    FilePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'Files',
    timestamps: false,
  }
);

export type { FileInstance };