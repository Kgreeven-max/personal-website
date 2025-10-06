// Database initialization script
import { initDatabase } from '../lib/db';

async function main() {
  console.log('🔄 Initializing database schema...');

  try {
    await initDatabase();
    console.log('✅ Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
}

main();
