import { StatusCode } from '../constants/index.js';
import { generateOTP } from '../helpers/index.js';
import { isPhoneNumberVerified } from '../firebase/index.js';
import { ErrorHandler, InternalServerError, sendMail } from '../utils/index.js';
import db from '../mongodb/index.js';
/**
 ** The interval (in milliseconds) that must pass before an OTP can be resent.
 * Set to 60,000 ms (1 minute).
 */
export const OTP_RESEND_INTERVAL = 60 * 1000; // 1 Min
/**
 ** The duration (in milliseconds) for which a generated OTP remains valid.
 * Currently set to 1 minute (60,000 ms).
 */
export const OTP_EXPIRY_DURATION = 60 * 1000; // 1 Min
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
export const sendOtp = async ({ firstName, email, phone, sendEmail, next, }) => {
    try {
        const otpData = await db.Otp.findOne({ email });
        const now = new Date();
        // Check if the last OTP was sent today
        if (otpData !== null) {
            const lastOtpDate = new Date(otpData.lastOtpSent);
            const isSameDay = lastOtpDate.toDateString() === now.toDateString();
            if (isSameDay) {
                // Check if the resend interval has passed
                const timeElapsed = now.getTime() - lastOtpDate.getTime();
                const timeLeft = Math.ceil((OTP_RESEND_INTERVAL - timeElapsed) / 1000);
                if (timeElapsed < OTP_RESEND_INTERVAL) {
                    next(new ErrorHandler(StatusCode.TOO_MANY_REQUESTS, 'Request Error', `please wait ${timeLeft} seconds before resending otp`));
                    return null;
                }
            }
            else {
                // If it's a new day, reset the resendAttempts
                otpData.resendAttempts = 0;
            }
        }
        // Generate a new OTP
        const otp = generateOTP();
        const expiryTime = new Date(now.getTime() + OTP_EXPIRY_DURATION);
        if (otpData !== null) {
            // Update the existing OTP record
            otpData.otp = otp;
            otpData.expiryTime = expiryTime;
            otpData.lastOtpSent = now;
            otpData.resendAttempts += 1;
            await otpData.save();
        }
        else {
            // Create a new OTP record if none exists
            await db.Otp.create({
                email,
                phone,
                otp,
                expiryTime,
                lastOtpSent: now,
                resendAttempts: 1,
            });
        }
        // Send the OTP via email
        const mailDetails = {
            firstName,
            email,
            subject: sendEmail.subject,
            htmlBody: `<p>${sendEmail.message}: <div style='text-align: center;margin-top: 20px;'><strong style='font-size:110%;background:#006a5f;padding: 5px 10px;border-radius: 10px;'>${otp}</stronge></div></p>`,
        };
        await sendMail(mailDetails);
        return {
            success: true,
            otp: {
                email,
                phone,
                expiryTime: expiryTime.getTime(),
            },
        };
    }
    catch (err) {
        next(InternalServerError(err));
        return null;
    }
};
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
export const verifyOtp = async ({ otp, email, phone, next, }) => {
    try {
        const otpData = await db.Otp.findOne({ email });
        if (otpData !== null) {
            const now = new Date();
            if (now.getTime() > otpData.expiryTime.getTime()) {
                next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'otp has expired'));
                return false;
            }
            if (otpData.otp !== Number(otp)) {
                if (phone !== undefined) {
                    const isVerified = await isPhoneNumberVerified(phone);
                    if (!isVerified) {
                        next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'invalid passcode'));
                        return false;
                    }
                }
                else {
                    next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'invalid passcode'));
                    return false;
                }
            }
            await otpData.deleteOne();
        }
        return true;
    }
    catch (err) {
        next(InternalServerError(err));
        return false;
    }
};
//# sourceMappingURL=otp.js.map