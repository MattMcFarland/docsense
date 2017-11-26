// @flow

const lineBreak = /\r\n?|\n|\u2028|\u2029/
const lineBreakG = new RegExp(lineBreak.source, 'g')

export type Pos = {
  start: number,
}

// These are used when `options.locations` is on, for the
// `startLoc` and `endLoc` properties.

export interface Position {
  line: number;
  column: number;
}

export interface SourceLocation {
  start: Position;
  end: Position;
  filename: string;
  identifierName: ?string;
}
