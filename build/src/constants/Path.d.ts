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
declare const _default: {
    readonly Base: `/api/v${string}`;
    readonly Auth: {
        readonly Base: "/auth";
        readonly Register: "/register";
        readonly ResendOtp: "/resend-otp";
        readonly OtpStatus: "/otp-status";
        readonly Verify: "/verify";
        readonly Login: "/login";
        readonly ForgotPassword: "/forgot-password";
        readonly UpdatePassword: "/update-password";
        readonly Logout: "/logout";
        readonly Reauthenticate: "/reauthenticate";
    };
    readonly User: {
        readonly Base: "/user";
        readonly All: "/all";
        readonly Update: "/update";
        readonly FindById: "/find/:id";
        readonly ChangeStatus: "/change-status/:id";
        readonly DeleteAccount: "/delete-account";
    };
    readonly Upload: {
        readonly Base: "/upload";
        readonly UploadMedia: "/";
        readonly GenerateSignedUrl: "/generate-signed-url";
        readonly AllMedia: "/all";
        readonly DeleteMedia: "/:url";
    };
    readonly Docs: {
        readonly Base: "/docs";
        readonly Swagger: "/";
        readonly Json: "/json";
        readonly Yaml: "/yaml";
        readonly Socket: "/socket";
    };
    readonly System: {
        readonly Base: "/system";
        readonly Info: "/info";
    };
};
export default _default;
