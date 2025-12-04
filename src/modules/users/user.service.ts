import pool from "../../config/db.config";
import bcrypt from "bcryptjs";

//? create a new user
const createUser = async (payload: Record<string, any>) => {
  const { name, email, password, phone, role } = payload;

  //? check if password is missing OR if length is 6 or less
  if (!password || password.length <= 6) {
    throw new Error("Password must be longer than 6 characters");
  }

  //? hash password before storing
  const hashedPass = await bcrypt.hash(password, 10);

  //? store user in the database
  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPass, phone, role]
  );
  return result;
};

//? get all users
const getAllUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

export const userService = {
  createUser,
  getAllUsers,
};
