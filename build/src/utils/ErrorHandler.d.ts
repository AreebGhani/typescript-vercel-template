import { StatusCode } from '../constants/index.js';
/**
 ** Custom error handler class that extends the built-in Error class.
 * This class includes an additional statusCode and name property to represent HTTP status codes.
 * @extends {Error}
 */
export default class ErrorHandler extends Error {
    statusCode: StatusCode;
    name: string;
    constructor(statusCode: StatusCode, name: string, message: string);
}
/**
 ** Creates an `ErrorHandler` instance for internal server errors.
 * Error handling logic:
 * - **S3ServiceException** (from `@aws-sdk/client-s3`):
 *   - Status code: uses `err.$metadata.httpStatusCode` if available, otherwise defaults to `500`.
 *   - Name: `"Storage Bucket Error"`.
 * - **Nodemailer errors**:
 *   - Detected by checking if `err.code` is a known short Nodemailer error code (`EAUTH`, `ECONNECTION`, `ETLS`, etc.).
 *   - Name: `"Nodemailer Error"`.
 *   - Status code: defaults to `500`.
 * - **MongooseError**:
 *   - Name: `"Mongoose Error"`.
 *   - Status code: defaults to `500`.
 * - **Fallback (other errors)**:
 *   - Name: `"Internal Server Error"`.
 *   - Status code: defaults to `500`.
 *   - Message: uses `err.message` if available (lowercased), otherwise `"an unknown error occurred"`.
 * @param err - The error object to handle. Can be a `StripeError`, `PlaidError`, `S3ServiceException`, `MongooseError`, Nodemailer error, or any other `Error`.
 * @returns An `ErrorHandler` instance representing a normalized internal server error.
 */
export declare const InternalServerError: (err: unknown) => ErrorHandler;
