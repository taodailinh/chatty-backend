import { authRoutes } from '@auth/routes/authRoutes';
import { serverAdapter } from '@service/queues/base.queue';
import { Application } from 'express';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
  app.use('/queues', serverAdapter.getRouter());
  app.use(BASE_PATH, authRoutes.routes());
};
