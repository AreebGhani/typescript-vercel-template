import { type Express } from 'express';
/**
 ** Applies various middlewares to the Express application.
 * @param app - The Express application instance.
 * @remarks
 * This function configures the following middlewares:
 * - JSON Body Parser: Parses JSON bodies of incoming requests.
 * - Cookie Parser: Parses cookies attached to the client request object.
 * - URL-encoded Body Parser: Parses URL-encoded bodies with a specified limit.
 * - Security: Secures app by setting HTTP headers to prevent common vulnerabilities.
 * - Trust Proxy: Enables proxy trust settings.
 * - Session: Configures session management with MongoDB store, secure cookies, and other settings.
 * - Rate Limiting: Limits the number of requests per IP to prevent abuse.
 * - Custom Headers: Sets various custom headers for responses, including API metadata and security headers.
 * - Request Logging: Logs incoming requests using Morgan in combined format.
 */
declare const applyMiddlewares: (app: Express) => void;
export default applyMiddlewares;
