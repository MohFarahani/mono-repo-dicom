export interface SqlError extends Error {
    code?: string;
    errno?: number;
    sqlState?: string;
    sqlMessage?: string;
    sql?: string;
    parameters?: unknown[];
    original?: {
      code: string;
      errno: number;
      sqlState: string;
      sqlMessage: string;
      sql: string;
      parameters: unknown[];
    };
  }