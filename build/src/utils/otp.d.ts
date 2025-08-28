import { type NextFunction } from 'express';
/**
 ** The interval (in milliseconds) that must pass before an OTP can be resent.
 * Set to 60,000 ms (1 minute).
 */
export declare const OTP_RESEND_INTERVAL: number;
/**
 ** The duration (in milliseconds) for which a generated OTP remains valid.
 * Currently set to 1 minute (60,000 ms).
 */
export declare const OTP_EXPIRY_DURATION: number;
/**
 ** Sends a One-Time Password (OTP) to the specified user's email address.
 * This function checks if an OTP has already been sent today and enforces a resend interval.
 * If the resend interval has not passed, it triggers an error via the provided `next` function.
 * Otherwise, it generates a new OTP, updates or creates the OTP record, and sends the OTP via email.
 * @param params - The parameters for sending the OTP.
 * @param params.firstName - The first name of the user to personalize the email.
 * @param params.email - The email address to which the OTP will be sent.
 * @param params.phone - (Optional) The user's phone number.
 * @param params.sendEmail - The email details including subject and message.
 * @param params.sendEmail.subject - The subject of the OTP email.
 * @param params.sendEmail.message - The message body of the OTP email.
 * @param params.next - The Express `NextFunction` for error handling.
 * @returns A promise that resolves to either:
 *   - `null` if the resend interval has not passed and an error is triggered.
 *   - An object containing:
 *     - `success`: Indicates if the OTP was sent successfully.
 *     - `otp`: The OTP detail object.
 *     - `otp.email`: The recipient's email address.
 *     - `otp.phone`: (Optional) The recipient's phone number.
 *     - `otp.expiryTime`: The expiry time of the OTP in milliseconds since epoch.
 */
export declare const sendOtp: ({ firstName, email, phone, sendEmail, next, }: {
    firstName: string;
    email: string;
    phone?: string | undefined;
    sendEmail: {
        subject: string;
        message: string;
    };
    next: NextFunction;
}) => Promise<{
    success: boolean;
    otp: {
        email: string;
        phone?: string | undefined;
        expiryTime: number;
    };
} | null>;
/**
 ** Verifies the provided OTP for a given email and optionally a phone number.
 * - Checks if the OTP exists for the email.
 * - Validates OTP expiry.
 * - If OTP is incorrect and a phone number is provided, checks if the phone number is verified.
 * - Calls the `next` middleware with an error if verification fails.
 * - Deletes the OTP record after verification.
 * @param params - The parameters for OTP verification.
 * @param params.otp - The OTP code to verify.
 * @param params.email - The email address associated with the OTP.
 * @param params.phone - (Optional) The phone number to verify if OTP fails.
 * @param params.next - The Express middleware next function for error handling.
 * @returns A promise that resolves to `true` if verification succeeds, otherwise `false`.
 */
export declare const verifyOtp: ({ otp, email, phone, next, }: {
    otp: number;
    email: string;
    phone?: string | undefined;
    next: NextFunction;
}) => Promise<boolean>;
