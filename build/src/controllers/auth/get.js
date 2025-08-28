import { catchAsyncErrors } from '../../middlewares/index.js';
import { StatusCode } from '../../constants/index.js';
import db from '../../mongodb/index.js';
import { clearSession, ErrorHandler, InternalServerError, sendToken, sendOtp, OTP_RESEND_INTERVAL, } from '../../utils/index.js';
export const ResendOtp = catchAsyncErrors(async (req, res, next) => {
    try {
        const { reset } = req.query;
        const isReset = !!(typeof reset === 'string' && reset === 'true');
        const { userDetails } = req.session;
        if (userDetails !== undefined && userDetails !== null) {
            const { firstName, email, phone } = userDetails;
            const emailExist = await db.User.findOne({ email, isDeleted: false });
            if (emailExist !== null && !isReset) {
                next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'email already exist'));
                return;
            }
            if (emailExist === null && isReset) {
                next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', "email doesn't exist"));
                return;
            }
            if (phone !== undefined) {
                const phoneExist = await db.User.findOne({ phone, isDeleted: false });
                if (phoneExist !== null && !isReset) {
                    next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'phone already exist'));
                    return;
                }
                if (phoneExist === null && isReset) {
                    next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', "phone number doesn't exist"));
                    return;
                }
            }
            const result = await sendOtp({
                firstName,
                email,
                phone,
                sendEmail: {
                    subject: isReset ? 'Password Reset Request' : 'Verification',
                    message: isReset
                        ? 'Your one-time passcode for resetting your password is'
                        : 'Your one-time passcode for registration is',
                },
                next,
            });
            if (result === null)
                return;
            res.status(StatusCode.OK).json(result);
        }
        else {
            next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'session expired'));
        }
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
export const OtpStatus = catchAsyncErrors(async (req, res, next) => {
    try {
        const { userDetails } = req.session;
        if (userDetails !== undefined && userDetails !== null) {
            const { email } = userDetails;
            const otpData = await db.Otp.findOne({ email });
            const now = new Date();
            if (otpData !== null) {
                const lastOtpDate = new Date(otpData.lastOtpSent);
                const isSameDay = lastOtpDate.toDateString() === now.toDateString();
                let responseMessage = '';
                let timeLeft = 0;
                if (isSameDay) {
                    // Check if resend interval has passed
                    const timeElapsed = now.getTime() - lastOtpDate.getTime();
                    timeLeft = Math.ceil((OTP_RESEND_INTERVAL - timeElapsed) / 1000);
                    if (timeElapsed < OTP_RESEND_INTERVAL) {
                        responseMessage = `please wait ${timeLeft} seconds before resending otp`;
                    }
                    else {
                        responseMessage = 'otp can be sent';
                    }
                }
                else {
                    responseMessage = 'otp can be sent';
                }
                return res.status(StatusCode.OK).json({
                    success: true,
                    otp: {
                        expiryTime: otpData.expiryTime.getTime(),
                        message: responseMessage,
                        attempts: otpData.resendAttempts,
                    },
                });
            }
            else {
                return res.status(StatusCode.OK).json({
                    success: true,
                    otp: {
                        expiryTime: 0,
                        message: 'no otp data found',
                        attempts: 0,
                    },
                });
            }
        }
        else {
            next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'session expired'));
        }
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
export const Logout = catchAsyncErrors(async (req, res, next) => {
    try {
        clearSession(req, res);
        res.status(StatusCode.OK).json({
            success: true,
            message: 'ok',
        });
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
export const ReAuthenticate = catchAsyncErrors(async (req, res, next) => {
    try {
        const user = req.user;
        if (user !== undefined) {
            sendToken(user, 200, res);
        }
        else {
            clearSession(req, res);
            next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'user not found'));
        }
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
//# sourceMappingURL=get.js.map