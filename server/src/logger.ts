import { createLogger, format, transports } from 'winston';

const ErrorLogger = createLogger({
  level: 'error',
  format: format.simple(),
  transports: [new transports.Console()]
});

const InfoLogger = createLogger({
  level: 'info',
  format: format.simple(),
  transports: [new transports.Console()]
});

export {
  ErrorLogger,
  InfoLogger
};

