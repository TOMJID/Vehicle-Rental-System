import pool from "../../config/db.config";
import bcrypt from "bcryptjs";

const createUser = async (payload: Record<string, any>) => {
  const { name, email, password, phone, role } = payload;

  const hashedPass = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPass, phone, role]
  );
  return result;
};

export const userService = {
  createUser,
};
