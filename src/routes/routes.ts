import express from 'express';
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { getFts, postFts } from '../controllers/fts.controller';
import { postCrane } from '../controllers/crane.controller';

const prisma = new PrismaClient()

const router = express.Router();

router.get('/user', async (req: Request, res: Response) => {
    const user = await prisma.user.findMany({
        include: {
            pets: true
        }
    })
    return res.status(200).json(user)
})

router.post('/fts', postFts)
router.get('/fts', getFts)

router.post('/crane', postCrane)

router.post('/cargo', async (req: Request, res: Response) => {
    try {
        const { cargoName } = req.body
        const cargo = await prisma.cargo.create({
            data: {
                cargoName
            }
        })
        return res.status(200).json(cargo)
    } catch (error) {
        console.log(error)
    }
})

router.get('/cargo-cranes', async (req: Request, res: Response) => {
    try {
        const cargo_cranes = await prisma.cargoCranes.findMany({
            include: {
                crane: true,
                cargo: true,
                fts: true
            }
        })
        return res.status(200).json(cargo_cranes)
    } catch (error) {
        console.log(error)
    }
})

router.post('/cargo-cranes', async (req: Request, res: Response) => {
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
});

export default router