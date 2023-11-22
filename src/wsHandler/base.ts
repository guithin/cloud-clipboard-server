import { Server as HTTPServer, createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { ClipboardIO } from 'common';

interface GlobalListen {
  disconnect: void;
}

interface GlobalEmit {
  disconnect: () => void;
}

type ListenDatas =
  ClipboardIO.ClipboardWSL
  & GlobalListen;

type ListenEvents = { [K in keyof ListenDatas]: (data: ListenDatas[K]) => void };

type EmitEvents =
  ClipboardIO.ClipboardWSE
  & GlobalEmit;

type ServerSideEvt = {};

interface SocketData {
  id: number;
}

export type ServerType = Server<ListenEvents, EmitEvents, ServerSideEvt, SocketData>;

export type SocketType = Socket<ListenEvents, EmitEvents, ServerSideEvt, SocketData>;

export type WSHandler<T = any> = (io: ServerType, socket: SocketType, data: T) => void;

const connectedUsers: { [key: number]: SocketType } = {};

export const disconnectFunc = (socket: SocketType) => {
  delete connectedUsers[socket.data.id];
};

let io: ServerType | null = null;

interface ListenMapper {
  [key: string]: WSHandler;
}
const listenMapper: ListenMapper = {};

export const ioInit = (httpServer: HTTPServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
    maxHttpBufferSize: 1e8,
  });

  io.on('connection', (socket) => {
    if (!io) return;
    const _io = io;

    socket.onAny((event, data) => {
      const fetchFC = listenMapper[event];
      if (typeof fetchFC !== 'function') return;
      fetchFC(_io, socket, data);
    });

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

export const attachWSHandler = <K extends keyof ListenDatas>(event: K, func: WSHandler<ListenDatas[K]>) => {
  if (listenMapper[event]) {
    throw new Error(`WS handler for ${event} is already attached`);
  }
  listenMapper[event] = func;
};
