import { type Request, type Response, type NextFunction } from 'express';
declare const validateCredentials: ({ type }: {
    type: 'login' | 'register' | 'forgot' | 'reset' | 'social' | 'update';
}) => (req: Request, res: Response, next: NextFunction) => void;
export default validateCredentials;
