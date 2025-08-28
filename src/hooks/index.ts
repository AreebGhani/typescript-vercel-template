import express, { type Express, type Request, type Response, type NextFunction } from 'express';

import { catchAsyncErrors } from '@/middlewares';
import { StatusCode, ApiPath } from '@/constants';
import { InternalServerError } from '@/utils';

const Webhook = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Return a 200 response to acknowledge receipt of the event
    res.status(StatusCode.OK).send();
  } catch (err) {
    next(InternalServerError(err));
  }
});

/**
 ** Sets up the webhooks for the application.
 * @param app - The Express application instance.
 */
const setupWebhooks = (app: Express): void => {
  // Webhook for receiving events
  app.post(`${ApiPath.Base}/webhook`, express.raw({ type: 'application/json' }), Webhook);
};

export default setupWebhooks;
