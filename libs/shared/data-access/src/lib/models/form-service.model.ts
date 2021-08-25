import { ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';

export interface FormService<T> {
  loadResource(id: string): Observable<T>;

  saveResource?(resource: T): Observable<T>;

  deleteResource?(id: string): Observable<void>;

  createResource?(resource: T): Observable<T>;
}

export interface FieldError {
  errors: ValidationErrors;
  fieldName: string;
  fieldIndex?: number;
}

export interface FieldErrors {
  [key: string]: FieldError[] | FieldErrors;
}
