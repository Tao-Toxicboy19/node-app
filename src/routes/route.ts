import express from 'express';
import { loginController, registerController } from '../controllers/authController';
import { Request, Response } from "express";
import { auth } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { createPuppyController, deletePuppyController, getPuppyController } from '../controllers/puppyController';


const router = express.Router();

router.post('/register', registerController)
router.post('/login', loginController)

router.post('/puppy', auth, upload, createPuppyController)
router.delete('/puppy/:id', auth, upload, deletePuppyController)
router.get('/puppy', auth, upload, getPuppyController)

router.get('/hello', auth, (req: Request, res: Response) => {
    return res.json({ success: "hello" })
})

export default router