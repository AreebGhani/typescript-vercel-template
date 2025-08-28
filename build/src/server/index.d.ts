/// <reference types="node" />
import type http from 'http';
import { type Server, type DefaultEventsMap } from 'socket.io';
/**
 * The main Express application instance.
 * Use this to configure middleware, routes, and other server settings.
 */
export declare const app: import("express-serve-static-core").Express;
/**
 ** Starts the server and sets up the necessary configurations.
 * @returns An object containing the HTTP server and the Socket.IO server.
 * @property {http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>} http - The HTTP server instance.
 * @property {Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} io - The Socket.IO server instance.
 * @remarks
 * - Sets up the Express application and HTTP server.
 * - Configures and starts the Socket.IO server.
 * - Logs system information and server details upon successful startup.
 * - Handles uncaught exceptions and unhandled promise rejections by shutting down the server gracefully.
 * - Uses custom error handling middleware.
 */
declare const startServer: () => Promise<{
    http: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
}>;
export default startServer;
