import { type Request, type Response, type NextFunction } from 'express';

/**
 ** Represents an asynchronous function used in middleware that handles
 * HTTP requests and responses.
 * @type {AsyncFunction}
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<Response<any, Record<string, any>> | undefined> | Promise<void>} A promise that resolves to a response or undefined, or a promise that resolves to void.
 */
type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response<any, Record<string, any>> | undefined> | Promise<void>;

/**
 ** A higher-order function that wraps an asynchronous function and catches any errors,
 * passing them to the next middleware (error handler).
 * @param theFunc - The asynchronous function to be wrapped.
 * @returns A function that executes the asynchronous function and catches any errors.
 * @example
 * const asyncHandler = catchAsyncErrors(async (req, res, next) => {
 *   const data = await someAsyncOperation();
 *   res.json(data);
 * });
 */
const catchAsyncErrors =
  (theFunc: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => {
    // Execute the async function and catch any errors to pass to the error handler
    Promise.resolve(theFunc(req, res, next)).catch(next);
  };

export default catchAsyncErrors;
