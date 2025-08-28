import { type Request, type Response, type NextFunction } from 'express';
import { ObjectCannedACL, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import env from '@/config';
import { catchAsyncErrors } from '@/middlewares';
import { StatusCode } from '@/constants';
import type { Media } from '@/types';
import { ErrorHandler, InternalServerError, uploadMedia, s3Client } from '@/utils';

const allowedPurposes = ['profile'] as const;

export const UploadMedia = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { purpose } = req.body;
      // Validate if purpose is valid
      if (!allowedPurposes.includes(purpose as (typeof allowedPurposes)[number])) {
        next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'invalid purpose value'));
        return;
      }
      if (req.user === undefined) {
        next(new ErrorHandler(StatusCode.NOT_FOUND, 'Request Error', 'user not found'));
        return;
      }
      const media: Media[] = [];
      if (req.file) {
        req.files = [req.file];
      }
      if (req.files !== undefined) {
        // Convert req.files object to an array of files
        const files = Object.values(req.files).flat() as Express.Multer.File[];
        if (files.length !== 0) {
          for (const file of files) {
            const uploadedFile = await uploadMedia({
              file,
              folderName: `${String(req.user._id)}/${purpose}`,
              next,
            });
            if (uploadedFile) {
              media.push(uploadedFile);
              if (req.media) {
                req.media.push(uploadedFile);
              } else {
                req.media = [uploadedFile];
              }
            }
          }
          const allFiles = media.map(m => ({ url: m.url, type: m.type }));
          res.status(StatusCode.OK).json({ success: true, files: allFiles });
          return;
        }
      }
      next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'file not found'));
    } catch (err) {
      next(InternalServerError(err));
    }
  }
);

export const GenerateSignedUrl = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { purpose, extension } = req.body;
    if (!purpose || !extension) {
      return res.status(400).json({ error: 'purpose and extension are required' });
    }
    // Validate purpose for directory structure
    if (!allowedPurposes.includes(purpose)) {
      return res
        .status(400)
        .json({ error: `invalid purpose. allowed values: ${allowedPurposes.join(', ')}` });
    }
    // Generate a unique file name
    const uniqueFileName = `${crypto.randomUUID()}.${extension}`;
    // Construct file path
    const key = `${purpose}/${uniqueFileName}`;
    // Construct public URL
    const publicUrl = `https://${env.STORAGE_BUCKET_NAME}.com/${key}`;
    const params = {
      Bucket: env.STORAGE_BUCKET_NAME,
      Key: key, // File path in the bucket
      ContentType: extension,
      ACL: ObjectCannedACL.public_read, // Make it publicly accessible
    };
    const command = new PutObjectCommand(params);
    try {
      // Generate presigned URL for PUT request
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
      res.status(StatusCode.OK).json({ signedUrl, publicUrl });
    } catch (err) {
      next(InternalServerError(err));
    }
  }
);
