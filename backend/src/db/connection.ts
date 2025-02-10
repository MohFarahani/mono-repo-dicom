import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';
import { LogService } from '../utils/logging';
import { AppError } from '../utils/errorHandling';

const sequelize = new Sequelize({
  dialect: 'mysql',
  dialectModule: mysql2,
  host: process.env.DB_HOST || '127.0.0.1',
  username: process.env.DB_USER || 'dicom_user',
  password: process.env.DB_PASS || 'dicom_password',
  database: process.env.DB_NAME || 'dicom_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  logging: (msg) => LogService.debug('Sequelize Query:', { query: msg }),
});

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    LogService.info('Database connection has been established successfully.');
    
    // This will create all tables based on your models
    await sequelize.sync();
    LogService.info('Database tables created successfully');
  } catch (error) {
    LogService.error('Database initialization failed', { error });
    throw new AppError('Failed to initialize database connection');
  }
}

// Initialize the database when the application starts
initializeDatabase();

export { sequelize };