import { readFileSync } from 'fs';
import { join } from 'path';
import { pool } from './index';

async function migrate() {
  try {
    console.log('Running database migrations...');

    const schemaSQL = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');

    await pool.query(schemaSQL);

    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
