"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatedPuppyController = exports.getPuppyByIdController = exports.getPuppyController = exports.deletePuppyController = exports.createPuppyController = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const createPuppyController = async (req, res) => {
    try {
        const { puppyName, breed } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const imageUrl = req.file.filename;
        const newPuppy = await prisma_1.default.puppyV2.create({
            data: {
                puppyName,
                breed,
                imageUrl,
            },
        });
        return res.status(201).json({ message: 'Puppy created successfully', puppy: newPuppy });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};
exports.createPuppyController = createPuppyController;
const deletePuppyController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPuppy = await prisma_1.default.puppyV2.delete({
            where: {
                id: parseInt(id),
            },
        });
        const filePath = path_1.default.join(__dirname, '../uploads', deletedPuppy.imageUrl);
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
            }
            else {
                console.log("File deleted successfully");
            }
        });
        return res.status(200).json({ message: 'OK', puppy: deletedPuppy });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};
exports.deletePuppyController = deletePuppyController;
const getPuppyController = async (req, res) => {
    try {
        const puppies = await prisma_1.default.puppyV2.findMany();
        return res.status(200).json(puppies);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getPuppyController = getPuppyController;
const getPuppyByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Missing id parameter" });
        }
        const puppy = await prisma_1.default.puppyV2.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        if (!puppy) {
            return res.status(404).json({ error: "Puppy not found" });
        }
        return res.status(200).json(puppy);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getPuppyByIdController = getPuppyByIdController;
const updatedPuppyController = async (req, res) => {
    try {
        const { id } = req.params;
        const { puppyName, breed } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const newImageUrl = req.file.filename;
        const updatedPuppy = await prisma_1.default.puppyV2.update({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};
exports.updatedPuppyController = updatedPuppyController;
