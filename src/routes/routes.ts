import express from 'express';
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { getFts, postFts } from '../controllers/fts.controller';
import { getCrane } from '../controllers/crane.controller';
import { postCargo } from '../controllers/cargo.controller';
import { getCargoCrane, postCargoCrane } from '../controllers/cargo_cranes.controller';
import { register } from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', register)

router.post('/fts', postFts)
router.get('/fts', getFts)

router.get('/crane', getCrane)

router.post('/cargo', postCargo)

router.get('/cargo-cranes', getCargoCrane)
router.post('/cargo-cranes', postCargoCrane);

export default router