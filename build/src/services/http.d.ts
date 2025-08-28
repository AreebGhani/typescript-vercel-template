/// <reference types="node" />
import http from 'http';
import { type Express } from 'express';
/**
 ** Sets up the HTTP server with the provided Express application.
 * This function performs the following tasks:
 * - Connects to the database.
 * - Sets up webhooks.
 * - Applies middlewares to the Express application.
 * - Defines a test route to check server status.
 * - Serves static files from the 'public' directory.
 * - Defines API routes.
 * - Creates and returns an HTTP server instance.
 * @param app - The Express application instance.
 * @returns The created HTTP server instance.
 */
declare const setupHttpServer: (app: Express) => http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
export default setupHttpServer;
