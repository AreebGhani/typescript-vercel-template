import { StatusCode } from '../constants/index.js';
import { ErrorHandler, InternalServerError } from '../utils/index.js';
import { credentialValidator } from '../helpers/index.js';
const validateCredentials = ({ type }) => (req, res, next) => {
    try {
        const { email, phone, firstName, lastName, password } = req.body;
        const requiredFields = type === 'login' || type === 'reset'
            ? ['password']
            : type === 'register'
                ? ['firstName', 'lastName', 'email', 'password']
                : type === 'social'
                    ? ['firstName', 'lastName', 'email', 'password']
                    : type === 'update'
                        ? ['firstName', 'lastName', 'email']
                        : [];
        // Find missing fields
        const missingFields = requiredFields.filter(field => req.body[field] === undefined || req.body[field] === null);
        // Special case for login or forgot password: either email or phone must be provided
        if (type === 'login' || type === 'forgot') {
            if ((email === undefined && email === null && phone === undefined && phone === null) ||
                (email === '' && phone === '')) {
                next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'either email or phone is required'));
                return;
            }
            // Add password to the list of required fields for login
            if (missingFields.includes('password')) {
                next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'password is required'));
                return;
            }
        }
        else {
            if (missingFields.length > 0) {
                next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', `missing fields: ${missingFields.join(', ')}`));
                return;
            }
        }
        const result = credentialValidator({
            email,
            phone,
            firstName,
            lastName,
            password,
            isLogin: type === 'login',
        });
        if (result.error) {
            next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', result.message));
            return;
        }
        next();
    }
    catch (err) {
        next(InternalServerError(err));
    }
};
export default validateCredentials;
//# sourceMappingURL=validateCredentials.js.map