import { type Request, type Response, type NextFunction } from 'express';

import { StatusCode } from '@/constants';
import { deleteFile } from '@/utils';

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
 ** Represents an asynchronous function that handles errors in an Express middleware.
 * @typ {AsyncFunction}
 * @param {AppError} err - The error object that was thrown.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<Response<any, Record<string, any>> | undefined> | Promise<void>} A promise that resolves to a response or undefined, or a promise that resolves to void.
 */
type AsyncFunction = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response<any, Record<string, any>> | undefined> | Promise<void>;

/**
 ** A higher-order function that catches asynchronous errors in the provided function and passes them to the next middleware.
 * @param theFunc - The asynchronous function to be wrapped.
 * @returns A function that handles errors by resolving the provided function and catching any errors to pass to the next middleware.
 */
const catchAsyncErrors =
  (theFunc: AsyncFunction) => (err: AppError, req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(theFunc(err, req, res, next)).catch(next);
  };

/**
 ** Middleware to handle errors in the application.
 * This middleware catches asynchronous errors and processes them accordingly.
 * @param {AppError} err - The error object.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
const errorMiddleware = catchAsyncErrors(
  async (err: AppError, req: Request, res: Response, next: NextFunction): Promise<void> => {
    const timestamp = new Date().toISOString(); // Add a timestamp to the log
    // eslint-disable-next-line no-console
    console.log(
      `\n\x1B[31m[Error]\x1B[0m [${timestamp}] ${JSON.stringify(
        {
          status: err.statusCode,
          name: err.name,
          message: err.message,
          request: {
            url: req.originalUrl,
            method: req.method,
            params: req.params,
            query: req.query,
            body: req.body,
            client: {
              ip: req.clientIp,
              proxy: req.ips,
              device: req.device,
              browser: req.browser,
              os: req.os,
            },
          },
        },
        null,
        2
      )}\n`
    );
    // Check if there are uploaded media files that need to be deleted
    if (req.media !== undefined) {
      // Use Promise.all to wait for all delete operations to finish
      await Promise.all(
        req.media.map(async media => {
          await deleteFile(media.url);
        })
      );
    }
    err.statusCode = err.statusCode ?? StatusCode.INTERNAL_SERVER_ERROR;
    res.status(err.statusCode).json({
      success: false,
      message: err.message.toLowerCase(),
    });
  }
);

export default errorMiddleware;
