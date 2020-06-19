import { createLogger, transports } from 'winston';

const ErrorLogger = createLogger({
  level: 'error',
  transports: [new transports.Console()]
});

const InfoLogger = createLogger({
  level: 'info',
  transports: [new transports.Console()]
});

export {
  ErrorLogger,
  InfoLogger
};
