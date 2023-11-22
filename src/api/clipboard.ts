import { Router } from 'express';
import makeRouter from './makeRouter';
import { ClipboardIO } from 'common';
import redis from 'src/util/redis';

const router = makeRouter(Router());

router.get<ClipboardIO.EnterRoom>('/enter-room', async (req, res) => {
  const { bucket } = req.query;
  const ret = await redis.lRange(`chat:${bucket}`, 0, -1);
  res.send(ret.map((i) => JSON.parse(i)));
});

export default router;
