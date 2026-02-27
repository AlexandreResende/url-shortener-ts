import { ErrorRequestHandler } from 'express';

export const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const message = err instanceof Error ? err.message : 'Unknown error';
  console.error(`[Error] ${message}`);

  res.status(500).json({ error: 'Internal server error' });
};
