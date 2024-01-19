import express from "express";
import multer from "multer";
import { RootController } from "../controllers/RootController";
import { DeleteFTSController, GetByIdFTS, GetFTSController, PostFTSController, UpdateFTSController } from "../controllers/FTS.controller";
import { DeleteCarrierController, GetCarrierController, GetbyIdCarrier, PostCarrierController, PutCarrierController } from "../controllers/CarrierController";
import { DeleteCargoController, GetCargoController, GetbyId, PostCargoController, UpdateCargoController } from "../controllers/CargoController";
import { DeleteOrderController, GetOrderController, PostOrderController, UpdateOrderController, UpdateStatusApproved_order, UpdateStatusAssign_order, UpdateStatusOrder, deleteManyOrder, exportCsvOrders, getSignOrder, importCSVOrders, statusFTS } from "../controllers/OrdersController";
import { DeleteCargoCraneController, GetCargoCranesController, GetbyIdCargoCrane, PostCargoCraneController, PutCargoCraneController, } from "../controllers/Cranecargo.controller";
import { report_solution, report_solution_crane, solution_carrier_order, solution_carrier_orderSum, solution_schedule } from "../controllers/solution_schedule.controller";
import { getLastCargoOrderIdController, postCargoOrderController, putCargoOrderController } from "../controllers/CargoOrder.controller";
import { deleteMainTainCrane, deleteMainTainFTS, getMainTainCrane, getMainTainCraneById, getMainTainFTS, getMainTainFTSById, postMainTainCrane, postMainTainFTS, putMainTainFTS } from "../controllers/maintainCraneController";
import { auth } from "../middleware/auth";
import { Register, Login, GrantPermissions, findAllUser, roles } from "../controllers/authController";
import { GetCrane, createCrane, UpdateCrane, GetByIdCrane, CraneDelete } from "../controllers/crane.controller";
import { cranesolution, FtsSolutionSigle, ftssolution, cranesolutiontable, crane_solution_v2 } from "../controllers/solution.controller";

export const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", RootController);
router.post("/register", Register)
router.post("/login", Login);

router.patch('/user/:id', auth, GrantPermissions)
router.get("/userall", auth, findAllUser);
router.post('/roles', auth, roles);

router.get("/floating", GetFTSController);
router.get("/floating/:id", GetByIdFTS);
router.post("/floating", PostFTSController);
router.put("/floating/:id", UpdateFTSController);
router.delete("/floating/:id", DeleteFTSController);

router.get('/crane', GetCrane);
router.post('/crane', createCrane);
router.put('/crane/:id', UpdateCrane);
router.get('/crane/:id', GetByIdCrane);
router.delete('/crane/:id', CraneDelete)

router.get("/cargocrane", GetCargoCranesController);
router.get("/cargocrane/:id", GetbyIdCargoCrane);
router.post("/cargocrane", PostCargoCraneController);
router.put("/cargocrane/:id", PutCargoCraneController);
router.delete("/cargocrane/:id", DeleteCargoCraneController);

router.get("/carrier", GetCarrierController);
router.post("/carrier", PostCarrierController);
router.get("/carrier/:id", GetbyIdCarrier);
router.put("/carrier/:id", PutCarrierController);
router.delete("/carrier/:id", DeleteCarrierController);

router.get("/cargo", GetCargoController);
router.get("/cargo/:id", GetbyId);
router.post("/cargo", PostCargoController);
router.put("/cargo/:id", UpdateCargoController);
router.delete("/cargo/:id", DeleteCargoController);

router.post('/cargoorder', postCargoOrderController)
router.get('/cargoorder', getLastCargoOrderIdController)
router.put('/cargoorder/:id', putCargoOrderController)

router.get("/order", GetOrderController);
router.get("/order/:id", getSignOrder);
router.post("/order", PostOrderController);
router.patch("/order/:id", UpdateOrderController);
router.delete("/order/:id", DeleteOrderController);

router.get('/cranesolution', cranesolution)
router.get('/fts-solution-sigle', FtsSolutionSigle)
router.get('/ftssolution', ftssolution)

router.get('/cranesolutiontable', cranesolutiontable)
router.get('/cranesolutiontableV2', crane_solution_v2)

router.get('/report_solution', report_solution)
router.get('/report_solution_crane', report_solution_crane)

router.get('/solution_schedule', solution_schedule)

router.get('/solution_carrier_order_sum', solution_carrier_orderSum)
router.get('/solution_carrier_order', solution_carrier_order)

router.get('/maintain_crane', getMainTainCrane)
router.get('/maintain_crane/:id', getMainTainCraneById)
router.post('/maintain_crane', postMainTainCrane)
router.delete('/maintain_crane/:id', deleteMainTainCrane)

router.get('/maintain_fts', getMainTainFTS)
router.put('/maintain_fts/:id', putMainTainFTS)
router.get('/maintain_fts/:id', getMainTainFTSById)
router.post('/maintain_fts', postMainTainFTS)
router.delete('/maintain_fts/:id', deleteMainTainFTS)

router.patch('/updatestatus/:id', UpdateStatusAssign_order)
router.patch('/updatestatus-approved/:id', UpdateStatusApproved_order)
router.patch('/update-status-order/:id', UpdateStatusOrder)
router.patch('/update-statusFTS-order', statusFTS)

router.delete('/exportorder/:group', deleteManyOrder)
router.get('/exportorder', exportCsvOrders)
router.post('/importcsv', upload.single("file"), importCSVOrders)

export default router;
