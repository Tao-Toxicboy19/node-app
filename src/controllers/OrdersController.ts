import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import moment from 'moment';
import { parse } from 'csv-parse';

const prisma = new PrismaClient();

export const GetOrderController = async (req: Request, res: Response) => {
    try {
        const order = await prisma.carrier_order.findMany({
            include: {
                carrier: true,
                cargo_order: {
                    include: {
                        cargo: true,
                    },
                },
            },
        })
        return res.json(order)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const getSignOrder = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await prisma.carrier_order.findUnique({
            where: { or_id: id },
            include: {
                carrier: true,
                cargo_order: {
                    include: {
                        cargo: true,
                        Bulks: true
                    },
                },
            },
        });
        return res.json(result);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const PostOrderController = async (req: Request, res: Response) => {
    try {
        const order = req.body;
        const carrierOrderResult = await prisma.carrier_order.create({
            data: {
                cr_id: order.cr_id,
                category: order.category,
                arrival_time: order.arrival_time,
                deadline_time: order.deadline_time,
                latitude: +order.latitude,
                longitude: +order.longitude,
                maxFTS: order.maxFTS,
                penalty_rate: order.penalty_rate,
                reward_rate: order.reward_rate,
                group: order.group,
            },
        });

        const orderId = carrierOrderResult.or_id;

        const cargoOrderData = order.inputs.map((cargoItem: any, _: any) => {
            return {
                order_id: orderId,
                cargo_id: cargoItem.cargo_names,
                load: order.load,
                bulk: +order.burden,
            };
        });

        await prisma.cargo_order.createMany({
            data: cargoOrderData,
        });

        const loadBulkArray = order.bulkArray.map((load_bulk: any) => ({ load_bulk: +load_bulk }));

        await prisma.bulks.createMany({
            data: loadBulkArray.map((load_bulk: any) => ({
                group: order.group,
                cargo_orderOrder_id: orderId,
                ...load_bulk,
            })),
        });

        return res.json({ message: "ok" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const UpdateOrderController = async (req: Request, res: Response) => {
    try {
        const id = +(req.params.id)
        const orders = req.body

        const order = await prisma.carrier_order.update({
            where: { or_id: id },
            data: {
                cr_id: +orders.cr_id,
                category: orders.category,
                maxFTS: orders.maxFTS,
                latitude: +orders.latitude,
                longitude: +orders.longitude,
                arrival_time: orders.arrival_time,
                deadline_time: orders.deadline_time,
                penalty_rate: orders.penalty_rate,
                reward_rate: orders.reward_rate,
            }
        })

        const orderId = order.or_id

        await prisma.cargo_order.updateMany({
            where: { order_id: orderId },
            data: {
                cargo_id: +orders.inputs.cargo_names,
                bulk: +orders.burden,
                load: orders.load,
            },
        })

        const loadBulkArray = orders.bulkArray.map((load_bulk: any) => ({ load_bulk: +load_bulk }))

        const dalete = await prisma.bulks.deleteMany({ where: { cargo_orderOrder_id: orderId } })
        await prisma.bulks.createMany({
            data: loadBulkArray.map((load_bulk: any) => ({
                cargo_orderOrder_id: orderId,
                ...load_bulk,
            })),
        });

        return res.json({ message: "OK" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const DeleteOrderController = async (req: any, res: any) => {
    try {
        const id = parseInt(req.params.id, 10);

        // ลบรายการ cargo_order ที่มี order_id เท่ากับ or_id
        await prisma.cargo_order.deleteMany({
            where: {
                order_id: id
            }
        });

        // ลบรายการ carrier_order โดยอ้างอิง or_id
        const deleteOrder = await prisma.carrier_order.delete({
            where: {
                or_id: id
            }
        });

        res.json({ message: 'OK' });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const UpdateStatusAssign_order = async (req: Request, res: Response) => {
    try {
        const id = +(req.params.id);
        const { ...otherFields } = req.body;

        // สร้าง array เพื่อเก็บ object ที่จะบันทึกลงในฐานข้อมูล
        const recordsToInsert = [];

        // วน loop ตามจำนวนข้อมูลที่ส่งมา
        for (let i = 1; i <= 4; i++) {
            const formattedStartTime = moment(otherFields[`real_start_time${i}`]).format('YYYY-MM-DD HH:mm:ss');
            const record = {
                order_id: id,
                FTS_id: otherFields[`FTS_id${i}`],
                bulk: parseInt(otherFields[`bulk${i}`], 10),
                start_time: formattedStartTime,
                in_active: false
            };

            // เพิ่ม object ลงใน array
            recordsToInsert.push(record);
        }
        await prisma.assign_order.createMany({
            data: recordsToInsert,
        });

        await prisma.carrier_order.update({
            where: { or_id: id },
            data: {
                status_order: "Assign"
            }
        })

        return res.json('hello');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
};

export const UpdateStatusApproved_order = async (req: Request, res: Response) => {
    try {
        const id = +(req.params.id);
        const { ...otherFields } = req.body;

        // สร้าง array เพื่อเก็บ object ที่จะบันทึกลงในฐานข้อมูล
        const recordsToInsert = [];

        // วน loop ตามจำนวนข้อมูลที่ส่งมา
        for (let i = 1; i <= 4; i++) {
            const formattedStartTime = moment(otherFields[`real_start_time${i}`]).format('YYYY-MM-DD HH:mm:ss');
            const formattedStartTime2 = moment(otherFields[`real_end_time${i}`]).format('YYYY-MM-DD HH:mm:ss');
            const record = {
                order_id: id,
                FTS_id: otherFields[`FTS_id${i}`],
                bulk: parseInt(otherFields[`bulk${i}`], 10),
                real_start_time: formattedStartTime,
                real_end_time: formattedStartTime2,
            };

            // เพิ่ม object ลงใน array
            recordsToInsert.push(record);
        }

        // ทำการบันทึกลงในฐานข้อมูล (ในที่นี้คือการใช้ prisma.createMany)
        await prisma.approved_order.createMany({
            data: recordsToInsert,
        });

        await prisma.carrier_order.update({
            where: { or_id: id },
            data: {
                status_order: "Approved"
            }
        })

        return res.json('hello');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
};

export const UpdateStatusOrder = async (req: Request, res: Response) => {
    const id = +(req.params.id);

    try {
        await prisma.$transaction([
            prisma.carrier_order.update({
                where: { or_id: +(id) },
                data: {
                    status_order: "Newer"
                }
            }),
            prisma.assign_order.updateMany({
                where: { order_id: +(id) },
                data: {
                    is_active: true
                }
            }),
            prisma.assign_order.deleteMany({
                where: { order_id: +(id) }
            })
        ]);

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
};

export const statusFTS = async (req: Request, res: Response) => {
    const { craneId, group, bulk, FTS_id, order_id } = req.body
    try {
        const update = await prisma.approved_order.create({
            data: {
                order_id: order_id,
                FTS_id: FTS_id,
                bulk: bulk,
                craneId: craneId,
                group
            }
        })
        return res.json({ "message": "OK" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
};

export const exportCsvOrders = async (req: Request, res: Response) => {
    try {
        const result: any = await prisma.$queryRaw`
        SELECT
          carrier.carrier_name,
          cargo.cargo_name,
          carrier_order.category,
          carrier_order.arrival_time,
          carrier_order.deadline_time,
          carrier_order.latitude,
          carrier_order.longitude,
          carrier_order.maxFTS,
          cargo_order.load,
          cargo_order.bulk,
          carrier_order.penalty_rate,
          carrier_order.reward_rate,
          carrier_order.group,
          bulks.load_bulk,
          bulks.cargo_orderOrder_id,
          orderCount.totalCount
        FROM
          carrier_order
        JOIN cargo_order ON cargo_order.order_id = carrier_order.or_id
        JOIN carrier ON carrier.cr_id = carrier_order.cr_id
        JOIN cargo ON cargo.cargo_id = cargo_order.cargo_id
        LEFT JOIN bulks ON bulks.cargo_orderOrder_id = cargo_order.order_id
        LEFT JOIN (
          SELECT
            cargo_orderOrder_id,
            COUNT(*) as totalCount
          FROM
            bulks
          GROUP BY
            cargo_orderOrder_id
        ) as orderCount ON orderCount.cargo_orderOrder_id = bulks.cargo_orderOrder_id
        GROUP BY
          carrier.carrier_name,
          cargo.cargo_name,
          carrier_order.category,
          carrier_order.arrival_time,
          carrier_order.deadline_time,
          carrier_order.latitude,
          carrier_order.longitude,
          carrier_order.maxFTS,
          cargo_order.load,
          cargo_order.bulk,
          carrier_order.penalty_rate,
          carrier_order.reward_rate,
          carrier_order.group,
          bulks.load_bulk,
          bulks.cargo_orderOrder_id,
          orderCount.totalCount;
      `;

        const formattedResult = result.map((row: any) => {
            const {
                load_bulk,
                cargo_orderOrder_id,
                totalCount,
                ...remainingProperties
            } = row;

            const totalBulks = Array.from(
                { length: Number(totalCount) },
                (_, index) => ({
                    [`bulk${index + 1}`]: load_bulk,
                })
            );

            const bulksObject = totalBulks.reduce(
                (acc, bulk) => ({ ...acc, ...bulk }),
                {}
            );

            return {
                ...remainingProperties,
                ...bulksObject,
            };
        });

        return res.json(formattedResult);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}

export const importCSVOrders = async (req: Request, res: Response) => {
    try {
        const group = req.body.group
        // ตรวจสอบว่ามีไฟล์ถูกอัปโหลดหรือไม่
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const buffer = req.file.buffer;
        const data = buffer.toString("utf-8");
        const dataWithoutBOM = data.replace(/^\uFEFF/, "");

        // แปลง CSV เป็น JSON
        const jsonData: any[] = await new Promise((resolve, reject) => {
            parse(dataWithoutBOM, { columns: true }, (err, records) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(records);
                }
            });
        });

        // console.log(jsonData)
        // res.json(jsonData)
        const carriersInDB = await prisma.carrier.findMany();
        // ตรวจสอบว่าเรือใน JSON มีในฐานข้อมูลหรือไม่
        const createCarriers = [];

        const jsonDataWithCRIDPromises = jsonData.map(async (record) => {
            const carrierName = record.carrier_name;
            const maxFts = record.maxFTS;
            const carrier = carriersInDB.find(
                (dbCarrier) => dbCarrier.carrier_name === carrierName
            );

            if (!carrier) {
                const createdCarrier = await prisma.carrier.create({
                    data: {
                        carrier_name: carrierName,
                        carrier_max_FTS: +maxFts,
                    },
                });

                createCarriers.push(createdCarrier);
                return { ...record, cr_id: createdCarrier.cr_id };
            } else {
                return { ...record, cr_id: carrier.cr_id };
            }
        });

        // รอให้ทุก Promise ถูก resolve
        const jsonDataWithCRID = await Promise.all(jsonDataWithCRIDPromises);

        const cargosInDB = await prisma.cargo.findMany();

        // ตรวจสอบว่า cargo ใน JSON มีในฐานข้อมูลหรือไม่
        const createCargos = [];

        const jsonDataWithCargoIdPromises = jsonDataWithCRID.map(async (record) => {
            const cargoName = record.cargo_name;

            const cargoInDB = cargosInDB.find(
                (dbCargo) => dbCargo.cargo_name === cargoName
            );

            if (!cargoInDB) {
                const createdCargo = await prisma.cargo.create({
                    data: {
                        cargo_name: cargoName,
                    },
                });

                createCargos.push(createdCargo);
                return { ...record, cargo_id: createdCargo.cargo_id };
            } else {
                return { ...record, cargo_id: cargoInDB.cargo_id };
            }
        });

        // // รอให้ทุก Promise ถูก resolve
        const jsonDataWithCargoId = await Promise.all(jsonDataWithCargoIdPromises);

        const jsonDataWithSumBulk = jsonDataWithCargoId.map((record) => {
            const load = Array.from(
                { length: 100 },
                (_, index) => record[`bulk${index + 1}`] || 0
            )
                .map(Number)
                .reduce((acc, val) => acc + val, 0);

            return { ...record, load };
        });


        jsonDataWithSumBulk.forEach(async (record) => {
            const {
                cr_id,
                category,
                arrival_time,
                deadline_time,
                latitude,
                longitude,
                maxFTS,
                penalty_rate,
                reward_rate,
                cargo_id,
                load,
                bulk,
            } = record;

            const arrival_timeV2 = moment(
                arrival_time,
                "DD/MM/YYYY HH:mm:ss"
            ).format("YYYY-MM-DD HH:mm:ss");

            const deadline_timeV2 = moment(
                deadline_time,
                "DD/MM/YYYY HH:mm:ss"
            ).format("YYYY-MM-DD HH:mm:ss");

            const createOrderCarrier = await prisma.carrier_order.create({
                data: {
                    cr_id,
                    category,
                    arrival_time: arrival_timeV2,
                    deadline_time: deadline_timeV2,
                    latitude: +latitude,
                    longitude: +longitude,
                    maxFTS: +maxFTS,
                    penalty_rate: +penalty_rate,
                    reward_rate: +reward_rate,
                    group: +group
                },
            });
            await prisma.cargo_order.create({
                data: {
                    order_id: createOrderCarrier.or_id,
                    cargo_id,
                    bulk: +bulk,
                    load,
                    group: +group
                },
            });

            for (let i = 1; i <= bulk; i++) {
                const bulkKey = `bulk${i}`;
                const bulkValue = record[bulkKey];
                if (bulkValue) {
                    await prisma.bulks.create({
                        data: {
                            cargo_orderOrder_id: createOrderCarrier.or_id,
                            load_bulk: +bulkValue,
                        },
                    });
                }
            }
            await prisma.bulks.updateMany({
                where: { cargo_orderOrder_id: createOrderCarrier.or_id },
                data: {
                    group: +group
                }
            })
        });

        res.json({ message: "OK" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

export const deleteManyOrder = async (req: Request, res: Response) => {
    try {
        const id = +req.params.group
        await prisma.$transaction([
            prisma.bulks.deleteMany({
                where: { group: id }
            }),
            prisma.cargo_order.deleteMany({
                where: { group: id }
            }),
            prisma.carrier_order.deleteMany({
                where: { group: id }
            }),
        ]);

        res.json({ message: "OK" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}