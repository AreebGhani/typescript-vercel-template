import express, { type Router } from 'express';

import { StatusCode, ApiPath } from '@/constants';
import AuthRoutes from './auth';
import UserRoutes from './user';
import UploadRoutes from './upload';
import SystemRoutes from './system';
import DocsRoutes from './docs';

const router: Router = express.Router();

router.get('/', (req, res) => {
  res.status(StatusCode.OK).json({ success: true, path: ApiPath });
});

router.use(ApiPath.Auth.Base, AuthRoutes);
router.use(ApiPath.User.Base, UserRoutes);
router.use(ApiPath.Upload.Base, UploadRoutes);
router.use(ApiPath.System.Base, SystemRoutes);
router.use(ApiPath.Docs.Base, DocsRoutes);

export default router;
