import { Pool } from "pg";
import { ENV } from "./dotenv.config";

const pool = new Pool({
  connectionString: ENV.connectionString,
});

export const initDB = async () => {
  //? User Table
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone VARCHAR(20) ,
      role VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW() 
     )`);

    console.log("Database initialized successfully");
  } catch (error: any) {
    console.error("Error initializing database:", error);
  }

  //? vehicles Table
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles(
      id SERIAL PRIMARY KEY,
      vehicles_name VARCHAR(100) NOT NULL,
      type VARCHAR(10) NOT NULL,
      registration_number VARCHAR(100) NOT NULL UNIQUE,
      daily_rent_price INTEGER NOT NULL,
      availability_status VARCHAR(50) NOT NULL
     )`);

    console.log("Vehicles table created successfully");
  } catch (error: any) {
    console.error("Error creating vehicles table:", error);
  }
};

export default pool;
