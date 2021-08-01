import { Injectable } from '@angular/core';
import { FormService, ListErrors, ListService, RequestOptions, RestService } from '@demo/shared/data-access';
import { Observable, of } from 'rxjs';
import { UserDto, USERS_RESOURCE_BASE_PATH } from '../models/user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService implements FormService<UserDto>, ListService<UserDto> {
  constructor(private readonly restService: RestService) {}

  loadResource(id: string): Observable<UserDto> {
    console.log('loadResource', id);
    return of({
      id,
      email: 'allan.artuso@gmail.com',
      firstName: 'Allan',
      lastName: 'Artuso'
    });

    return this.restService.loadResource<UserDto>(`${USERS_RESOURCE_BASE_PATH}/${id}`);
  }

  saveResource(user: UserDto): Observable<UserDto> {
    console.log('saveResource', user.id, user);
    return of(user);

    return this.restService.updateResource(`${USERS_RESOURCE_BASE_PATH}/${user.id}`, user);
  }

  deleteResource(id: string): Observable<void> {
    console.log('deleteResource', id);
    return of();

    return this.restService.deleteResource(`${USERS_RESOURCE_BASE_PATH}/${id}`);
  }

  queryResources(options: RequestOptions): Observable<UserDto[]> {
    console.log(options);

    return of([
      {
        id: '1',
        email: 'allan.artuso@gmail.com',
        firstName: 'Allan',
        lastName: 'Artuso'
      },
      {
        id: '2',
        email: 'b.ramos@hotmail.com',
        firstName: 'B',
        lastName: 'Ramos'
      }
    ]);

    return this.restService.queryResources(USERS_RESOURCE_BASE_PATH, options);
  }

  deleteResources(ids: string[]): Observable<Array<ListErrors>> {
    return of([
      {
        generalErrors: []
      },
      {
        generalErrors: []
      }
    ]);

    return this.restService.deleteResources(USERS_RESOURCE_BASE_PATH, ids);
  }

  patchResources?(ids: string[], resource: Partial<UserDto>): Observable<Array<UserDto | ListErrors>> {
    return of([
      {
        id: '1',
        email: 'allan.artuso@gmail.com',
        firstName: 'Allan',
        lastName: 'Artuso'
      },
      {
        id: '2',
        email: 'b.ramos@hotmail.com',
        firstName: 'B',
        lastName: 'Ramos'
      }
    ]);

    return this.restService.patchResources(
      USERS_RESOURCE_BASE_PATH,
      ids.map(id => ({ id, resource }))
    );
  }
}
