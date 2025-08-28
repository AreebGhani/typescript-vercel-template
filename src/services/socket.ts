import type http from 'http';
import { URL } from 'url';

import { Server, type Socket, type DefaultEventsMap } from 'socket.io';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import requestIp from 'request-ip';
import { UAParser } from 'ua-parser-js';

import env from '@/config';
import { StatusCode } from '@/constants';
import { InternalServerError } from '@/utils';
import db from '@/mongodb';

/**
 ** Sets up a Socket.IO server with the provided HTTP server.
 * @param {http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>} server - The HTTP server to attach the Socket.IO server to.
 * @returns {Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} The configured Socket.IO server instance.
 */
const setupSocketIO = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
): Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> => {
  /**
   ** Represents a user connected via a socket.
   * @interface User
   * @property {string} userId - The unique identifier for the user.
   * @property {string} socketId - The unique identifier for the user's socket connection.
   */
  interface User {
    userId: string;
    socketId: string;
  }

  /**
   ** Represents an asynchronous function for a socket connection.
   * @callback AsyncFunction
   * @param {Socket} socket - The socket instance to which the middleware is applied.
   * @param {Function} next - A callback function to be called once the middleware processing is complete.
   * @returns {Promise<void>} A promise that resolves when the middleware processing is complete.
   */
  type AsyncFunction = (socket: Socket, next: (err?: Error) => void) => Promise<void>;

  /**
   ** A higher-order function that catches asynchronous errors in socket event handlers.
   * @param theFunc - The asynchronous function to be wrapped.
   * @returns A function that takes a socket and a next callback, and handles any errors thrown by the asynchronous function.
   * @example
   * const asyncHandler = async (socket: Socket, next: (err?: Error) => void) => {
   *   const data = await someAsyncOperation();
   *   socket.emit('data', { data });
   * };
   */
  const catchAsyncErrors =
    (theFunc: AsyncFunction) => (socket: Socket, next: (err?: Error) => void) => {
      Promise.resolve(theFunc(socket, next)).catch(err => {
        next(err);
      });
    };

  /**
   ** Logs socket-related errors with detailed request and client information.
   * @param socket - The Socket.IO socket instance containing request and client information
   * @param status - HTTP status code or custom error code to log
   * @param message - Descriptive error message explaining what went wrong
   */
  const logError = (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    status: number,
    message: string
  ): void => {
    const req = socket.request;
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const pathname = url.pathname;
    const query = Object.fromEntries(url.searchParams.entries());
    // eslint-disable-next-line no-console
    console.log(
      `\n\x1B[31m[Error]\x1B[0m [${new Date().toISOString()}] ${JSON.stringify(
        {
          status,
          name: 'Socket Error',
          message,
          request: {
            url: pathname,
            method: socket.request.method,
            params: {},
            query,
            body: {},
            client: {
              ip: socket.clientIp,
              proxy: socket.proxy,
              device: socket.device,
              browser: socket.browser,
              os: socket.os,
            },
          },
        },
        null,
        2
      )}\n`
    );
  };

  // Define an array to store online users
  let users: User[] = [];

  // Define functions to add users
  const addUser = (userId: string, socketId: string): void => {
    if (!users.some(user => user.socketId === socketId)) {
      users.push({ userId, socketId });
    }
  };

  // Define a function to remove users
  const removeUser = (socketId: string): void => {
    users = users.filter(user => user.socketId !== socketId);
  };

  // Define a function to get a user
  const getUser = (userId: string): User | undefined => users.find(user => user.userId === userId);

  // Socket Server
  const io = new Server(server, {
    cors: {
      origin: env.ORIGINS.split(','), // Allow requests from these frontend URLs
      methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE', // Allow specific request methods
      credentials: true, // Allow cookies to be sent with WebSocket requests
    },
  });

  io.use(
    catchAsyncErrors(async (socket, next) => {
      try {
        const req = socket.request;
        const clientIp = requestIp.getClientIp(req);
        const forwardedIps = req.headers['x-forwarded-for']?.toString() || '';
        const userAgent = req.headers['user-agent'] || '';
        const { device, browser, os } = new UAParser(userAgent).getResult();
        socket.clientIp = clientIp || '';
        socket.proxy = forwardedIps.split(',').map(ip => ip.trim());
        socket.device = device;
        socket.browser = browser;
        socket.os = os;
        next();
      } catch (err) {
        const { statusCode, message } = InternalServerError(err);
        io.to(socket.id).emit('eventError', {
          status: statusCode,
          message,
        });
        logError(socket, statusCode, message);
      }
    })
  );

  // Anonymous namespace (No authentication required)
  const anonymousNamespace = io.of('/anonymous');

  anonymousNamespace.on('connection', socket => {
    socket.on('addUser', async () => {
      try {
        addUser(String(Date.now()), socket.id);
        io.emit('getUsers', users);
        anonymousNamespace.emit('getUsers', users);
      } catch (err) {
        const { statusCode, message } = InternalServerError(err);
        anonymousNamespace.to(socket.id).emit('eventError', {
          status: statusCode,
          message,
        });
        logError(socket, statusCode, message);
      }
    });

    // when disconnect
    socket.on('disconnect', () => {
      removeUser(socket.id);
      io.emit('getUsers', users);
      anonymousNamespace.emit('getUsers', users);
    });
  });

  io.use(
    catchAsyncErrors(async (socket, next) => {
      try {
        const cookies = socket.handshake.headers.cookie;
        if (cookies === undefined || cookies === null || cookies === '') {
          io.to(socket.id).emit('eventError', {
            status: StatusCode.UNAUTHORIZED,
            message: 'please login to continue',
          });
          logError(socket, StatusCode.UNAUTHORIZED, 'please login to continue');
          return;
        }
        const parsedCookies = cookie.parse(cookies);
        const token = parsedCookies.token;
        if (token === undefined || token === null || token === '') {
          io.to(socket.id).emit('eventError', {
            status: StatusCode.UNAUTHORIZED,
            message: 'please login to continue',
          });
          logError(socket, StatusCode.UNAUTHORIZED, 'please login to continue');
          return;
        }
        const decoded = jwt.verify(token, env.JWT_SECRET_KEY) as { id: string };
        const userExist = await db.User.findById(decoded.id);
        if (userExist === null) {
          io.to(socket.id).emit('eventError', {
            status: StatusCode.NOT_FOUND,
            message: 'user not found',
          });
          logError(socket, StatusCode.NOT_FOUND, 'user not found');
          return;
        }
        if (userExist.isDeleted) {
          io.to(socket.id).emit('eventError', {
            status: StatusCode.FORBIDDEN,
            message:
              'your account has been permanently deleted. all associated data will be removed from our servers within 30 working days',
          });
          logError(
            socket,
            StatusCode.FORBIDDEN,
            'your account has been permanently deleted. all associated data will be removed from our servers within 30 working days'
          );
          return;
        }
        if (userExist.status !== 'active') {
          io.to(socket.id).emit('eventError', {
            status: StatusCode.FORBIDDEN,
            message: `${userExist.role} account is currently inactive. please contact support for assistance`,
          });
          logError(
            socket,
            StatusCode.FORBIDDEN,
            `${userExist.role} account is currently inactive. please contact support for assistance`
          );
          return;
        }
        // Attach user info to socket object and proceed
        socket.user = userExist;
        next();
      } catch (err) {
        const { statusCode, message } = InternalServerError(err);
        io.to(socket.id).emit('eventError', {
          status: statusCode,
          message,
        });
        logError(socket, statusCode, message);
      }
    })
  );

  io.on('connection', socket => {
    socket.on('addUser', async (data?: { conversationId?: string }) => {
      try {
        if (socket.user === undefined) {
          io.to(socket.id).emit('eventError', {
            status: StatusCode.NOT_FOUND,
            message: 'user not found',
          });
          logError(socket, StatusCode.NOT_FOUND, 'user not found');
          return;
        }
        addUser(socket.user.id, socket.id);
        getUser(socket.user.id);
        io.emit('getUsers', users);
        anonymousNamespace.emit('getUsers', users);
      } catch (err) {
        const { statusCode, message } = InternalServerError(err);
        io.to(socket.id).emit('eventError', {
          status: statusCode,
          message,
        });
        logError(socket, statusCode, message);
      }
    });

    // when disconnect
    socket.on('disconnect', () => {
      removeUser(socket.id);
      io.emit('getUsers', users);
      anonymousNamespace.emit('getUsers', users);
    });
  });

  return io;
};

export default setupSocketIO;
