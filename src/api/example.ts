import { attachWSHandler } from 'src/util/wsHelper';

attachWSHandler('ExampleWSL', (io, socket, data) => {
  console.log(data);
  socket.emit('ExampleWSE', ({ ids: [1, 2, 3, data.id] }))
});
