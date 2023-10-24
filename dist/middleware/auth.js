"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = async (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return res.status(401).send("No token");
        }
        jsonwebtoken_1.default.verify(token, "Toxicboy", (err) => {
            if (err) {
                console.error(err);
                return res.status(401).send("Token Invalid");
            }
            next();
        });
    }
    catch (err) {
        console.error(err);
        res.status(401).send("Token Invalid");
    }
};
exports.auth = auth;
