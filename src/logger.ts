import { createLogger, format, transports } from "winston";
import LokiTransport from "winston-loki";

const t: any[] = [
  new transports.Console({
    format: format.combine(format.colorize()),
  }),
];

if (process.env.NODE_ENV === "production") {
  t.push(
    new LokiTransport({
      host: process.env.LOKI_HOST,
      labels: { app: "virtual-route-adaptation-api" },
      json: true,
      format: format.json(),
      replaceTimestamp: true,
      onConnectionError: (err) => console.error(err),
    }),
  );
}

// Create the logger instance
const logger = createLogger({
  level: "debug",
  transports: t,
});

// Export the logger instance
export default logger;
