import pool from "../../config/db.config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/dotenv.config";

const signIn = async (payload: Record<string, any>) => {
  const { email, password } = payload;

  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return null;
  }

  const JWTSecret = ENV.jwtSecret;

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWTSecret,
    {
      expiresIn: "7d",
    }
  );

  return { token, user };
};

const signUp = async (payload: Record<string, any>) => {
  const { name, email, password, phone, role } = payload;

  //! check if email is missing or in uppercase
  if (!email || email !== email.toLowerCase()) {
    throw new Error("Email is required and must be in lowercase");
  }

  //! check if password is missing OR if length is 6 or less
  if (!password || password.length < 6) {
    throw new Error("Password must be longer than 6 characters");
  }

  //! check role must be either 'admin' or 'customer'
  if (role !== "admin" && role !== "customer") {
    throw new Error("Role must be either 'admin' or 'customer'");
  }

  //? hash password before storing
  const hashedPass = await bcrypt.hash(password, 10);

  //? check if user already exists
  const existingUser = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  if (existingUser.rows.length > 0) {
    throw new Error("User with this email already exists");
  }

  //? store user in the database
  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPass, phone, role]
  );

  return result;
};
export const authService = {
  signIn,
  signUp,
};
