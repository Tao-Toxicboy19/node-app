import { Request, Response } from "express";
import prisma from "../prisma/prisma";
import fs from "fs"
import path from "path";

export const createPuppyController = async (req: Request, res: Response) => {
    try {
        const { puppyName, breed } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const imageUrl = req.file.filename;

        const newPuppy = await prisma.puppyV2.create({
            data: {
                puppyName,
                breed,
                imageUrl,
            },
        });

        return res.status(201).json({ message: 'Puppy created successfully', puppy: newPuppy });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}

export const deletePuppyController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedPuppy = await prisma.puppyV2.delete({
            where: {
                id: parseInt(id),
            },
        });

        const filePath = path.join(__dirname, '../uploads', deletedPuppy.imageUrl);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("File deleted successfully");
            }
        });

        return res.status(200).json({ message: 'OK', puppy: deletedPuppy });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}

export const getPuppyController = async (req: Request, res: Response) => {
    try {
        const puppies = await prisma.puppyV2.findMany();

        return res.status(200).json(puppies);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}




