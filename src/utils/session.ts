import { type Request, type Response } from 'express';

import env from '@/config';

/**
 ** Clears the current session and removes the authentication token cookie.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * The function performs the following actions:
 * 1. Checks if the session destroy method is defined and calls it to destroy the session.
 * 2. Sets the cookies to null with the following properties:
 *    - `expires`: Sets the expiration date to the current date, effectively deleting the cookie.
 *    - `httpOnly`: Ensures the cookie is not accessible via client-side scripts.
 *    - `sameSite`: Sets the SameSite attribute to 'none' if in production, otherwise 'lax'.
 *    - `secure`: Ensures the cookie is only sent over HTTPS if in production.
 */
const clearSession = (req: Request, res: Response): void => {
  if (req.session.destroy !== undefined) {
    req.session.destroy(() => {});
  }
  if (req.cookies) {
    Object.keys(req.cookies).forEach(cookieName => {
      res.cookie(cookieName, null, {
        expires: new Date(0), // Expire immediately
        httpOnly: true, // Ensures security
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: env.NODE_ENV === 'production',
      });
    });
  }
};

export default clearSession;
