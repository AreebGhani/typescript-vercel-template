import { type Request, type Response, type NextFunction } from 'express';

import { catchAsyncErrors } from '@/middlewares';
import { StatusCode } from '@/constants';
import { ErrorHandler, InternalServerError, deleteFile } from '@/utils';

export const DeleteMedia = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const url = req.params.url;
      if (url === undefined || url === null) {
        next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'url is required'));
        return;
      }
      await deleteFile(decodeURIComponent(url));
      res.status(StatusCode.OK).json({ success: true, message: 'ok' });
    } catch (err) {
      next(InternalServerError(err));
    }
  }
);
