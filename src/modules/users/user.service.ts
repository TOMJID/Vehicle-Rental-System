import pool from "../../config/db.config";
import bcrypt from "bcryptjs";



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

//? delete user by id
const deleteUserById = async (userId: any) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [userId]);
  return result;
};
export const userService = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
