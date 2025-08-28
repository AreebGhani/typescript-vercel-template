import jwt from 'jsonwebtoken';
import env from '../config/index.js';
import { StatusCode } from '../constants/index.js';
import db from '../mongodb/index.js';
import { ErrorHandler, InternalServerError, clearSession } from '../utils/index.js';
import catchAsyncErrors from './catchAsyncErrors.js';
// Middleware to ensure the user is authenticated
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (token === undefined || token === null || token === '') {
            clearSession(req, res);
            next(new ErrorHandler(StatusCode.UNAUTHORIZED, 'Request Error', 'please login to continue'));
            return;
        }
        const decoded = jwt.verify(token, env.JWT_SECRET_KEY);
        const userExist = await db.User.findById(decoded.id);
        if (userExist === null) {
            next(new ErrorHandler(StatusCode.NOT_FOUND, 'Request Error', 'user not found'));
        }
        else {
            if (userExist.isDeleted) {
                next(new ErrorHandler(StatusCode.FORBIDDEN, 'Request Error', 'your account has been permanently deleted. all associated data will be removed from our servers within 30 working days'));
                return;
            }
            // Attach user info to request object and proceed
            req.user = userExist;
            next();
        }
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
// Middleware to ensure the user has the required role
export const requiredRoles = (...roles) => {
    return (req, res, next) => {
        try {
            if (req.user === undefined || !roles.includes(req.user.role)) {
                next(new ErrorHandler(StatusCode.FORBIDDEN, 'Request Error', `${req.user?.role || 'user'} cannot access this resource`));
                return;
            }
            next();
        }
        catch (err) {
            next(InternalServerError(err));
        }
    };
};
// Middleware to ensure the user is active
export const isActive = catchAsyncErrors(async (req, res, next) => {
    try {
        if (req.user === undefined || req.user.status !== 'active') {
            clearSession(req, res);
            next(new ErrorHandler(StatusCode.FORBIDDEN, 'Request Error', `${req.user?.role || 'user'} account is currently inactive. please contact support for assistance`));
            return;
        }
        next();
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
//# sourceMappingURL=auth.js.map