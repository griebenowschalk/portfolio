import fs from "fs";
import path from "path";
import winston from "winston";

const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const NODE_ENV = process.env.NODE_ENV || "development";
const logsDir = path.join(process.cwd(), "logs");

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    const base = `${timestamp} [${level.toUpperCase()}] ${message}`;
    return stack ? `${base}\n${stack}` : base;
  })
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    format:
      NODE_ENV === "development"
        ? winston.format.combine(winston.format.colorize(), format)
        : format,
  }),
];

if (NODE_ENV === "production") {
  try {
    fs.mkdirSync(logsDir, { recursive: true });
  } catch {
    // ignore; file transports may fail at write time
  }
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      format,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      format,
    })
  );
}

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format,
  transports,
});

export default logger;
