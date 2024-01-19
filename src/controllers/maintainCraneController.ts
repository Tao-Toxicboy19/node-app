import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMainTainCrane = async (req: Request, res: Response) => {
    try {
        const mainTainCrane = await prisma.maintain_crane.findMany({
            include: {
                crane: true
            }
        })
        return res.json(mainTainCrane)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const getMainTainCraneById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);

        const mainTainCrane = await prisma.maintain_crane.findUnique({
            where: { maintain_crane_id: id },
            include: {
                crane: true,
            },
        });

        if (mainTainCrane) {
            return res.json(mainTainCrane);
        } else {
            return res.status(404).json({ error: "Maintenance Crane not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const postMainTainCrane = async (req: Request, res: Response) => {
    try {
        const { desc, downtime, start_time, mt_crane_id } = req.body;

        const newMainTainCrane = await prisma.maintain_crane.create({
            data: {
                desc,
                downtime,
                start_time,
                mt_crane_id,
            },
        });

        return res.json({ message: "OK", result: newMainTainCrane });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const deleteMainTainCrane = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);

        const deletedMainTainCrane = await prisma.maintain_crane.delete({
            where: { maintain_crane_id: id },
        });

        return res.json({ message: "Deleted", result: deletedMainTainCrane });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const getMainTainFTS = async (req: Request, res: Response) => {
    try {
        const mainTainFTS = await prisma.maintain_fts.findMany({
            include: {
                fts: true
            }
        })
        return res.json(mainTainFTS)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const getMainTainFTSById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);

        const result = await prisma.maintain_fts.findUnique({
            where: { maintain_FTS_id: id },
            include: {
                fts: true
            }
        });

        return res.json(result)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const postMainTainFTS = async (req: Request, res: Response) => {
    try {
        const { desc_FTS, downtime_FTS, start_time_FTS, mt_FTS_id } = req.body;

        const mainTainFTS = await prisma.maintain_fts.create({
            data: {
                desc_FTS,
                downtime_FTS,
                start_time_FTS,
                mt_FTS_id,
            },
        });

        return res.json({ message: "ok", result: mainTainFTS });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const putMainTainFTS = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);

        const { desc_FTS, downtime_FTS, start_time_FTS } = req.body

        const newMainTainFTS = await prisma.maintain_fts.update({
            where: { maintain_FTS_id: id },
            data: {
                desc_FTS: desc_FTS,
                downtime_FTS: downtime_FTS,
                start_time_FTS: start_time_FTS,
            }
        })
        return res.json(newMainTainFTS)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const deleteMainTainFTS = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);

        const deletedMainTainFTS = await prisma.maintain_fts.delete({
            where: { maintain_FTS_id: id },
        });

        return res.json({ message: "Deleted", result: deletedMainTainFTS });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}