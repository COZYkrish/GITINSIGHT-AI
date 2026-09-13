import { Request, Response, NextFunction } from 'express';

export type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

/**
 * Higher-order function that catches unhandled rejections in async route controllers
 * and passes them forward to the Express global error middleware.
 */
export const asyncHandler = (fn: AsyncController) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};
