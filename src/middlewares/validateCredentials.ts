import { type Request, type Response, type NextFunction } from 'express';

import { StatusCode } from '@/constants';
import { ErrorHandler, InternalServerError } from '@/utils';
import { credentialValidator } from '@/helpers';

const validateCredentials =
  ({ type }: { type: 'login' | 'register' | 'forgot' | 'reset' | 'social' | 'update' }) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, phone, firstName, lastName, password } = req.body;
      const requiredFields =
        type === 'login' || type === 'reset'
          ? ['password']
          : type === 'register'
            ? ['firstName', 'lastName', 'email', 'password']
            : type === 'social'
              ? ['firstName', 'lastName', 'email', 'password']
              : type === 'update'
                ? ['firstName', 'lastName', 'email']
                : [];
      // Find missing fields
      const missingFields = requiredFields.filter(
        field => req.body[field] === undefined || req.body[field] === null
      );
      // Special case for login or forgot password: either email or phone must be provided
      if (type === 'login' || type === 'forgot') {
        if (
          (email === undefined && email === null && phone === undefined && phone === null) ||
          (email === '' && phone === '')
        ) {
          next(
            new ErrorHandler(
              StatusCode.BAD_REQUEST,
              'Request Error',
              'either email or phone is required'
            )
          );
          return;
        }
        // Add password to the list of required fields for login
        if (missingFields.includes('password')) {
          next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'password is required'));
          return;
        }
      } else {
        if (missingFields.length > 0) {
          next(
            new ErrorHandler(
              StatusCode.BAD_REQUEST,
              'Request Error',
              `missing fields: ${missingFields.join(', ')}`
            )
          );
          return;
        }
      }
      const result = credentialValidator({
        email,
        phone,
        firstName,
        lastName,
        password,
        isLogin: type === 'login',
      });
      if (result.error) {
        next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', result.message));
        return;
      }
      next();
    } catch (err) {
      next(InternalServerError(err));
    }
  };

export default validateCredentials;
