import { catchAsyncErrors } from '../../middlewares/index.js';
import { StatusCode } from '../../constants/index.js';
import { ErrorHandler, InternalServerError, deleteFile } from '../../utils/index.js';
export const DeleteMedia = catchAsyncErrors(async (req, res, next) => {
    try {
        const url = req.params.url;
        if (url === undefined || url === null) {
            next(new ErrorHandler(StatusCode.BAD_REQUEST, 'Request Error', 'url is required'));
            return;
        }
        await deleteFile(decodeURIComponent(url));
        res.status(StatusCode.OK).json({ success: true, message: 'ok' });
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
//# sourceMappingURL=del.js.map