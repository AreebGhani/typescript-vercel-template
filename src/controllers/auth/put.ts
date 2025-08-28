import { type Request, type Response, type NextFunction } from 'express';

import { catchAsyncErrors } from '@/middlewares';
import { StatusCode } from '@/constants';
import { ErrorHandler, InternalServerError, type MailOptions, sendMail } from '@/utils';
import db from '@/mongodb';

export const UpdatePassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password } = req.body;
      const { userDetails } = req.session;
      if (userDetails !== undefined && userDetails !== null) {
        const { email, phone } = userDetails;
        let user = null;
        if (email !== undefined && email !== null && email !== '') {
          user = await db.User.findOne({ email, isDeleted: false });
          if (user === null) {
            next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', "email doesn't exist"));
            return;
          }
        } else if (phone !== undefined && phone !== null && phone !== '') {
          user = await db.User.findOne({ phone, isDeleted: false });
          if (user === null) {
            next(
              new ErrorHandler(
                StatusCode.BAD_REQUEST,
                'Request Error',
                "phone number doesn't exist"
              )
            );
            return;
          }
        } else {
          next(
            new ErrorHandler(
              StatusCode.BAD_REQUEST,
              'Request Error',
              'email or phone number is required'
            )
          );
          return;
        }
        if (user !== null) {
          if (user.isDeleted) {
            next(
              new ErrorHandler(
                StatusCode.NOT_FOUND,
                'Request Error',
                'your account has been permanently deleted. All associated data will be removed from our servers within 30 working days'
              )
            );
            return;
          }
          if (user.status === 'inactive') {
            next(
              new ErrorHandler(
                StatusCode.FORBIDDEN,
                'Request Error',
                'user account is currently inactive. please contact support for assistance'
              )
            );
            return;
          }
          if (password === undefined || password === null || password === '') {
            next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'password is required'));
            return;
          }
          user.password = password;
          await user.save();
          // Send the email
          const mailDetails: MailOptions = {
            firstName: user.firstName,
            email,
            subject: 'Password Updated',
            htmlBody: '<p>Your password has been succesfully updated.</p>',
          };
          await sendMail(mailDetails);
          // Destroy the user session
          req.session.destroy(() => {});
          res.status(StatusCode.OK).json({ success: true, message: 'ok' });
        } else {
          next(new ErrorHandler(StatusCode.NOT_FOUND, 'Request Error', 'user not found'));
        }
      } else {
        next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'session expired'));
      }
    } catch (err) {
      next(InternalServerError(err));
    }
  }
);
