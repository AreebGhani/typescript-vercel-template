import { type Request, type Response, type NextFunction } from 'express';

import { catchAsyncErrors } from '@/middlewares';
import { StatusCode } from '@/constants';
import { InternalServerError } from '@/utils';

export const _delete = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(StatusCode.OK).json({
      success: true,
      message: 'ok',
    });
  } catch (err) {
    next(InternalServerError(err));
  }
});
