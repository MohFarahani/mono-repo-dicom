import { sequelize } from './connection';

async function initDatabase() {
  try {
    await sequelize.sync({ force: true }); 
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Failed to synchronize database:', error);
  }
}

export default initDatabase;