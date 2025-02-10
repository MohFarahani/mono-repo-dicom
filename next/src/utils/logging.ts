type LogLevel = 'INFO' | 'ERROR' | 'DEBUG' | 'WARN';
type LogMeta = Record<string, unknown>;

interface LogContext extends LogMeta {
  timestamp?: string;
  level?: LogLevel;
  environment?: string;
  requestId?: string;
}

export class LogService {
  private static readonly isProd = process.env.NODE_ENV === 'production';

  private static formatLog(level: LogLevel, message: string, context?: LogContext) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      environment: process.env.NODE_ENV,
      ...context
    };
  }

  static info(message: string, context?: LogContext) {
    console.log(JSON.stringify(this.formatLog('INFO', message, context)));
  }

  static error(message: string, error: unknown, meta?: LogMeta) {
    console.error(this.formatLog('ERROR', message, { ...meta, error }));
  }

  static debug(message: string, meta?: LogMeta) {
    if (!this.isProd) {
      console.log(this.formatLog('DEBUG', message, meta));
    }
  }

  static warn(message: string, meta?: LogMeta) {
    console.warn(this.formatLog('WARN', message, meta));
  }
}
