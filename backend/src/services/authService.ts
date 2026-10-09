import { query } from "../config/database";
import bcrypt from "bcryptjs";
import { User } from "./../types/user.types"

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const { rows }= await query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0] || null;
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: "Customer" | "Admin" = "Customer"
): Promise<User> => {
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const { rows } = await query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
    [name, email, password_hash, role]
  );
  return rows[0];
};