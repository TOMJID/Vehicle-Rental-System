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
    { name: user.name, email: user.email, id: user.id },
    JWTSecret,
    {
      expiresIn: "7d",
    }
  );

  return { token, user };
};

export const authService = {
  signIn,
};
