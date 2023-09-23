import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getCrane = async (req: Request, res: Response) => {
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
}