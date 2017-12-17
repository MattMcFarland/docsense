import { init as initializeLogger, log, LogLevel } from '../utils/logger';
import generator from './generator';

process.on('unhandledRejection', err => {
  log.error('ERR', err);
  process.exit(1);
});

initializeLogger(LogLevel.silent);
generator();
