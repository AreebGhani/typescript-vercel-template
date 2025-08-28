import path from 'path';
import YAML from 'json-to-pretty-yaml';
import { catchAsyncErrors } from '../../middlewares/index.js';
import { StatusCode } from '../../constants/index.js';
import { ErrorHandler, InternalServerError } from '../../utils/index.js';
import swaggerSpec from '../../services/docs.js';
import { ApiDocsTemplate } from '../../templates/index.js';
export const Swagger = catchAsyncErrors(async (req, res, next) => {
    try {
        const apiHtml = ApiDocsTemplate(JSON.stringify(swaggerSpec));
        res.setHeader('Content-Type', 'text/html');
        res.send(apiHtml);
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
export const Json = catchAsyncErrors(async (req, res, next) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
export const Yaml = catchAsyncErrors(async (req, res, next) => {
    try {
        res.setHeader('Content-Type', 'application/yaml');
        res.send(YAML.stringify(swaggerSpec));
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
export const Socket = catchAsyncErrors(async (req, res, next) => {
    try {
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(path.join(path.resolve(), '/docs/dist/index.html'), err => {
            if (err) {
                next(new ErrorHandler(StatusCode.INTERNAL_SERVER_ERROR, 'Internal Server Error', err.message));
            }
        });
    }
    catch (err) {
        next(InternalServerError(err));
    }
});
//# sourceMappingURL=get.js.map