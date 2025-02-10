import { resolve } from 'path';
import { config } from 'dotenv';
import { Sequelize } from 'sequelize';

// Load environment variables
config({ path: resolve(__dirname, '../.env') });

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  username: process.env.DB_USER || 'dicom_user',
  password: process.env.DB_PASS || 'dicom_password',
  database: process.env.DB_NAME || 'dicom_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  logging: console.log,
  retry: {
    max: 10,
    match: [
      /ETIMEDOUT/,
      /ECONNREFUSED/,
      /PROTOCOL_CONNECTION_LOST/,
    ],
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

async function waitForDatabase(maxAttempts = 10) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await sequelize.authenticate();
      console.log('Database connection successful');
      return true;
    } catch (error) {
      console.log(`Connection attempt ${attempt}/${maxAttempts} failed:`, error);
      if (attempt === maxAttempts) {
        throw error;
      }
      // Wait for 5 seconds before next attempt
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  return false;
}

async function init() {
  try {
    console.log('Initializing database with configuration:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER
    });

    // Wait for database to be ready
    await waitForDatabase();


    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully');

    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

// Add debug logging
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

init();