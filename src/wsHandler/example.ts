import { attachWSHandler } from './base';

attachWSHandler('ExampleWSL', (io, socket, data) => {
  console.log(data);
  socket.emit('ExampleWSE', ({ ids: [1, 2, 3, data.id] }))
});

attachWSHandler('EnterRoom', (io, socket, data) => {
  socket.join(data.roomId);
  console.log(socket.rooms.keys());
  console.log(io.sockets.adapter.rooms.keys());
});
