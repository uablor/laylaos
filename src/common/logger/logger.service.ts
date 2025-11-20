// src/common/logger/logger.service.ts
import { Injectable, LogLevel } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    const logDir = path.join(__dirname, '../../../logs');

    // Transport สำหรับ error logs
    const errorFileTransport = new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
      level: 'error',
    });

    // Transport สำหรับ all logs
    const combinedFileTransport = new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '14d',
    });

    // Console transport with colors
    const consoleTransport = new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
          return `${timestamp} [${level}] ${message} ${metaStr}`;
        }),
      ),
    });

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports: [
        errorFileTransport,
        combinedFileTransport,
        consoleTransport,
      ],
    });
  }

  log(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  error(message: string, meta?: any) {
    this.logger.error(message, meta);
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: any) {
    this.logger.debug(message, meta);
  }

  verbose(message: string, meta?: any) {
    this.logger.verbose(message, meta);
  }
}