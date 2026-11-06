export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFieldError {
  path: string;
  message: string;
}

export interface ApiErrorBody {
  success: false;
  error: {
    message: string;
    code: string;
    details?: ApiFieldError[];
  };
}

export const isApiErrorBody = (value: unknown): value is ApiErrorBody =>
  typeof value === "object" &&
  value !== null &&
  "success" in value &&
  value.success === false &&
  "error" in value &&
  typeof value.error === "object" &&
  value.error !== null;
