import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import getFileInfo from '../utils/fileInfo.js';
if (process.env.VERCEL) {
    // eslint-disable-next-line no-console
    console.log('Running on Vercel, using Vercel-managed environment variables from Dashboard');
}
else {
    const ENV_FILE = `.env.${process.env.NODE_ENV}`;
    const ENV_PATH = path.join(getFileInfo().dirname, ENV_FILE);
    if (!fs.existsSync(ENV_PATH)) {
        // eslint-disable-next-line no-console
        console.log(`\nENV not found: \x1b[31msrc/config/${ENV_FILE}\x1b[0m`);
        process.exit(1);
    }
    else {
        dotenv.config({ path: ENV_PATH });
        // eslint-disable-next-line no-console
        console.log(`\nLoaded ENV: \x1b[32m${ENV_FILE}\x1b[0m`);
    }
}
const requiredEnvVars = [
    'APP_NAME',
    'PORT',
    'NODE_ENV',
    'ORIGINS',
    'PUBLIC_URL',
    'FRONTEND_URL',
    'API_VERSION',
    'DATABASE_URL',
    'SESSION_SECRET',
    'JWT_SECRET_KEY',
    'JWT_EXPIRES',
    'STORAGE_ACCESS_KEY_ID',
    'STORAGE_SECRET_KEY_ID',
    'STORAGE_ENDPOINT',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_EMAIL',
    'SMTP_PASSWORD',
];
requiredEnvVars.forEach(key => {
    if (process.env[key] === undefined) {
        // eslint-disable-next-line no-console
        console.log(`Missing environment variable: \x1b[31m${key}\x1b[0m`);
        process.exit(1);
    }
});
/**
 * Environment configuration object containing various application settings.
 * These settings are typically loaded from environment variables.
 *
 * @property {string} APP_NAME - The name of the application.
 * @property {string} PORT - The port number on which the application runs.
 * @property {string} NODE_ENV - The environment in which the application is running (e.g., development, production).
 * @property {string} ORIGINS - Allowed origins for CORS.
 * @property {string} PUBLIC_URL - The public URL of this backend application.
 * @property {string} FRONTEND_URL - The URL of the frontend application.
 * @property {string} API_VERSION - The API version of this backend application.
 * @property {string} DATABASE_URL - The URL of the database.
 * @property {string} SESSION_SECRET - Secret key for session management.
 * @property {string} JWT_SECRET_KEY - Secret key for JWT authentication.
 * @property {string} JWT_EXPIRES - Expiration time for JWT tokens.
 * @property {string} STORAGE_ACCESS_KEY_ID - Access key ID for storage service.
 * @property {string} STORAGE_SECRET_KEY_ID - Secret key ID for storage service.
 * @property {string} STORAGE_ENDPOINT - Endpoint URL for storage service.
 * @property {string} STORAGE_BUCKET_NAME - Bucket name for storage service.
 * @property {string} SMTP_HOST - SMTP server host.
 * @property {string} SMTP_PORT - SMTP server port.
 * @property {string} SMTP_EMAIL - Email address for SMTP authentication.
 * @property {string} SMTP_PASSWORD - Password for SMTP authentication.
 */
const env = {
    APP_NAME: process.env.APP_NAME ?? '',
    PORT: process.env.PORT ?? '',
    NODE_ENV: process.env.NODE_ENV ?? '',
    ORIGINS: process.env.ORIGINS ?? '',
    PUBLIC_URL: process.env.PUBLIC_URL ?? '',
    FRONTEND_URL: process.env.FRONTEND_URL ?? '',
    API_VERSION: process.env.API_VERSION ?? '',
    DATABASE_URL: process.env.DATABASE_URL ?? '',
    SESSION_SECRET: process.env.SESSION_SECRET ?? '',
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ?? '',
    JWT_EXPIRES: process.env.JWT_EXPIRES ?? '',
    STORAGE_ACCESS_KEY_ID: process.env.STORAGE_ACCESS_KEY_ID ?? '',
    STORAGE_SECRET_KEY_ID: process.env.STORAGE_SECRET_KEY_ID ?? '',
    STORAGE_ENDPOINT: process.env.STORAGE_ENDPOINT ?? '',
    STORAGE_BUCKET_NAME: process.env.STORAGE_BUCKET_NAME ?? '',
    SMTP_HOST: process.env.SMTP_HOST ?? '',
    SMTP_PORT: process.env.SMTP_PORT ?? '',
    SMTP_EMAIL: process.env.SMTP_EMAIL ?? '',
    SMTP_PASSWORD: process.env.SMTP_PASSWORD ?? '',
};
export default Object.freeze(env);
//# sourceMappingURL=index.js.map