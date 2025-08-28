"use strict";
/**
 * @openapi
 * /webhook:
 *   post:
 *     tags:
 *       - Webhook Controller
 *     summary: Webhook for receving events
 *     description: This webhook is used to receive any events.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Successfully processed the event
 *       400:
 *         description: Invalid or bad request
 *       500:
 *         description: Internal server error
 */
//# sourceMappingURL=webhook.js.map