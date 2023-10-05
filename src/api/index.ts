import { Router } from 'express';
import example from './example';
import storage from './storage';

const router = Router();

router.use('/example', example);
router.use('/drive', storage.realRouter);

export default router;
