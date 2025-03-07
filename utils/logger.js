// utils/logger.js
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  _log(level, message, error = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;

    if (error && this.isDevelopment) {
      console.error(logMessage, '\n', error);
    } else {
      switch (level) {
      case LOG_LEVELS.ERROR:
        console.error(logMessage);
        break;
      case LOG_LEVELS.WARN:
        console.warn(logMessage);
        break;
      default:
        console.log(logMessage);
      }
    }
  }

  error(message, error = null) {
    this._log(LOG_LEVELS.ERROR, message, error);
  }

  warn(message) {
    this._log(LOG_LEVELS.WARN, message);
  }

  info(message) {
    this._log(LOG_LEVELS.INFO, message);
  }

  debug(message) {
    if (this.isDevelopment) {
      this._log(LOG_LEVELS.DEBUG, message);
    }
  }
}

module.exports = new Logger();
