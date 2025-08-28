import { catchAsyncErrors } from '../../middlewares/index.js';
import { StatusCode } from '../../constants/index.js';
import { InternalServerError, listAllFiles } from '../../utils/index.js';
export const AllMedia = catchAsyncErrors(async (req, res, next) => {
    try {
        const urls = await listAllFiles();
        res.status(StatusCode.OK).json({
            success: true,
            urls,
        });
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
//# sourceMappingURL=get.js.map