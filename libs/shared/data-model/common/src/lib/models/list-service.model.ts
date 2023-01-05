import { Observable } from 'rxjs';
import { ErrorDto } from './error.dto';
import { RequestOptions } from './request-options.model';

export interface BulkOperationSuccess {
  index: number;
  response: unknown;
}

export interface ListService<T, S = T> {
  queryResources(options: RequestOptions): Observable<S[]>;

  deleteResources(resourceIds: string[]): Observable<Array<T | ErrorDto>>;

  patchResources?(resourceIds: string[], resource: Partial<T>): Observable<Array<T | ErrorDto>>;
}

export interface ListNotificationService {
  openConfirmationDialog: (data: { message: string; title: string }) => Observable<boolean>;
}
