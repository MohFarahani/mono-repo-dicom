export interface SqlError extends Error {
  code: string;
  errno: number;
  sqlMessage: string;
  sqlState: string;
  sql: string;
} 