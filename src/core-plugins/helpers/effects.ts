import { SourceLocation } from 'babel-types';
import { log } from '../../utils/logger';

export const logSkipped = (
  astType: string,
  { filename, start }: SourceLocation
) => log.warn('skip', astType, `${filename}:${start.line}:${start.column}`);
