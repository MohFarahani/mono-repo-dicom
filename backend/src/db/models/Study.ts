import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../connection';

export class Study extends Model {
  declare idPatient: number;
  declare idStudy: number;
  declare StudyName: string;
  declare StudyDate: Date;
  declare CreatedDate: Date;
}

Study.init(
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
      primaryKey: true,
      autoIncrement: true,
    },
    StudyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    StudyDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Study',
    timestamps: false,
  }
);