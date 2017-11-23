declare type Contextual = string | number | Array<string> | Array<number> | void

declare type Context = Contextual | ((...args: Array<any>) => Contextual)
