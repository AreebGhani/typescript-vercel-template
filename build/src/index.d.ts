/// <reference types="node" />
import type { VercelRequest, VercelResponse } from '@vercel/node';
/**
 ** Default export handler for Vercel serverless functions.
 * @param req - The incoming Vercel request object.
 * @param res - The outgoing Vercel response object.
 * @remarks
 * This function delegates the request and response handling to the `app` function.
 */
declare const _default: (req: VercelRequest, res: VercelResponse) => void;
export default _default;
/**
 * The entry point of the application.
 * This module exports the server instance.
 * @module index
 */
export declare const serverInstance: Promise<{
    http: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
    io: import("socket.io").Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
}>;
