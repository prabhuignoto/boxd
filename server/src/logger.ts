import { createLogger, format, transports } from 'winston';

const ErrorLogger = createLogger({
  level: 'error',
  format: format.logstash(),
  transports: [new transports.Console()]
});

const InfoLogger = createLogger({
  level: 'info',
  format: format.logstash(),
  transports: [new transports.Console()]
});

export {
  ErrorLogger,
  InfoLogger
};
