import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return res.status(401).send("No token");
        }

        jwt.verify(token, "Toxicboy", (err) => {
            if (err) {
                console.error(err);
                return res.status(401).send("Token Invalid");
            }

            next();
        });
    } catch (err) {
        console.error(err);
        res.status(401).send("Token Invalid");
    }
};
