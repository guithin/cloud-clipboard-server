import { attachWSHandler } from './base';
import redis from 'src/util/redis';

const machineIdx = 1;

attachWSHandler('MsgArrive', async (io, socket, data) => {
  const { bucket, msg } = data;
  const idx = await redis.incr(`curIdx:${machineIdx}`);
  const id: `${number}-${number}` = `${machineIdx}-${idx}`;
  await redis.lPush(`chat:${bucket}`, JSON.stringify({
    id,
    bucket,
    msg,
  }));
  const [room] = [...socket.rooms];
  io.to(room).emit('SendMsg', {
    id,
    bucket,
    msg: {
      type: 'text',
      content: msg.type === 'text' ? msg.content : 'hello is file',
    },
  });
});

attachWSHandler('EnterRoom', (io, socket, data) => {
  const { bucket } = data;
  console.log('EnterRoom', bucket, socket.id);
  socket.join(bucket);
});

attachWSHandler('LeaveRoom', (io, socket) => {
  socket.rooms.forEach((bucket) => socket.leave(bucket));
});
