import { type Request, type Response, type NextFunction } from 'express';
import type { Role } from '../types/index.js';
import { type Types } from '../mongodb/index.js';
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
export declare const isAuthenticated: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
export declare const requiredRoles: (...roles: Role[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const isActive: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void;
export {};
