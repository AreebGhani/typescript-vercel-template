import { type Request, type Response, type NextFunction } from 'express';
/**
 ** Interface representing an application error.
 * Extends the built-in Error object with additional properties.
 * @interface AppError
 * @extends {Error}
 * @property {number} statusCode - Optional HTTP status code associated with the error.
 * @property {number} code - Optional custom error code.
 * @property {string} path - Optional path where the error occurred.
 * @property {Record<string, any>} keyValue - Optional key-value pairs providing additional error details.
 * @property {string} name - Name of the error.
 */
interface AppError extends Error {
    statusCode?: number;
    code?: number;
    path?: string;
    keyValue?: Record<string, any>;
    name: string;
}
/**
 ** Middleware to handle errors in the application.
 * This middleware catches asynchronous errors and processes them accordingly.
 * @param {AppError} err - The error object.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
declare const errorMiddleware: (err: AppError, req: Request, res: Response, next: NextFunction) => void;
export default errorMiddleware;
