import { Sequelize } from 'sequelize';

let sequelize: Sequelize | null = null;

export const getSequelize = () => {
  if (!sequelize) {
    sequelize = new Sequelize({
      dialect: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER || 'dicom_user',
      password: process.env.DB_PASS || 'dicom_password',
      database: process.env.DB_NAME || 'dicom_db',
    });
  }
  return sequelize;
};