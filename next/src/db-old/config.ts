import { Options } from 'sequelize';
import mysql2 from 'mysql2';

export const databaseConfig: Options = {
  dialect: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  username: process.env.DB_USER || 'dicom_user',
  password: process.env.DB_PASS || 'dicom_password',
  database: process.env.DB_NAME || 'dicom_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  dialectModule: mysql2,
};