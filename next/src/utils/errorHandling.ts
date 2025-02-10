export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: unknown) => {
  console.error('API Error:', error);
  
  if (error instanceof AppError) {
    return new Response(
      JSON.stringify({
        error: error.message,
        code: error.code
      }),
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return new Response(
      JSON.stringify({
        error: error.message,
        code: 'INTERNAL_SERVER_ERROR'
      }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({
      error: 'An unexpected error occurred',
      code: 'INTERNAL_SERVER_ERROR'
    }),
    { status: 500 }
  );
};

export interface SqlError extends Error {
  original?: {
    code?: string;
  };
}

export const ErrorCodes = {
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  MISSING_FILE: 'MISSING_FILE',
  PYTHON_ENV_ERROR: 'PYTHON_ENV_ERROR',
  DEADLOCK: 'ER_LOCK_DEADLOCK',
  SQL_ERROR: 'SQL_ERROR',
  FILE_READ_ERROR: 'FILE_READ_ERROR',
  FILE_WRITE_ERROR: 'FILE_WRITE_ERROR',
  FILE_SAVE_ERROR: 'FILE_SAVE_ERROR',
} as const;

export const isDeadlockError = (error: SqlError) => {
  return (
    error instanceof Error &&
    'original' in error &&
    error.original?.code === ErrorCodes.DEADLOCK
  );
};