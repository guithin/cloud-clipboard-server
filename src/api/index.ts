import { Router } from 'express';
import example from './example';
import storage from './storage';
import auth from './auth';
import clipboard from './clipboard';

const router = Router();

router.use('/example', example);
router.use('/storage', storage.realRouter);
router.use('/auth', auth.realRouter);
router.use('/clipboard', clipboard.realRouter);

export default router;
