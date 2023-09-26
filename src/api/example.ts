import { attachListenEvt } from 'src/util/wsHelper';

attachListenEvt('ExampleWSL', (socket, data) => {
  console.log(data);
  socket.emit('ExampleWSE', { ids: [1, 2, data.id] });
});
