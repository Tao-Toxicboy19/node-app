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

export const getPuppyByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Missing id parameter" });
        }

        const puppy = await prisma.puppyV2.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!puppy) {
            return res.status(404).json({ error: "Puppy not found" });
        }

        return res.status(200).json(puppy);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}


export const updatedPuppyController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { puppyName, breed } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const newImageUrl = req.file.filename;

        const updatedPuppy = await prisma.puppyV2.update({
            where: {
                id: parseInt(id),
            },
            data: {
                puppyName: puppyName,
                breed: breed,
                imageUrl: newImageUrl,
            },
        });

        return res.status(200).json({ message: 'Puppy image updated successfully', puppy: updatedPuppy });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
}
