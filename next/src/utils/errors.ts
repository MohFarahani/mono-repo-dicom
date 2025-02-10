export interface SqlError extends Error {
    original?: {
      code?: string;
    };
  }
  
  export const isDeadlockError = (error: SqlError) => {
    return (
      error instanceof Error &&
      'original' in error &&
      error.original?.code === 'ER_LOCK_DEADLOCK'
    );
  };