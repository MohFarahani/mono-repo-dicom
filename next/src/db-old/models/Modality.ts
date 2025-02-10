import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../connection';

export class Modality extends Model {
  declare idModality: number;
  declare Name: string;
}

Modality.init(
  {
    idModality: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Modality',
    timestamps: false,
  }
);