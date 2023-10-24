"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const puppyController_1 = require("../controllers/puppyController");
const router = express_1.default.Router();
router.post('/register', authController_1.registerController);
router.post('/login', authController_1.loginController);
router.post('/puppy', auth_1.auth, upload_1.upload, puppyController_1.createPuppyController);
router.delete('/puppy/:id', auth_1.auth, upload_1.upload, puppyController_1.deletePuppyController);
router.get('/puppy', auth_1.auth, upload_1.upload, puppyController_1.getPuppyController);
router.put('/puppy/:id', auth_1.auth, upload_1.upload, puppyController_1.updatedPuppyController);
router.get('/puppy/:id', auth_1.auth, upload_1.upload, puppyController_1.getPuppyByIdController);
router.get('/hello', auth_1.auth, (res) => {
    return res.json({ success: "hello" });
});
exports.default = router;
