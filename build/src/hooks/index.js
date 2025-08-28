import express from 'express';
import { catchAsyncErrors } from '../middlewares/index.js';
import { StatusCode, ApiPath } from '../constants/index.js';
import { InternalServerError } from '../utils/index.js';
const Webhook = catchAsyncErrors(async (req, res, next) => {
    try {
        // Return a 200 response to acknowledge receipt of the event
        res.status(StatusCode.OK).send();
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
/**
 ** Sets up the webhooks for the application.
 * @param app - The Express application instance.
 */
const setupWebhooks = (app) => {
    // Webhook for receiving events
    app.post(`${ApiPath.Base}/webhook`, express.raw({ type: 'application/json' }), Webhook);
};
export default setupWebhooks;
//# sourceMappingURL=index.js.map