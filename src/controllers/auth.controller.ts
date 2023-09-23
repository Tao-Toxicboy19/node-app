import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password, confirmPassword } = req.body;

        const user = await prisma.user.findUnique({
            where: { username },
        });
        if (user) return res.status(404).json({ error: 'User not found' })

        // const createUser = await prisma.user.create({
        //     data: {
        //         username,
        //         password,
        //         confirmPassword,
        //     },
        // });

        return res.status(201).json("success");
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
