import { type Request, type Response, type NextFunction } from 'express';

import { catchAsyncErrors } from '@/middlewares';
import { StatusCode } from '@/constants';
import { capitalize } from '@/helpers';
import { ErrorHandler, InternalServerError, sendMail } from '@/utils';
import db from '@/mongodb';

export const DeleteAccount = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reason } = req.body;
      if (reason === undefined || reason === null) {
        next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'reason is required'));
        return;
      }
      if (typeof reason !== 'string') {
        next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'invalid reason'));
        return;
      }
      if (req.user === undefined) {
        next(new ErrorHandler(StatusCode.NOT_FOUND, 'Request Error', 'user not found'));
        return;
      }
      const deleteAccountRequestExist = await db.DeleteAccountRequest.findOne({
        user: req.user.id,
      });
      if (deleteAccountRequestExist !== null) {
        next(
          new ErrorHandler(
            StatusCode.FORBIDDEN,
            'Request Error',
            'delete account request already submitted'
          )
        );
        return;
      }
      await db.DeleteAccountRequest.create({
        user: req.user.id,
        reason,
      });
      await db.User.findByIdAndUpdate(req.user.id, {
        isDeleted: true,
      });
      const mailToUser = {
        firstName: capitalize(req.user.firstName),
        email: req.user.email,
        subject: 'Account Permanently Deleted',
        htmlBody: `
        <p>We want to inform you that your account has been <strong>permanently deleted</strong>. You will no longer be able to access your account or retrieve any associated data.</p>
        <p><strong>Reason for Deletion:</strong> ${reason}</p>
        <p><strong>What Happens Next?</strong>: Your account deletion will be processed within <strong>30 working days</strong>.</p>
        <p>If you did not initiate this request, please contact us immediately.</p>
      `,
      };
      await sendMail(mailToUser);
      res.status(StatusCode.CREATED).json({
        success: true,
        message: 'ok',
      });
    } catch (err) {
      next(InternalServerError(err));
    }
  }
);
