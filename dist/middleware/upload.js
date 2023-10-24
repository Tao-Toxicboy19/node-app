"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (_, file, cb) {
        cb(null, path_1.default.join(__dirname, "../uploads"));
    },
    filename: function (_, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `Puppy-${uniqueSuffix}${file.originalname}`);
    }
});
exports.upload = (0, multer_1.default)({ storage: storage }).single('file');
