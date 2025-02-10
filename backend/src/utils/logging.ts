interface LogMetadata {
  [key: string]: any;
}

export class LogService {
  static info(message: string, metadata?: LogMetadata) {
    console.log(`[INFO] ${message}`, metadata ? metadata : '');
  }

  static error(message: string, metadata?: LogMetadata) {
    console.error(`[ERROR] ${message}`, metadata ? metadata : '');
  }

  static warn(message: string, metadata?: LogMetadata) {
    console.warn(`[WARN] ${message}`, metadata ? metadata : '');
  }

  static debug(message: string, metadata?: LogMetadata) {
    console.debug(`[DEBUG] ${message}`, metadata ? metadata : '');
  }
} 