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

//? get single user by id
const getUserById = async (userId: number) => {
  const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [userId]);

  return result;
};

//? update user by id
const updateUserById = async (
  payload: Record<string, unknown>,
  userId: any
) => {
  const { name, email, phone, role } = payload;

  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2, phone=$3, role=$4  WHERE id=$5 RETURNING *`,
    [name, email, phone, role, userId]
  );

  return result;
};
export const userService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
};
