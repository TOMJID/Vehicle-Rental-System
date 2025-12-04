import pool from "../../config/db.config";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  console.log(name, email, password, phone, role);
  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, password, phone, role]
  );
  return result;
};

export const userService = {
  createUser,
};
