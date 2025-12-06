import { Pool, types } from "pg";
import { ENV } from "./dotenv.config";

//* TYPE PARSER FIX:
//* 1082 is the OID for the DATE type in Postgres.
//* We tell it to simply return the string value.
types.setTypeParser(1082, (val) => val);

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

  //? booking table
  try {
    await pool.query(`
     CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL
      )`);

    console.log("Bookings table created successfully");
  } catch (error: any) {
    console.error("Error creating bookings table:", error);
  }
};

export default pool;
