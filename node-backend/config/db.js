import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'Raksh@2807',
  database: process.env.DB_NAME || 'event_intel_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database tables
export async function initDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Successfully connected to MySQL event_intel_db database.');
    
    // Create articles table if not exists with sentiment column
    await connection.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content LONGTEXT,
        sentiment VARCHAR(20) DEFAULT 'neutral'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Column Migration check in case table exists from previous runs
    try {
      await connection.query("ALTER TABLE articles ADD COLUMN sentiment VARCHAR(20) DEFAULT 'neutral'");
      console.log('Successfully migrated database: Added sentiment column.');
    } catch (columnExistsError) {
      // Column already exists, safe to ignore
    }

    console.log('Database tables verified/initialized.');
  } catch (error) {
    console.error('Error connecting to database or initializing tables:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

export default pool;
