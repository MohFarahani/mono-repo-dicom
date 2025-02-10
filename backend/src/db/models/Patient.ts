import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../connection';

export class Patient extends Model {
  declare idPatient: number;
  declare PatientName: string;
  declare CreatedDate: Date;
}

Patient.init(
  {
    idPatient: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    PatientName: {
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
    modelName: 'Patient',
    tableName: 'Patients',
    timestamps: false,
  }
);