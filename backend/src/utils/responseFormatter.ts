import { Response } from 'express';

/**
 * Standardized JSON envelope for GitInsight AI REST endpoints.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * Sends a structured HTTP success response.
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): Response => {
  const payload: ApiResponse<T> = {
    success: true,
    ...(message ? { message } : {}),
    data,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(payload);
};

/**
 * Sends a structured HTTP error response.
 */
export const sendError = (
  res: Response,
  error: string,
  statusCode = 400
): Response => {
  const payload: ApiResponse = {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(payload);
};
