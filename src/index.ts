import 'reflect-metadata';
import './di'
import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

import ENVIRONMENT from "./Environment";
import Routers from "./routers/Routers";
import swaggerSpec from "./swagger";
import { globalErrorHandler } from "./middlewares/ErrorHandler";
import { requestLogger } from "./middlewares/RequestLogger";
import logger from "./logger";

const limiter = rateLimit({
  limit: 50,
  windowMs: 1000 * 60 * 1,
  message: "Too many requests, please try again later.",
  skip: () => process.env.NODE_ENV === 'test',
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(requestLogger);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(Routers);

app.use(globalErrorHandler);

const server = app.listen(ENVIRONMENT.SERVER.PORT, () => {
  logger.info({ port: ENVIRONMENT.SERVER.PORT }, 'Server running');
  logger.info({ url: `${ENVIRONMENT.SERVER.BASE_URL}/docs` }, 'API docs available');
});

const SHUTDOWN_TIMEOUT_MS = 10_000;

const shutdown = (signal: string) => {
  logger.info({ signal }, 'Shutting down gracefully');

  server.close(() => {
    logger.info('Server closed. Exiting.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout.');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
