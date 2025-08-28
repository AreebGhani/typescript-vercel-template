import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import morgan from 'morgan';
import responseTime from 'response-time';
import { rateLimit } from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import requestIp from 'request-ip';
import { UAParser } from 'ua-parser-js';
import env from '../config/index.js';
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
const applyMiddlewares = (app) => {
    app.use(express.json()); // Parse JSON bodies
    app.use(cookieParser()); // Parse cookies
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded bodies with a 50MB limit
    app.use(requestIp.mw()); // Request client IP
    app.enable('trust proxy');
    app.set('trust proxy', 1);
    app.use(helmet({
        contentSecurityPolicy: false, // Disable CSP to allow Swagger UI to load
        crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, // Allow cross-origin popups
        crossOriginEmbedderPolicy: false, // Prevent COEP issues
    }));
    app.use(session({
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        proxy: true,
        store: MongoStore.create({
            mongoUrl: env.DATABASE_URL,
            ttl: 24 * 60 * 60, // 1 day
        }),
        cookie: {
            secure: false,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            sameSite: 'lax',
        },
        name: 'template.sid',
    }));
    app.use(rateLimit({
        windowMs: 1 * 1000, // 1 second
        max: 100, // Limit each IP to 100 requests per second
        message: 'too many requests, please try again after 1 second.',
        headers: true, // Send rate limit info in response headers
    }));
    app.use(responseTime({
        digits: 2, // Limits the response time to two decimal places
        header: 'X-Request-Duration', // Sets the custom header name where the request duration will be added
        suffix: true, // Adds a 'ms' suffix to the response time value (e.g., 200.50ms)
    }));
    app.use((req, res, next) => {
        const { device, browser, os } = UAParser(req.headers['user-agent']);
        req.device = device;
        req.browser = browser;
        req.os = os;
        res.setHeader('X-Request-Device', device?.type || 'unknown');
        res.setHeader('X-Request-Browser', browser?.name || 'unknown');
        res.setHeader('X-Request-OS', os?.name || 'unknown');
        next();
    });
    app.use((req, res, next) => {
        // Set standard headers
        res.setHeader('Server', env.APP_NAME);
        res.setHeader('X-Powered-By', env.APP_NAME);
        res.setHeader('X-Company', env.APP_NAME);
        res.setHeader('X-Contact-Email', env.SMTP_EMAIL);
        res.setHeader('X-Terms-Of-Service', `${env.FRONTEND_URL}/terms`);
        res.setHeader('X-Privacy-Policy', `${env.FRONTEND_URL}/policy`);
        res.setHeader('X-Api-Version', '2.0');
        res.setHeader('X-Api-Status', 'active');
        res.setHeader('X-Api-Name', `${env.APP_NAME} API v${env.API_VERSION}`);
        res.setHeader('X-Api-Environment', env.NODE_ENV);
        res.setHeader('X-Api-Maintenance', env.NODE_ENV !== 'production' ? 'true' : 'false');
        res.setHeader('X-Api-Documentation', `${env.PUBLIC_URL}/api/v${env.API_VERSION}/docs`);
        res.setHeader('X-Request-Ip', req.clientIp ?? '');
        res.setHeader('X-Request-Id', uuidv4());
        res.setHeader('X-Request-Start', Date.now());
        // Set security-related headers
        res.setHeader('X-Content-Encoding', 'gzip');
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('Access-Control-Expose-Headers', 'access-control-allow-credentials,cache-control,connection,content-length,content-type,cross-origin-opener-policy,cross-origin-resource-policy,date,etag,keep-alive,origin-agent-cluster,referrer-policy,server,strict-transport-security,vary,x-api-documentation,x-api-environment,x-api-maintenance,x-api-name,x-api-status,x-api-version,x-company,x-contact-email,x-content-encoding,x-content-type-options,x-dns-prefetch-control,x-download-options,x-frame-options,x-permitted-cross-domain-policies,x-powered-by,x-privacy-policy,x-ratelimit-limit,x-ratelimit-remaining,x-ratelimit-reset,x-request-browser,x-request-device,x-request-duration,x-request-id,x-request-ip,x-request-os,x-request-start,x-terms-of-service,x-xss-protection');
        // Call the next middleware
        next();
    });
    app.use(morgan('combined', {
        stream: {
            write: message => {
                if (env.NODE_ENV !== 'production') {
                    // eslint-disable-next-line no-console
                    console.log('\n\x1B[33m[Request]\x1B[0m', message.trim(), '\n');
                }
            },
        },
    }));
};
export default applyMiddlewares;
//# sourceMappingURL=apply.js.map