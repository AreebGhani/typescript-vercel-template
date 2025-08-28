import env from '../config/index.js';
/**
 * @module ApiPath
 * @description
 * Centralized API endpoint path constants for the backend application.
 * This object provides a structured mapping of all REST API routes used throughout the system,
 * organized by resource domain (e.g., Auth, User, Property, Booking, etc.).
 * Each property group contains endpoints relevant to its domain, including base paths and
 * specific actions (e.g., create, update, delete, find, etc.). Dynamic route parameters are
 * indicated with `:paramName`.
 * Usage:
 * - Import this module to reference API paths consistently across controllers, services, and clients.
 * - Ensures maintainability and reduces risk of hardcoded strings.
 * @example
 * import { ApiPath } from '../constants/index.js';
 * fetch(`${ApiPath.Base}${ApiPath.User.Base}${ApiPath.User.Find.replace(':id', userId)}`);
 * @remarks
 * - The `Base` property at the root level includes the API version from environment variables.
 * - All endpoints are marked as `const` for type safety and IDE autocompletion.
 */
export default {
    Base: `/api/v${env.API_VERSION}`,
    Auth: {
        Base: '/auth',
        Register: '/register',
        ResendOtp: '/resend-otp',
        OtpStatus: '/otp-status',
        Verify: '/verify',
        Login: '/login',
        ForgotPassword: '/forgot-password',
        UpdatePassword: '/update-password',
        Logout: '/logout',
        Reauthenticate: '/reauthenticate',
    },
    User: {
        Base: '/user',
        All: '/all',
        Update: '/update',
        FindById: '/find/:id',
        ChangeStatus: '/change-status/:id',
        DeleteAccount: '/delete-account',
    },
    Upload: {
        Base: '/upload',
        UploadMedia: '/',
        GenerateSignedUrl: '/generate-signed-url',
        AllMedia: '/all',
        DeleteMedia: '/:url',
    },
    Docs: {
        Base: '/docs',
        Swagger: '/',
        Json: '/json',
        Yaml: '/yaml',
        Socket: '/socket',
    },
    System: {
        Base: '/system',
        Info: '/info',
    },
};
//# sourceMappingURL=Path.js.map