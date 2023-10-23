import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (_, file, cb) {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: function (_, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `Puppy-${uniqueSuffix}${file.originalname}`);
    }
});

export const upload = multer({ storage: storage }).single('file');
