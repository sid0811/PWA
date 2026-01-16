declare module 'sql.js' {
  export interface SqlJsStatic {
    Database: typeof Database;
  }

  export interface QueryExecResult {
    columns: string[];
    values: unknown[][];
  }

  export interface ParamsObject {
    [key: string]: string | number | null | Uint8Array;
  }

  export type BindParams = ParamsObject | (string | number | null | Uint8Array)[];

  export class Database {
    constructor(data?: ArrayLike<number> | Buffer | null);
    run(sql: string, params?: BindParams): Database;
    exec(sql: string, params?: BindParams): QueryExecResult[];
    each(sql: string, params: BindParams, callback: (row: ParamsObject) => void, done?: () => void): Database;
    each(sql: string, callback: (row: ParamsObject) => void, done?: () => void): Database;
    prepare(sql: string, params?: BindParams): Statement;
    export(): Uint8Array;
    close(): void;
    getRowsModified(): number;
    create_function(name: string, func: (...args: unknown[]) => unknown): Database;
    create_aggregate(name: string, functions: { init?: () => unknown; step: (state: unknown, ...args: unknown[]) => unknown; finalize: (state: unknown) => unknown }): Database;
  }

  export class Statement {
    bind(params?: BindParams): boolean;
    step(): boolean;
    getColumnNames(): string[];
    getAsObject(params?: ParamsObject): ParamsObject;
    get(params?: BindParams): unknown[];
    run(params?: BindParams): void;
    reset(): void;
    free(): boolean;
  }

  export interface SqlJsConfig {
    locateFile?: (filename: string) => string;
  }

  export default function initSqlJs(config?: SqlJsConfig): Promise<SqlJsStatic>;
}
