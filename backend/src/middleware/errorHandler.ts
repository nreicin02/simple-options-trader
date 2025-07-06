
import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack || err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({ error: 'Internal Server Error' });
};
