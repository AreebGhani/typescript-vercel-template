import server, { app } from './server/index.js';
/**
 ** Default export handler for Vercel serverless functions.
 * @param req - The incoming Vercel request object.
 * @param res - The outgoing Vercel response object.
 * @remarks
 * This function delegates the request and response handling to the `app` function.
 */
export default (req, res) => {
    app(req, res);
};
/**
 * The entry point of the application.
 * This module exports the server instance.
 * @module index
 */
export const serverInstance = server();
//# sourceMappingURL=index.js.map