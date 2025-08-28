import express from 'express';
import { StatusCode, ApiPath } from '../constants/index.js';
import AuthRoutes from './auth.js';
import UserRoutes from './user.js';
import UploadRoutes from './upload.js';
import SystemRoutes from './system.js';
import DocsRoutes from './docs.js';
const router = express.Router();
router.get('/', (req, res) => {
    res.status(StatusCode.OK).json({ success: true, path: ApiPath });
});
router.use(ApiPath.Auth.Base, AuthRoutes);
router.use(ApiPath.User.Base, UserRoutes);
router.use(ApiPath.Upload.Base, UploadRoutes);
router.use(ApiPath.System.Base, SystemRoutes);
router.use(ApiPath.Docs.Base, DocsRoutes);
export default router;
//# sourceMappingURL=index.js.map