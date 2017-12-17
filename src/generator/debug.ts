import { init as initializeLogger, LogLevel } from '../utils/logger';
import generator from './generator';

initializeLogger(LogLevel.silent);
generator();
