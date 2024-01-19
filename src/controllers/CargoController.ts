import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const GetCargoController = async (req: Request, res: Response) => {
    try {
        const cargo = await prisma.cargo.findMany()
        return res.json(cargo)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
}

export const GetbyId = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const cargo = await prisma.cargo.findUnique({
            where: { cargo_id: id }
        });

        if (!cargo) {
            return res.status(404).json({ error: "ไม่พบข้อมูลของ cargo ที่ระบุ" });
        }
        res.json(cargo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

export const PostCargoController = async (req: Request, res: Response) => {
    try {
        const cargo = req.body;
        const newCargoData = cargo.inputs.map((input: any) => ({
            cargo_name: input.cargo_names,
            premium_rate: +input.premium_rate
        }));
        const newCargo = await prisma.cargo.createMany({
            data: newCargoData
        });

        return res.json(newCargo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการสร้างข้อมูล" });
    }
}

export const UpdateCargoController = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id
        const { cargo_name, premium_rate } = req.body;
        const updatedCargo = await prisma.cargo.update({
            where: { cargo_id: id },
            data: {
                cargo_name,
                premium_rate: +premium_rate
            }
        });
        res.json(updatedCargo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
}

export const DeleteCargoController = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const deletedCargo = await prisma.cargo.delete({
            where: { cargo_id: id }
        });

        res.json(deletedCargo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล" });
    }
}