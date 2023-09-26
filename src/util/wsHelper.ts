import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { ExampleIO } from 'common';

interface GlobalListen {
  disconnect: undefined;
}

interface GlobalEmit {
  disconnect: () => void;
}

type ListenDatas =
  ExampleIO.ExampleWSListen
  & GlobalListen;

type EmitEvents =
  ExampleIO.ExampleWSEmit
  & GlobalEmit;

type ServerSideEvt = {};

interface SocketData {
  id: number;
}

type ListenEvents = { [K in keyof ListenDatas]: (data: ListenDatas[K]) => void };

export type ServerType = Server<ListenEvents, EmitEvents, ServerSideEvt, SocketData>;

export type SocketType = Socket<ListenEvents, EmitEvents, ServerSideEvt, SocketData>;

const connectedUsers: { [key: number]: SocketType } = {};

export const disconnectFunc = (socket: SocketType) => {
  delete connectedUsers[socket.data.id];
};

let io: ServerType | null = null;

const listenEvts: {
  [K in keyof ListenEvents]?: (socket: SocketType, data: ListenDatas[K]) => void;
} = {};

export const ioInit = (httpServer: HTTPServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });
  io.on('connection', (socket) => {

    // @ts-ignore
    // 논리상 자명하지만, typescript문법에 맞게 하려면 일일이 매핑해야함
    Object.entries(listenEvts).forEach(([key, func]) => socket.on(key, (data) => func(socket, data)));

    connectedUsers[socket.data.id] = socket;
    socket.on('disconnect', () => disconnectFunc(socket));
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized');
  }
  return io;
};

export const attachListenEvt = <K extends keyof ListenEvents>(evt: K, func: (socket: SocketType, data: ListenDatas[K]) => void) => {
  if (listenEvts[evt]) {
    throw new Error(`Event ${evt} is already attached`);
  }
  listenEvts[evt] = func as any;
};
