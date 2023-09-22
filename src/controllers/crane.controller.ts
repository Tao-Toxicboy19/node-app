import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const postCrane = async (req: Request, res: Response) => {
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