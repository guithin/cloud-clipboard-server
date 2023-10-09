import { Router } from 'express';
import example from './example';
import storage from './storage';
import auth from './auth';

const router = Router();

router.use('/example', example);
router.use('/storage', storage.realRouter);
router.use('/auth', auth.realRouter);

export default router;
