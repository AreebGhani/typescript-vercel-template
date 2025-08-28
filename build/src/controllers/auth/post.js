import { catchAsyncErrors } from '../../middlewares/index.js';
import { StatusCode } from '../../constants/index.js';
import { capitalize } from '../../helpers/index.js';
import { ErrorHandler, InternalServerError, sendOtp, verifyOtp, sendToken } from '../../utils/index.js';
import db from '../../mongodb/index.js';
export const Register = catchAsyncErrors(async (req, res, next) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;
        const emailExist = await db.User.findOne({ email, isDeleted: false });
        if (emailExist !== null) {
            next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'email already exist'));
            return;
        }
        if (phone !== undefined && phone !== null) {
            const phoneExist = await db.User.findOne({ phone, isDeleted: false });
            if (phoneExist !== null) {
                next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'phone already exist'));
                return;
            }
        }
        // Store user details in session
        req.session.userDetails = {
            firstName,
            lastName,
            email,
            password,
            phone: phone && phone.trim().length < 6 ? undefined : phone,
        };
        const result = await sendOtp({
            firstName,
            email,
            phone,
            sendEmail: {
                subject: 'Verification',
                message: 'Your one-time passcode for registration is',
            },
            next,
        });
        if (result === null)
            return;
        res.status(StatusCode.OK).json(result);
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
export const Verify = catchAsyncErrors(async (req, res, next) => {
    try {
        const { otp, reset } = req.body;
        if (otp === undefined || otp === null) {
            next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'otp is required'));
            return;
        }
        if (typeof otp !== 'number') {
            next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'invalid otp'));
            return;
        }
        if (reset !== undefined && reset !== null) {
            const isValid = typeof reset === 'boolean';
            if (!isValid) {
                next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'invalid reset'));
                return;
            }
        }
        const isReset = !!reset;
        const { userDetails } = req.session;
        if (userDetails !== undefined && userDetails !== null) {
            const { firstName, lastName, email, phone, password } = userDetails;
            const result = await verifyOtp({ otp, email, phone, next });
            if (!result)
                return;
            if (isReset) {
                res.status(StatusCode.OK).json({ success: true, message: 'ok' });
                return;
            }
            const userExist = await db.User.findOne({
                email,
                isDeleted: false,
            });
            if (userExist !== null) {
                next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'user already exists'));
                return;
            }
            const user = await db.User.create({
                firstName: capitalize(firstName),
                lastName: capitalize(lastName),
                email,
                phone,
                password,
                isDeleted: false,
                role: 'user',
            });
            // Destroy the user session
            req.session.destroy(() => { });
            sendToken(user, 201, res);
        }
        else {
            next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'session expired'));
        }
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
export const Login = catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, phone, password } = req.body;
        let user = null;
        if (email !== undefined && email !== null && email !== '') {
            user = await db.User.findOne({ email, isDeleted: false });
            if (user === null) {
                next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', "email doesn't exist"));
                return;
            }
        }
        else if (phone !== undefined && phone !== null && phone !== '') {
            user = await db.User.findOne({ phone, isDeleted: false });
            if (user === null) {
                next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', "phone number doesn't exist"));
                return;
            }
        }
        else {
            next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'email or phone number is required'));
            return;
        }
        if (user !== null) {
            if (password === undefined || password === null || password === '') {
                next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'password is required'));
                return;
            }
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'invalid password'));
                return;
            }
            if (user.isDeleted) {
                next(new ErrorHandler(StatusCode.NOT_FOUND, 'Request Error', 'your account has been permanently deleted. All associated data will be removed from our servers within 30 working days'));
                return;
            }
            if (user.status === 'inactive') {
                next(new ErrorHandler(StatusCode.FORBIDDEN, 'Request Error', 'user account is currently inactive. please contact support for assistance'));
                return;
            }
            sendToken(user, 200, res);
        }
        else {
            next(new ErrorHandler(StatusCode.NOT_FOUND, 'Request Error', 'user not found'));
        }
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
export const ForgotPassword = catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, phone } = req.body;
        let user = null;
        if (email !== undefined && email !== null && email !== '') {
            user = await db.User.findOne({ email, isDeleted: false });
            if (user === null) {
                next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', "email doesn't exist"));
                return;
            }
        }
        else if (phone !== undefined && phone !== null && phone !== '') {
            user = await db.User.findOne({ phone, isDeleted: false });
            if (user === null) {
                next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', "phone number doesn't exist"));
                return;
            }
        }
        else {
            next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'email or phone number is required'));
            return;
        }
        if (user !== null) {
            if (user.isDeleted) {
                next(new ErrorHandler(StatusCode.NOT_FOUND, 'Request Error', 'your account has been permanently deleted. All associated data will be removed from our servers within 30 working days'));
                return;
            }
            if (user.status === 'inactive') {
                next(new ErrorHandler(StatusCode.FORBIDDEN, 'Request Error', 'user account is currently inactive. please contact support for assistance'));
                return;
            }
            const { firstName, lastName, email, phone, password } = user;
            // Store user details in session
            req.session.userDetails = { firstName, lastName, email, phone, password };
            const result = await sendOtp({
                firstName,
                email,
                phone,
                sendEmail: {
                    subject: 'Password Reset Request',
                    message: 'Your one-time passcode for resetting your password is',
                },
                next,
            });
            if (result === null)
                return;
            res.status(StatusCode.OK).json(result);
        }
        else {
            next(new ErrorHandler(StatusCode.NOT_FOUND, 'Request Error', 'user not found'));
        }
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
//# sourceMappingURL=post.js.map