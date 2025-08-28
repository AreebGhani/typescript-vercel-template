/// <reference types="node" />
import type http from 'http';
import { Server, type DefaultEventsMap } from 'socket.io';
/**
 ** Sets up a Socket.IO server with the provided HTTP server.
 * @param {http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>} server - The HTTP server to attach the Socket.IO server to.
 * @returns {Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} The configured Socket.IO server instance.
 */
declare const setupSocketIO: (server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) => Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
export default setupSocketIO;
