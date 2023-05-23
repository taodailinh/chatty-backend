import { authRoutes } from '@auth/routes/authRoutes';
import { currentRoutes } from '@auth/routes/currentRoutes';
import { postRoutes } from '@post/routes/post.Routes';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { serverAdapter } from '@service/queues/base.queue';
import { Application } from 'express';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
  app.use('/queues', serverAdapter.getRouter());
  app.use(BASE_PATH, authRoutes.routes());
  app.use(BASE_PATH, authRoutes.signoutRoute());
  app.use(BASE_PATH, authMiddleware.verify, currentRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verify, postRoutes.routes());
};
