import { Request, Response } from "express";
import moment from 'moment';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const crane_solutionV2 = async (req: Request, res: Response) => {
    try {
        const resutl = await prisma.$queryRaw`
        SELECT * FROM crane_solution 
        `

        return res.json(resutl)

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}


// export const solution_schedule = (req: Request, res: Response) => {
//     const { id } = req.params
//     const sql = `
//     SELECT
//         solution_schedule.lat,
//         solution_schedule.lng,
//         carrier.carrier_name,
//         arrivaltime,
//         exittime,
//         operation_time,
//         operation_rate,
//         Setup_time,
//         travel_Distance,
//         travel_time,
//         fts.FTS_name
//     FROM
//         solution_schedule
//     LEFT JOIN fts ON solution_schedule.FTS_id = fts.id
//     LEFT JOIN carrier ON solution_schedule.carrier_id = carrier.cr_id

//     WHERE solution_schedule.FTS_id = ?

//     `;

//     connection.query(sql, [id], (err, result) => {
//         if (err) {
//             return res.json({ Message: `Error in Node ${err}` });
//         }
//         const formattedResult = result.map((item) => ({
//             ...item,
//             arrivaltime: new Date(item.arrivaltime).toLocaleString(),
//             exittime: new Date(item.exittime).toLocaleString(),
//         }));

//         return res.json(formattedResult);
//     });
// }


export const solution_schedule = async (req: Request, res: Response) => {
    // const sql = `
    // SELECT
    //     solution_schedule.*,
    //     fts.FTS_name,
    //     carrier.*
    // FROM
    //     solution_schedule
    // LEFT JOIN fts ON solution_schedule.FTS_id = fts.id
    // LEFT JOIN carrier ON solution_schedule.carrier_id = carrier.cr_id
    // `;
    const result: any = await prisma.$queryRaw`
        SELECT
            solution_schedule.*,
            fts.FTS_name,
            carrier.*
        FROM
            solution_schedule
        LEFT JOIN fts ON solution_schedule.FTS_id = fts.id
        LEFT JOIN carrier ON solution_schedule.carrier_id = carrier.cr_id
    `
    const formattedResult = result.map((item: any) => ({
        ...item,
        arrivaltime: new Date(item.arrivaltime).toLocaleString(),
        exittime: new Date(item.exittime).toLocaleString(),
    }));

    return res.json(formattedResult);
    // connection.query(sql, (err, result) => {
    //     if (err) {
    //         return res.json({ Message: `Error in Node ${err}` });
    //     }
    //     const formattedResult = result.map((item) => ({
    //         ...item,
    //         arrivaltime: new Date(item.arrivaltime).toLocaleString(),
    //         exittime: new Date(item.exittime).toLocaleString(),
    //     }));

    //     return res.json(formattedResult);
    // });
}



export const report_solution = async (req: Request, res: Response) => {
    // const sql = `
    // SELECT
    //     *
    // FROM
    //     solution_schedule
    // JOIN carrier_order ON carrier_order.cr_id = solution_schedule.carrier_id
    // JOIN cargo_order ON carrier_order.or_id = cargo_order.order_id
    // JOIN cargo ON cargo_order.cargo_id = cargo.cargo_id
    // JOIN carrier ON solution_schedule.carrier_id = carrier.cr_id
    // JOIN fts ON solution_schedule.FTS_id = fts.id;
    // `;

    const result: any = await prisma.$queryRaw`
        SELECT
            *
        FROM
            solution_schedule
        JOIN carrier_order ON carrier_order.cr_id = solution_schedule.carrier_id
        JOIN cargo_order ON carrier_order.or_id = cargo_order.order_id
        JOIN cargo ON cargo_order.cargo_id = cargo.cargo_id
        JOIN carrier ON solution_schedule.carrier_id = carrier.cr_id
        JOIN fts ON solution_schedule.FTS_id = fts.id;
    `

    return res.json(result);
    // connection.query(sql, (err, result) => {
    //     if (err) {
    //         return res.json({ Message: `Error in Node ${err}` });
    //     }
    //     return res.json(result);
    // });
}

export const report_solution_crane = async (req: Request, res: Response) => {
    // const sql = `
    // SELECT
    //     *
    // FROM
    //     solution_crane_schedule
    // JOIN carrier ON solution_crane_schedule.carrier_id = carrier.cr_id
    // JOIN crane ON solution_crane_schedule.crane_id = crane.id
    // JOIN fts ON crane.FTS_id = fts.id
    // JOIN cargo ON solution_crane_schedule.cargo_id = cargo.cargo_id
    // `;

    const result: any = await prisma.$queryRaw`
        SELECT
            *
        FROM
            solution_crane_schedule
        JOIN carrier ON solution_crane_schedule.carrier_id = carrier.cr_id
        JOIN crane ON solution_crane_schedule.crane_id = crane.id
        JOIN fts ON crane.FTS_id = fts.id
        JOIN cargo ON solution_crane_schedule.cargo_id = cargo.cargo_id
    `
    const formattedResult = result.map((row: any) => {
        return {
            ...row,
            start_time: moment(row.start_time).format('YYYY-MM-DD HH:mm:ss'),
            due_time: moment(row.due_time).format('YYYY-MM-DD HH:mm:ss'),
        };
    });

    return res.json(formattedResult);

    // connection.query(sql, (err, result) => {
    //     if (err) {
    //         return res.json({ Message: `Error in Node ${err}` });
    //     }

    //     const formattedResult = result.map(row => {
    //         return {
    //             ...row,
    //             start_time: moment(row.start_time).format('YYYY-MM-DD HH:mm:ss'),
    //             due_time: moment(row.due_time).format('YYYY-MM-DD HH:mm:ss'),
    //         };
    //     });

    //     return res.json(formattedResult);
    // });
}

export const solution_carrier_order = async (req: Request, res: Response) => {
    // const sql = `
    // SELECT
    //     *
    // FROM
    //     solution_carrier_order
    // JOIN carrier_order ON solution_carrier_order.order_id = carrier_order.or_id
    // JOIN carrier ON carrier_order.or_id = carrier.cr_id
    // `;

    const result: any = await prisma.$queryRaw`
        SELECT
            *
        FROM
            solution_carrier_order
        JOIN carrier_order ON solution_carrier_order.order_id = carrier_order.or_id
        JOIN carrier ON carrier_order.cr_id = carrier.cr_id

    --    SELECT
    --         *
    --     FROM
    --         solution_carrier_order
    --     JOIN carrier_order ON solution_carrier_order.order_id = carrier_order.or_id
    --     JOIN carrier ON carrier_order.or_id = carrier.cr_id
    `
    return res.json(result);

    // connection.query(sql, (err, result) => {
    //     if (err) {
    //         return res.json({ Message: `Error in Node ${err}` });
    //     }
    //     return res.json(result);
    // });
}


export const solution_carrier_orderSum = async (req: Request, res: Response) => {
    try {
        const solution_carrier_order = await prisma.solution_carrier_order.findMany({
            select: {
                s_id: true,
                order_id: true,
                penalty_cost: true,
                reward: true,
            },
        });

        return res.json(solution_carrier_order);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
    }
}


