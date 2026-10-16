import { Request, Response } from "express";
import * as userService from "../services/authService";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
    const { name, email, password, role = "Customer" } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "name, email and password are required" });
    }
    if (role !=="Customer" && role !=="Admin") {
        return res.status(400).json({ message: "Role must be customer or admin" });
    }

    try {
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "Email is already in use" });
        }
        const user = await userService.createUser(name, email, password,role);
        res.status(201) .json({ message: "User registered successfully", 
                userId: user.id, 
                name: user.name,
                role: user.role});
    } catch (error) {
        res.status(500).json({ message: "Error registering the user" });
    }
};

export const login = async (req: Request, res: Response) => {
    const {name,  email, password } = req.body;
    if (!name ||!email || !password) {
        return res.status(400).json({ message: "name, email and password are required" });
    }

    try {
        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(409).json({ message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const payload = { 
            userId: user.id, 
            email: user.email, 
            name: user.name,
            role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: "1h",
        });

        res.status(200).json({ message: "Login Successful", token, user });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
};


export const getAllusers = async (req: Request, res: Response) => {
  try {
    const users = await userService.findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retreiving users" });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const deleteUser = await userService.deleteUser(id);
    if (!deleteUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User Deleted Succesfully" });
  } catch (error) {
    res.status(500).json({ message: "error deleting user" });
  }
};