import { Router } from 'express';
import { getIO } from 'src/wsHandler';

const router = Router();

router.get('/', (req, res) => {
  const io = getIO();
  const ret = Array.from(io.sockets.adapter.rooms.keys());
  res.send(ret);
});

router.get('/room/:roomId', (req, res) => {
  const io = getIO();
  const room = io.sockets.adapter.rooms.get(req.params.roomId);
  if (!room) {
    return res.send('no room');
  }
  const ret = Array.from(room.keys());
  res.send(ret);
});

export default router;
