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

export const findAllUsers = async (): Promise<User[]> => {
  const { rows } = await query(
    "SELECT id, name, email, role FROM users ORDER BY id",
  );
  return rows;
};

export const deleteUser = async (
  id: number,
): Promise<User | null> => {
  const { rows } = await query(
    "DELETE FROM users WHERE id = $1 AND role = 'Customer' RETURNING id",
    [id],
  );
  return rows[0] || null;
};

export const updateUser = async (
  id: number,
  name: string,
  email: string,
  password?: string
): Promise<User | null> => {
  let password_hash: string | null = null;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    password_hash = await bcrypt.hash(password, salt);
  }

  const { rows } = await query(
    `UPDATE users
     SET name = $1, email = $2, password_hash = COALESCE($3, password_hash)
     WHERE id = $4
     RETURNING id, name, email, role`,
    [name, email, password_hash, id]
  );
  return rows[0] || null;
};