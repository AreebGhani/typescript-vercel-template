import { type Response } from 'express';
import type { Types } from '../mongodb/index.js';
/**
 ** Sends a JWT token as a cookie and a JSON response containing user information.
 * @param user - The user object, which can be of type `Types.IUser`.
 * @param statusCode - The HTTP status code to send with the response.
 * @param res - The Express response object.
 * @remarks
 * The function generates a JWT token from the user object and sets it as a cookie
 * with specific options. It then constructs a response object containing user
 * information and the token, and sends it as a JSON response.
 * The cookie options include:
 * - `expires`: The expiration date of the cookie (1 day from the current date).
 * - `httpOnly`: Prevents client-side access to the cookie.
 * - `sameSite`: Allows cross-site cookies with 'lax' policy.
 * - `secure`: Indicates whether the cookie should only be sent over HTTPS.
 * The response object includes:
 * - `success`: A boolean indicating the success of the operation.
 * - `user`: An object containing user-specific fields.
 * - `token`: The generated JWT token.
 * The user-specific fields in the response object:
 * - For `Types.IUser`, it includes `_id`, `email`, `firstName`, `lastName`, `phone`, `image`, `role`, and `status`.
 */
declare const sendToken: (user: Types.IUser, statusCode: number, res: Response) => void;
export default sendToken;
