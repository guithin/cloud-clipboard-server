import { ExampleIO } from 'common/index';
import { RouterWS, getIO } from 'src/util/wsHelper';

const routerWS = RouterWS();

routerWS.use<ExampleIO.ExampleWSL>('ping', (socket, data) => {
  const io = getIO();
  socket.join('temp1');
  io.to('temp1').emit('ExampleWSE', { ids: [1, 2, data.id] });
});

export default routerWS;
