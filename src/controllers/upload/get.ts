import { type Request, type Response, type NextFunction } from 'express';

import { catchAsyncErrors } from '@/middlewares';
import { StatusCode } from '@/constants';
import { InternalServerError, listAllFiles } from '@/utils';

export const AllMedia = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const urls = await listAllFiles();
      res.status(StatusCode.OK).json({
        success: true,
        urls,
      });
    } catch (err) {
      next(InternalServerError(err));
    }
  }
);
