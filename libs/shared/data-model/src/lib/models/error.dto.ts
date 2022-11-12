export interface ErrorDto {
  statusCode: number;
  error: string;
  message?: string;
  fieldErrors?: FieldErrorDto[];
}

export interface FieldErrorDto {
  field: string;
  codes: string[];
  messages: string[];
}
