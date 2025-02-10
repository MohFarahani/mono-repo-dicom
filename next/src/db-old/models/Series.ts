import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../connection';

export class Series extends Model {
  declare idPatient: number;
  declare idStudy: number;
  declare idSeries: number;
  declare idModality: number;
  declare SeriesName: string;
  declare CreatedDate: Date;
}

Series.init(
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
      primaryKey: true,
      autoIncrement: true,
    },
    idModality: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Modalities',
        key: 'idModality',
      },
    },
    SeriesName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Series',
    timestamps: false,
  }
);