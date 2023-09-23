import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getCargoCrane = async (req: Request, res: Response) => {
    try {
        const { craneName, fts_id, setuptime_crane } = req.body
        const crane = await prisma.crane.create({
            data: {
                craneName,
                fts_id,
                setuptime_crane
            }
        })
        return res.status(200).json(crane)
    } catch (error) {
        console.log(error)
    }
}

export const postCargoCrane = async (req: Request, res: Response) => {
    try {
        const {
            crane_id,
            cargo_id,
            fts_id,
            consumption_rates,
            workrates,
            category,
        } = req.body;

        const cargoCranes = await prisma.cargoCranes.create({
            data: {
                crane_id,
                cargo_id,
                fts_id,
                consumption_rates,
                workrates,
                category,
            },
        });

        res.status(201).json(cargoCranes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating CargoCranes.' });
    }
}