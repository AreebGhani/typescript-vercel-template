import { type Request, type Response, type NextFunction } from 'express';

import { catchAsyncErrors } from '@/middlewares';
import { StatusCode } from '@/constants';
import { capitalize } from '@/helpers';
import type { Media } from '@/types';
import { ErrorHandler, InternalServerError, uploadMedia, deleteFile } from '@/utils';
import db from '@/mongodb';

export const Update = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const emailExist = (await db.User.find({ email, isDeleted: false })).length;
    if (emailExist > 1) {
      next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'email already exist'));
      return;
    }
    if (phone !== undefined && phone !== null) {
      const phoneExist = (await db.User.find({ phone, isDeleted: false })).length;
      if (phoneExist > 1) {
        next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'phone already exist'));
        return;
      }
    }
    if (req.user !== undefined) {
      const userExist = await db.User.findOne({ _id: req.user.id, isDeleted: false });
      if (userExist === null) {
        next(new ErrorHandler(StatusCode.NOT_FOUND, 'Request Error', 'user not found'));
        return;
      }
      let media: Media | undefined;
      if (req.file !== undefined && req.file.fieldname === 'image') {
        if (req.user.image !== undefined) {
          await deleteFile(req.user.image);
        }
        media = await uploadMedia({
          file: req.file,
          folderName: `${req.user.id}`,
          next,
        });
        if (media) {
          req.media = [media];
        }
      }
      userExist.firstName = capitalize(firstName);
      userExist.lastName = capitalize(lastName);
      userExist.email = email;
      userExist.phone = phone;
      userExist.image = media ? media.url : userExist?.image;
      await userExist.save();
      res.status(StatusCode.OK).json({
        success: true,
        user: {
          _id: userExist._id,
          firstName: userExist.firstName,
          lastName: userExist.lastName,
          email: userExist.email,
          phone: userExist.phone,
          image: userExist.image,
          role: userExist.role,
          status: userExist.status,
        },
      });
      return;
    }
    next(new ErrorHandler(StatusCode.NOT_FOUND, 'Request Error', 'user not found'));
  } catch (err) {
    next(InternalServerError(err));
  }
});

export const ChangeStatus = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (id === undefined || id === null) {
        next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'user id is required'));
        return;
      }
      const { status } = req.body;
      if (status === undefined || status === null) {
        next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'status is required'));
        return;
      }
      const userExist = await db.User.findOne({ _id: id, isDeleted: false });
      if (userExist !== null) {
        userExist.status = status;
        await userExist.save();
        res.status(StatusCode.OK).json({ success: true, message: 'ok' });
        return;
      }
      next(new ErrorHandler(StatusCode.NOT_FOUND, 'Request Error', 'user not found'));
    } catch (err) {
      next(InternalServerError(err));
    }
  }
);
