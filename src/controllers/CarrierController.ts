import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GetCarrierController = async (req: Request, res: Response) => {
    try {
        const carriers = await prisma.carrier.findMany({});

        // ตรวจสอบและแก้ไขค่า has_crane
        const updatedCarriers = carriers.map(carrier => {
            if (carrier.has_crane === "has") {
                carrier.has_crane = "มีเครน";
            } else if (carrier.has_crane === "no" || carrier.has_crane === null) {
                carrier.has_crane = "ไม่มีเครน";
            }
            return carrier;
        });

        return res.json(updatedCarriers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
}


export const GetbyIdCarrier = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const carrier = await prisma.carrier.findUnique({
            where: { cr_id: id }
        })
        return res.json(carrier)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
    }
}


export const PostCarrierController = async (req: Request, res: Response) => {
    try {
        const { carrier_name, holder, maxcapacity, burden, Width, carrier_max_FTS, carrier_max_crane, length, has_crane, group } = req.body
        const carrier = await prisma.carrier.create({
            data: {
                carrier_name, holder, maxcapacity, burden, Width, carrier_max_FTS, carrier_max_crane, length, has_crane, group
            }
        })
        return res.json({ message: 'OK', carrier })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
}

export const PutCarrierController = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);

        const { carrier_name, holder, maxcapacity, burden, Width, carrier_max_FTS, carrier_max_crane, length, has_crane } = req.body;

        const updatedCarrier = await prisma.carrier.update({
            where: { cr_id: id },
            data: {
                carrier_name, holder, maxcapacity, burden, Width, carrier_max_FTS, carrier_max_crane, length, has_crane
            }
        });

        res.json(updatedCarrier)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
}


export const DeleteCarrierController = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const deleteCarrier = await prisma.carrier.delete({
            where: { cr_id: id }
        })
        return res.json({ message: 'OK' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
}   