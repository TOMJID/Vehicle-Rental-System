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
  userId: number,
  payload: Record<string, any>,
  actingUser: { id: number; role: string }
) => {
  // Check authorization
  if (actingUser.role !== "admin" && actingUser.id !== userId) {
    throw new Error("You are not authorized to update this profile");
  }

  // Fetch current user
  const findUser = await pool.query(`SELECT * FROM users WHERE id=$1`, [userId]);
  if (findUser.rows.length === 0) {
    throw new Error("User not found");
  }
  const currentUser = findUser.rows[0];

  const { name, email, phone, role } = payload;

  // Only admin can update role
  const newRole =
    actingUser.role === "admin" && role ? role : currentUser.role;

  const newName = name || currentUser.name;
  const newEmail = email || currentUser.email;
  const newPhone = phone || currentUser.phone;

  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2, phone=$3, role=$4  WHERE id=$5 RETURNING *`,
    [newName, newEmail, newPhone, newRole, userId]
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
