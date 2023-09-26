import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { ExampleIO } from 'common';

interface GlobalEmit {
  disconnect: () => void;
}

type EmitEvents =
  ExampleIO.ExampleWSEmit
  & GlobalEmit;

type ServerSideEvt = {};

interface SocketData {
  id: number;
}

export type ServerType = Server<{}, EmitEvents, ServerSideEvt, SocketData>;

export type SocketType = Socket<{}, EmitEvents, ServerSideEvt, SocketData>;

const connectedUsers: { [key: number]: SocketType } = {};

export const disconnectFunc = (socket: SocketType) => {
  delete connectedUsers[socket.data.id];
};

let io: ServerType | null = null;

type EndPoint<T extends object> = (socket: SocketType, data: T) => void;
class MiddleWareClass {
  mapper: { [key: string]: MiddleWareClass | EndPoint<any> } = {};

  use<T extends object = {}>(evt: string, fn: MiddleWareClass | EndPoint<T>) {
    const pathLst = evt.split('/').filter((v) => v !== '');
    if (pathLst.length === 0) {
      throw new Error('Event path cannot be empty');
    }
    if (pathLst.length > 1) {
      const path = pathLst[0];
      if (!this.mapper[path]) {
        this.mapper[path] = new MiddleWareClass();
      }
      const fetchFn = this.mapper[path];
      if (fetchFn instanceof MiddleWareClass) {
        fetchFn.use(pathLst.slice(1).join('/'), fn);
      } else {
        throw new Error(`Event ${evt} is already attached with endpoint`);
      }
    }
    if (this.mapper[pathLst[0]]) {
      throw new Error(`Event ${pathLst[0]} is already attached`);
    }
    this.mapper[pathLst[0]] = fn as any;
  }
}

const evtRoot = new MiddleWareClass();

export const ioInit = (httpServer: HTTPServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });
  io.on('connection', (socket) => {
    if (!io) return;

    socket.onAny((event: string, data) => {
      if (typeof event !== 'string') {
        console.log(typeof event, event);
        return;
      }
      const pathLst = event.split('/').filter((v) => v !== '');
      let fetchFn = evtRoot.mapper[pathLst[0]];
      for (let i = 1; i < pathLst.length; i++) {
        if (!fetchFn) {
          break;
        }
        if (typeof fetchFn === 'function') {
          break;
        }
        fetchFn = fetchFn.mapper[pathLst[i]];
      }
      if (typeof fetchFn === 'function') {
        fetchFn(socket, data);
      }
    });

    connectedUsers[socket.data.id] = socket;
    socket.on('disconnect', () => disconnectFunc(socket));
  });
  return evtRoot;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized');
  }
  return io;
};

export const RouterWS = () => new MiddleWareClass();
