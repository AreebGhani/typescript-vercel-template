import { StatusCode } from '../constants/index.js';
import { deleteFile } from '../utils/index.js';
/**
 ** A higher-order function that catches asynchronous errors in the provided function and passes them to the next middleware.
 * @param theFunc - The asynchronous function to be wrapped.
 * @returns A function that handles errors by resolving the provided function and catching any errors to pass to the next middleware.
 */
const catchAsyncErrors = (theFunc) => (err, req, res, next) => {
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
const errorMiddleware = catchAsyncErrors(async (err, req, res, next) => {
    const timestamp = new Date().toISOString(); // Add a timestamp to the log
    // eslint-disable-next-line no-console
    console.log(`\n\x1B[31m[Error]\x1B[0m [${timestamp}] ${JSON.stringify({
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
    }, null, 2)}\n`);
    // Check if there are uploaded media files that need to be deleted
    if (req.media !== undefined) {
        // Use Promise.all to wait for all delete operations to finish
        await Promise.all(req.media.map(async (media) => {
            await deleteFile(media.url);
        }));
    }
    err.statusCode = err.statusCode ?? StatusCode.INTERNAL_SERVER_ERROR;
    res.status(err.statusCode).json({
        success: false,
        message: err.message.toLowerCase(),
    });
});
export default errorMiddleware;
//# sourceMappingURL=error.js.map