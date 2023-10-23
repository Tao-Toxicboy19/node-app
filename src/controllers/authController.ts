import { Request, Response } from "express";
import prisma from "../prisma/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerController = async (req: Request, res: Response) => {
    try {
        const { username, password, confirmpassword } = req.body;

        if (!(username && password && confirmpassword)) return res.status(400).send("All input is required");

        if (password !== confirmpassword) {
            return res.status(401).send("Password and confirm password do not match");
        }

        const oldUser = await prisma.user.findUnique({
            where: { username: username },
        });

        if (oldUser) return res.status(409).send("User already exists. Please login");

        const encryptedPassword = await bcrypt.hash(password, 10);
        const encryptedConfirmPassword = await bcrypt.hash(confirmpassword, 10);

        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: encryptedPassword,
                confirmpassword: encryptedConfirmPassword,
            },
        });

        const token = jwt.sign({ userId: newUser.id }, "Toxicboy", {
            expiresIn: "1h",
        });

        return res.status(201).json({ message: "OK", token });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!(username && password)) return res.status(400).send("Username and password are required");

        const user = await prisma.user.findUnique({
            where: { username: username },
        });

        if (!user) return res.status(401).send("Invalid credentials");

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return res.status(401).send("Invalid credentials");

        const token = jwt.sign({ userId: user.id }, "Toxicboy", {
            expiresIn: "1h",
        });

        return res.status(200).json({ message: "OK", token });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};