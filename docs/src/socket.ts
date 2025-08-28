import { io, type Socket } from 'socket.io-client';
import type { DefaultEventsMap } from '@socket.io/component-emitter';

export interface ErrorRes {
  status: number;
  message: string;
}

export type AddUser = object;

export interface User {
  userId: string;
  socketId: string;
}

export interface Notification {
  sender: {
    _id: string;
    name: string;
    type: 'user' | 'host' | 'anonymous';
    image: string | undefined;
  };
  message: string;
}

export interface AccordionItem {
  key: number;
  isOpen: boolean;
}

export type EventName = 'addUser' | 'sendMessage' | 'subscribe';
export type EventData = AddUser;

const connectSocket = (
  server: string,
  isAuthenticated: boolean
): {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  addUser: (data: AddUser) => void;
  startConnection: () => void;
  closeConnection: () => void;
} => {
  const socket = io(server, {
    withCredentials: Boolean(isAuthenticated),
    autoConnect: false,
    transports: ['websocket', 'polling'],
  });

  const startConnection = (): void => {
    socket.connect();
  };

  const addUser = (data: AddUser): void => {
    socket.emit('addUser', data);
  };

  const closeConnection = (): void => {
    if (socket.connected) {
      socket.disconnect();
    }
  };

  return {
    socket,
    addUser,
    startConnection,
    closeConnection,
  };
};

export default connectSocket;
