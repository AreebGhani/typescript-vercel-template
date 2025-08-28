import { catchAsyncErrors } from '../../middlewares/index.js';
import { StatusCode } from '../../constants/index.js';
import { InternalServerError } from '../../utils/index.js';
export const create = catchAsyncErrors(async (req, res, next) => {
    try {
        res.status(StatusCode.OK).json({
            success: true,
            message: 'ok',
        });
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
//# sourceMappingURL=post.js.map