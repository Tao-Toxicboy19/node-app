import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const postCargo = async (req: Request, res: Response) => {
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
}