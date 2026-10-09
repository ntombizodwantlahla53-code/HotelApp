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

        res.status(200).json({ message: "Login Successful", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
};
