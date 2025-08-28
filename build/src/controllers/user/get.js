import { catchAsyncErrors } from '../../middlewares/index.js';
import { StatusCode } from '../../constants/index.js';
import { ErrorHandler, InternalServerError } from '../../utils/index.js';
import db from '../../mongodb/index.js';
export const All = catchAsyncErrors(async (req, res, next) => {
    try {
        const users = await db.User.find()
            .select(['firstName', 'lastName', 'eamil', 'phone', 'image', 'role', 'status'])
            .sort({
            createdAt: -1,
        });
        if (users === null) {
            next(new ErrorHandler(StatusCode.NOT_FOUND, 'Request Error', 'user not found'));
            return;
        }
        res.status(StatusCode.OK).json({
            success: true,
            users,
        });
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
export const FindById = catchAsyncErrors(async (req, res, next) => {
    try {
        const id = req.params.id;
        if (id === undefined || id === null) {
            next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'user id is required'));
            return;
        }
        const user = await db.User.findOne({ _id: id, isDeleted: false }).select([
            'firstName',
            'lastName',
            'eamil',
            'phone',
            'image',
            'role',
            'status',
        ]);
        if (user === null) {
            next(new ErrorHandler(StatusCode.NOT_FOUND, 'Request Error', 'user not found'));
            return;
        }
        res.status(StatusCode.OK).json({
            success: true,
            user,
        });
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
//# sourceMappingURL=get.js.map