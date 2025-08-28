import { S3ServiceException } from '@aws-sdk/client-s3';

import db from '@/mongodb';
import { StatusCode } from '@/constants';
import { MailErrorCodes } from './sendMail';

/**
 ** Custom error handler class that extends the built-in Error class.
 * This class includes an additional statusCode and name property to represent HTTP status codes.
 * @extends {Error}
 */
export default class ErrorHandler extends Error {
  public statusCode: StatusCode;
  public name: string;
  constructor(statusCode: StatusCode, name: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
    Object.setPrototypeOf(this, ErrorHandler.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
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
export const InternalServerError = (err: unknown): ErrorHandler =>
  new ErrorHandler(
    // Status code
    err instanceof S3ServiceException
      ? err.$metadata?.httpStatusCode || StatusCode.INTERNAL_SERVER_ERROR
      : StatusCode.INTERNAL_SERVER_ERROR,

    // Error name
    err instanceof S3ServiceException
      ? 'Storage Bucket Error'
      : (err as any)?.code &&
          typeof (err as any).code === 'string' &&
          MailErrorCodes.includes((err as any)?.code?.toUpperCase())
        ? 'Nodemailer Error'
        : err instanceof db.MongooseError
          ? 'Mongoose Error'
          : 'Internal Server Error',

    // Error message
    err instanceof Error ? err.message.toLowerCase() : 'an unknown error occurred'
  );
