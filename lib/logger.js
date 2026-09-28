const isProd = process.env.NODE_ENV === "production";

export const logger = {
  log(level, message, meta = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta,
    };

    if (meta.error instanceof Error) {
      logEntry.error = {
        message: meta.error.message,
        stack: meta.error.stack,
      };
    } else if (meta.error) {
      logEntry.error = meta.error;
    }

    if (isProd) {
      console.log(JSON.stringify(logEntry));
    } else {
      const color = level === "ERROR" ? "\x1b[31m" : level === "WARN" ? "\x1b[33m" : "\x1b[36m";
      const reset = "\x1b[0m";
      // Pretty logging in development
      const metaOutput = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : "";
      console.log(`[${logEntry.timestamp}] ${color}${level}${reset}: ${message} ${metaOutput}`);
    }
  },
  info(message, meta) { this.log("INFO", message, meta); },
  warn(message, meta) { this.log("WARN", message, meta); },
  error(message, meta) { this.log("ERROR", message, meta); },
};
