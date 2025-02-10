import { NextRequest, } from 'next/server';
import { handleApiError } from './errorHandling';
import { LogService } from './logging';

type ApiHandler = (req: NextRequest) => Promise<Response>;
type ValidationFunction = (req: NextRequest) => Promise<void> | void;

interface ApiHandlerOptions {
  validate?: ValidationFunction;
  rateLimit?: boolean;
}

export const wrapApiHandler = (handler: ApiHandler, options: ApiHandlerOptions = {}) => {
  return async (req: NextRequest) => {
    try {
      LogService.info(`API Request: ${req.method} ${req.url}`);
      
      if (options.validate) {
        await options.validate(req);
      }

      // Could add rate limiting here if needed
      if (options.rateLimit) {
        // Implement rate limiting logic
      }

      const response = await handler(req);
      
      // Log successful responses
      LogService.debug('API Response', {
        status: response.status,
        url: req.url,
      });

      return response;
    } catch (error) {
      LogService.error('API Error', error);
      return handleApiError(error);
    }
  };
}; 