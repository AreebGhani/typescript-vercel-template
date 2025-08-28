import path from 'path';

import { type Request, type Response, type NextFunction } from 'express';
import YAML from 'json-to-pretty-yaml';

import { catchAsyncErrors } from '@/middlewares';
import { StatusCode } from '@/constants';
import { ErrorHandler, InternalServerError } from '@/utils';
import swaggerSpec from '@/services/docs';
import { ApiDocsTemplate } from '@/templates';

export const Swagger = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiHtml = ApiDocsTemplate(JSON.stringify(swaggerSpec));
    res.setHeader('Content-Type', 'text/html');
    res.send(apiHtml);
  } catch (err) {
    next(InternalServerError(err));
  }
});

export const Json = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  } catch (err) {
    next(InternalServerError(err));
  }
});

export const Yaml = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.setHeader('Content-Type', 'application/yaml');
    res.send(YAML.stringify(swaggerSpec));
  } catch (err) {
    next(InternalServerError(err));
  }
});

export const Socket = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(path.resolve(), '/docs/dist/index.html'), err => {
      if (err) {
        next(
          new ErrorHandler(StatusCode.INTERNAL_SERVER_ERROR, 'Internal Server Error', err.message)
        );
      }
    });
  } catch (err) {
    next(InternalServerError(err));
  }
});
