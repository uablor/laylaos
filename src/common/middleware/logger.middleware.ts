// src/common/middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // ✅ Paths ที่ไม่ต้อง log (เช่น health check)
  private readonly excludePaths = ['/health', '/metrics', '/favicon.ico'];

  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip, headers } = req;

    // Skip logging for excluded paths
    if (this.shouldSkipLogging(originalUrl)) {
      return next();
    }

    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      
      const logLevel = this.getLogLevel(statusCode);
      const emoji = this.getEmoji(statusCode);

      this.logger[logLevel](`${emoji} ${method} ${originalUrl}`, {
        status: statusCode,
        duration: `${duration}ms`,
        ip,
        userAgent: headers['user-agent'],
        contentLength: res.get('content-length'),
      });
    });

    next();
  }

  private shouldSkipLogging(path: string): boolean {
    return this.excludePaths.some(excluded => path.startsWith(excluded));
  }

  private getLogLevel(statusCode: number): 'log' | 'warn' | 'error' {
    if (statusCode >= 500) return 'error';
    if (statusCode >= 400) return 'warn';
    return 'log';
  }

  private getEmoji(statusCode: number): string {
    if (statusCode >= 500) return '❌';
    if (statusCode >= 400) return '⚠️';
    if (statusCode >= 300) return '↪️';
    return '✅';
  }
}