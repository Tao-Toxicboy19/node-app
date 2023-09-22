import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const postFts = async (req: Request, res: Response) => {
    try {
        const { ftsName, lat, lng, setuptime_fts, speed } = req.body
        const fts = await prisma.fts.create({
            data: {
                ftsName,
                lat,
                lng,
                setuptime_fts,
                speed
            }
        })
        return res.status(200).json(fts)
    } catch (error) {
        console.log(error)
    }
}

export const getFts = async (req: Request, res: Response) => {
    try {
        const fts = await prisma.fts.findMany({
            include: {
                cranes: true
            }
        })
        return res.status(200).json(fts)
    } catch (error) {
        console.log(error)
    }
}