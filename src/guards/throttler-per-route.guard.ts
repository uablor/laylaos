// // src/common/guards/throttler-per-route.guard.ts
// import { Injectable, ExecutionContext } from '@nestjs/common';
// import { ThrottlerGuard } from '@nestjs/throttler';
// import { Request } from 'express';

// @Injectable()
// export class ThrottlerPerRouteGuard extends ThrottlerGuard {
//   protected async getTracker(req: Record<string, any>): Promise<string> {
//     const request = req as Request;
//     const ip = this.getClientIp(request);
    
//     const routePath = request.route?.path || request.baseUrl + request.path;
    
//     return `${ip}-${routePath}`;
//   }

//   private getClientIp(req: Request): string {
//     return (
//       (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
//       (req.headers['x-real-ip'] as string) ||
//       req.socket.remoteAddress ||
//       'unknown'
//     );
//   }
// }

import { 
  Injectable, 
  ExecutionContext,
  HttpException,
  HttpStatus 
} from '@nestjs/common';
import { 
  ThrottlerGuard, 
  ThrottlerModuleOptions,
  ThrottlerStorage 
} from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class ThrottlerPerRouteGuard extends ThrottlerGuard {
  constructor(
    options: ThrottlerModuleOptions,
    storageService: ThrottlerStorage,
    reflector: Reflector,
    private readonly logger: LoggerService,
  ) {
    super(options, storageService, reflector);
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    const request = req as Request;
    const ip = this.getClientIp(request);
    const routePath = request.route?.path || request.baseUrl + request.path;
    return `${ip}-${routePath}`;
  }

  private getClientIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (req.headers['x-real-ip'] as string) ||
      req.socket.remoteAddress ||
      'unknown'
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const ip = this.getClientIp(req);
    const route = `${req.method} ${req.originalUrl}`;

    try {
      const result = await super.canActivate(context);
      
      this.logger.log(`✅ ALLOWED ${route} | IP: ${ip}`);
      
      return result;
    } catch (error) {
      // ดึงข้อมูล ttl จาก error ถ้ามี
      const ttl = this.getTtlFromError(error);
      
      this.logger.warn(
        `🚫 RATE LIMIT ${route} | IP: ${ip}${ttl ? ` | Retry after: ${ttl}s` : ''}`
      );

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: ttl 
            ? `Too many requests. Please try again after ${ttl} seconds.`
            : 'Too many requests. Please try again later.',
          error: 'Too Many Requests',
          timestamp: new Date().toISOString(),
          path: req.url,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  private getTtlFromError(error: any): number | null {
    // พยายามดึง ttl จาก error object
    if (error?.message && typeof error.message === 'string') {
      const match = error.message.match(/(\d+)/);
      return match ? parseInt(match[1]) : null;
    }
    return null;
  }
}