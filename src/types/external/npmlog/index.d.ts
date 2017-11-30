// Type definitions for npmlog ^4.1.2
// Project: npm/npmlog
// Definitions by: Matt McFarland

declare namespace NPMLog {
  export function log(level: string, prefix: string, ...message: Array<any>): void
  export function silly(prefix: string, ...message: Array<any>): void
  export function verbose(prefix: string, ...message: Array<any>): void
  export function info(prefix: string, ...message: Array<any>): void
  export function http(prefix: string, ...message: Array<any>): void
  export function warn(prefix: string, ...message: Array<any>): void
  export function error(prefix: string, ...message: Array<any>): void

  export interface Style {
    fg?: string,
    bg?: string,
    bold?: boolean,
    inverse?: boolean,
    underline?: boolean,
    bell?: boolean
  }
  /**
   * Every log event is emitted with a message object, and the log.record list contains all of them that have been created.
   */
  export interface Message {
    id: number,
    level: string,
    prefix: string,
    message: string,
    messageRaw: string
  }
  export enum Aligntypes {
    "left",
    "right",
    "center"
  }
  export interface GuageTemplate {
    type: any,
    kerning: number,
    maxLength: number,
    minLength: number,
    align: Aligntypes,
    length: number,
    value: string,
    default: string
  }

  /** The stream where output is written. */
  export let stream: NodeJS.WritableStream
  /**
   * The level to display logs at. Any logs at or above this level will be displayed. The special level silent will prevent anything from being displayed ever.
   */
  export let level: string
  /**
   * An array of all the log messages that have been entered.
   */
  export const record: ReadonlyArray<Message>
  /**
   * The maximum number of records to keep. If log.record gets bigger than 10% over this value, then it is sliced down to 90% of this value.
   * The reason for the 10% window is so that it doesn't have to resize a large array on every log entry.
   */
  export let maxRecordSize: number
  export let prefixStyle: Style
  export let headingStyle: Style
  export let heading: string
  /** Force colors to be used on all messages, regardless of the output stream. */
  export function enableColor(): void
  /** Disable colors on all messages. */
  export function disableColor(): void
  /** Enable the display of log activity spinner and progress bar */
  export function enableProgress(): void
  /** Disable the display of a progress bar */
  export function disableProgress(): void
  /** Force the unicode theme to be used for the progress bar. */
  export function enableUnicode(): void
  /** Disable the use of unicode in the progress bar. */
  export function disableUnicode(): void
  /** Set a template for outputting the progress bar. See the gauge documentation for details. */
  export function setGuageTemplate(template: GuageTemplate): void
  /** Select a themeset to pick themes from for the progress bar. See the gauge documentation for details. */
  export function setGuageThemeset(theme: any): void
  /** Stop emitting messages to the stream, but do not drop them. */
  export function pause(): void
  /** Emit all buffered messages that were written while paused. */
  export function resume(): void
  /** Sets up a new level with a shorthand function and so forth. */
  export function addLevel(level: string, numericLevel: number, style: Style, disp?: string): void
  /** This adds a new are-we-there-yet item tracker to the progress tracker. The object returned has the log[level] methods but is otherwise an are-we-there-yet Tracker object. */
  export function newItem(name: string, todo: string, weight: number): void
  /** This adds a new are-we-there-yet stream tracker to the progress tracker. The object returned has the log[level] methods but is otherwise an are-we-there-yet TrackerStream object. */
  export function newStream(name: string, weight: number): void
  /** This adds a new are-we-there-yet tracker group to the progress tracker. The object returned has the log[level] methods but is otherwise an are-we-there-yet TrackerGroup object. */
  export function newGroup(name: string, weight: number): void

  /** @see NodeJS.EventEmitter */
  export const defaultMaxListeners: number;
  /** @see EventEmitter */
  export function addListener(event: string | symbol, listener: (...args: any[]) => void)
  /** @see EventEmitter */
  export function on(event: string | symbol, listener: (...args: any[]) => void)
  /** @see EventEmitter */
  export function once(event: string | symbol, listener: (...args: any[]) => void)
  /** @see EventEmitter */
  export function prependListener(event: string | symbol, listener: (...args: any[]) => void)
  /** @see EventEmitter */
  export function prependOnceListener(event: string | symbol, listener: (...args: any[]) => void)
  /** @see EventEmitter */
  export function removeListener(event: string | symbol, listener: (...args: any[]) => void)
  /** @see EventEmitter */
  export function removeAllListeners(event?: string | symbol)
  /** @see EventEmitter */
  export function setMaxListeners(n: number)
  /** @see EventEmitter */
  export function getMaxListeners(): number;
  /** @see EventEmitter */
  export function listeners(event: string | symbol): Function[];
  /** @see EventEmitter */
  export function emit(event: string | symbol, ...args: any[]): boolean;
  /** @see EventEmitter */
  export function eventNames(): Array<string | symbol>;
  /** @see EventEmitter */
  export function listenerCount(type: string | symbol): number;
}
type NPMLOG = typeof NPMLog
/**
 * @module npmlog This logger is very basic. It does the logging for npm. It supports custom levels and colored output.
 */
declare module 'npmlog' {
  export default NPMLog
}
