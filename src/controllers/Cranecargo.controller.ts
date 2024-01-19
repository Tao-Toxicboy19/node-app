import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GetCargoCranesController = async (req: Request, res: Response) => {
    try {
        const cargoCranes = await prisma.cargo_crane.findMany({
            include: {
                crane: true,
                fts: true,
                cargo: true,
            }
        })
        return res.json(cargoCranes);
    } catch (error) {
        console.log(error)
    }
}

export const GetbyIdCargoCrane = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const cargoCrane = await prisma.cargo_crane.findUnique({
            where: { cargo_crane_id: id }
        });

        return res.json(cargoCrane);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
}

export const PostCargoCraneController = async (req: Request, res: Response) => {
    try {
        const { crane_id, cargo_id, FTS_id, consumption_rate, work_rate, category } = req.body;

        const newCargoCrane = await prisma.cargo_crane.create({
            data: {
                crane_id,
                cargo_id,
                FTS_id,
                consumption_rate,
                work_rate,
                category
            }
        });

        res.json(newCargoCrane);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    } finally {
        await prisma.$disconnect();
    }
};

export const PutCargoCraneController = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);

        const { crane_id, cargo_id, FTS_id, consumption_rate, work_rate, category } = req.body;

        const updatedCargoCrane = await prisma.cargo_crane.update({
            where: {
                cargo_crane_id: id
            },
            data: {
                crane_id,
                cargo_id,
                FTS_id,
                consumption_rate,
                work_rate,
                category
            }
        });

        res.json(updatedCargoCrane);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    } finally {
        await prisma.$disconnect();
    }
};


export const DeleteCargoCraneController = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);

        const deletedCargoCrane = await prisma.cargo_crane.delete({
            where: {
                cargo_crane_id: id
            }
        });
        res.json({ message: 'OK' });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    } finally {
        await prisma.$disconnect();
    }
}
