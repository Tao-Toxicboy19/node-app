"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.registerController = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerController = async (req, res) => {
    try {
        const { username, password, confirmpassword } = req.body;
        if (!(username && password && confirmpassword))
            return res.status(400).send("All input is required");
        if (password !== confirmpassword) {
            return res.status(401).send("Password and confirm password do not match");
        }
        const oldUser = await prisma_1.default.user.findUnique({
            where: { username: username },
        });
        if (oldUser)
            return res.status(409).send("User already exists. Please login");
        const encryptedPassword = await bcrypt_1.default.hash(password, 10);
        const encryptedConfirmPassword = await bcrypt_1.default.hash(confirmpassword, 10);
        const newUser = await prisma_1.default.user.create({
            data: {
                username: username,
                password: encryptedPassword,
                confirmpassword: encryptedConfirmPassword,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, "Toxicboy", {
            expiresIn: "1h",
        });
        return res.status(201).json({ message: "OK", token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};
exports.registerController = registerController;
const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!(username && password))
            return res.status(400).send("Username and password are required");
        const user = await prisma_1.default.user.findUnique({
            where: { username: username },
        });
        if (!user)
            return res.status(401).send("Invalid credentials");
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(401).send("Invalid credentials");
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, "Toxicboy", {
            expiresIn: "1h",
        });
        return res.status(200).json({ message: "OK", token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};
exports.loginController = loginController;
