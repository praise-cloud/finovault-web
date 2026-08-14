export interface ApiError {
  code: string;
  message: string;
  details?: unknown[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  meta?: {
    requestId?: string;
    [key: string]: unknown;
  };
}

export class ApiClientError extends Error {
  code: string;
  details?: unknown[];

  constructor(code: string, message: string, details?: unknown[]) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.details = details;
  }
}

export const ApiErrorCodes = {
  VALIDATION: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL: 'INTERNAL_SERVER_ERROR',
  NETWORK: 'NETWORK_ERROR',
} as const;