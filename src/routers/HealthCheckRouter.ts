import { Router } from 'express';

import HealthCheckController from '../controllers/HealthCheckController';

const healthCheckRouter = Router();

healthCheckRouter.get('/healthz', new HealthCheckController().handleRequest);

export default healthCheckRouter;
