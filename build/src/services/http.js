import http from 'http';
import path from 'path';
import express from 'express';
import env from '../config/index.js';
import setupWebhooks from '../hooks/index.js';
import { applyMiddlewares, cors } from '../middlewares/index.js';
import routes from '../routes/index.js';
import db from '../mongodb/index.js';
import { StatusCode, ApiPath } from '../constants/index.js';
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
const setupHttpServer = (app) => {
    // Connect to the database
    db.connect();
    // Apply middlewares
    applyMiddlewares(app);
    // Stripe Webhooks
    setupWebhooks(app);
    // Enable Cross-Origin Resource Sharing (CORS)
    app.use(cors.restricted());
    const urls = {
        api: `${env.PUBLIC_URL}/api/v${env.API_VERSION}/`,
        docs: `${env.PUBLIC_URL}/api/v${env.API_VERSION}/docs`,
        ws: `${env.PUBLIC_URL.replace(/^http/, 'ws')}/api/v${env.API_VERSION}/`,
    };
    // Test the connection
    app.get('/', (req, res) => {
        res.status(StatusCode.OK).json({ success: true, urls });
    });
    // Static files
    app.use('/', express.static(path.join(path.resolve(), '/public'), {
        setHeaders: res => res.setHeader('Cache-Control', 'public, max-age=86400'), // Cache for 1 day
    }));
    // Define API routes
    app.use(ApiPath.Base, routes);
    // Catch-all for unknown API routes
    app.use((req, res) => {
        res.status(StatusCode.NOT_FOUND).json({ success: false, urls });
    });
    // Create Http Server
    const server = http.createServer(app);
    return server;
};
export default setupHttpServer;
//# sourceMappingURL=http.js.map