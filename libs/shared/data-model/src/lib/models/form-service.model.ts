import { ValidationErrors } from '@angular/forms';

export interface FieldError {
  errors: ValidationErrors;
  fieldName: string;
  fieldIndex?: number;
}

export interface FieldErrors {
  [key: string]: FieldError[] | FieldErrors;
}
