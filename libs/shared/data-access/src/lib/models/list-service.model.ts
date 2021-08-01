import { Observable } from 'rxjs';
import { RequestOptions } from './request-options.model';

export interface ListErrors {
  generalErrors: string[];
}

export interface BulkOperationSuccess {
  index: number;
  response: unknown;
}

export interface ListService<T, S = T> {
  queryResources(options: RequestOptions): Observable<S[]>;

  deleteResources(resourceIds: string[]): Observable<Array<T | ListErrors>>;

  patchResources?(resourceIds: string[], resource: Partial<T>): Observable<Array<T | ListErrors>>;
}
