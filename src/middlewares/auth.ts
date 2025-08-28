import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import env from '@/config';
import type { Role } from '@/types';
import { StatusCode } from '@/constants';
import db, { type Types } from '@/mongodb';
import { ErrorHandler, InternalServerError, clearSession } from '@/utils';
import catchAsyncErrors from './catchAsyncErrors';

/**
 ** Represents the structure of a decoded token.
 * @interface DecodedToken
 * @property {string} id - The unique identifier extracted from the token.
 */
interface DecodedToken {
  id: string;
}

/**
 ** Represents a request that has been authenticated.
 * This interface extends the standard Express `Request` interface to include
 * optional `user` and `concierge` properties, which can be used to store
 * authenticated user and concierge information respectively.
 * @property {Types.IUser} user - The authenticated user, if available.
 */
interface AuthenticatedRequest extends Request {
  user?: Types.IUser;
}

// Middleware to ensure the user is authenticated
export const isAuthenticated = catchAsyncErrors(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { token } = req.cookies;
      if (token === undefined || token === null || token === '') {
        clearSession(req, res);
        next(
          new ErrorHandler(StatusCode.UNAUTHORIZED, 'Request Error', 'please login to continue')
        );
        return;
      }
      const decoded = jwt.verify(token as string, env.JWT_SECRET_KEY) as DecodedToken;
      const userExist = await db.User.findById(decoded.id);
      if (userExist === null) {
        next(new ErrorHandler(StatusCode.NOT_FOUND, 'Request Error', 'user not found'));
      } else {
        if (userExist.isDeleted) {
          next(
            new ErrorHandler(
              StatusCode.FORBIDDEN,
              'Request Error',
              'your account has been permanently deleted. all associated data will be removed from our servers within 30 working days'
            )
          );
          return;
        }
        // Attach user info to request object and proceed
        req.user = userExist;
        next();
      }
    } catch (err) {
      next(InternalServerError(err));
    }
  }
);

// Middleware to ensure the user has the required role
export const requiredRoles = (...roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user === undefined || !roles.includes(req.user.role)) {
        next(
          new ErrorHandler(
            StatusCode.FORBIDDEN,
            'Request Error',
            `${req.user?.role || 'user'} cannot access this resource`
          )
        );
        return;
      }
      next();
    } catch (err) {
      next(InternalServerError(err));
    }
  };
};

// Middleware to ensure the user is active
export const isActive = catchAsyncErrors(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user === undefined || req.user.status !== 'active') {
        clearSession(req, res);
        next(
          new ErrorHandler(
            StatusCode.FORBIDDEN,
            'Request Error',
            `${req.user?.role || 'user'} account is currently inactive. please contact support for assistance`
          )
        );
        return;
      }
      next();
    } catch (err) {
      next(InternalServerError(err));
    }
  }
);
