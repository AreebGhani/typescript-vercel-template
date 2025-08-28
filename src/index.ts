import type { VercelRequest, VercelResponse } from '@vercel/node';

import server, { app } from '@/server';

/**
 ** Default export handler for Vercel serverless functions.
 * @param req - The incoming Vercel request object.
 * @param res - The outgoing Vercel response object.
 * @remarks
 * This function delegates the request and response handling to the `app` function.
 */
export default (req: VercelRequest, res: VercelResponse): void => {
  app(req, res);
};

/**
 * The entry point of the application.
 * This module exports the server instance.
 * @module index
 */
export const serverInstance = server();
