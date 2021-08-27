import { Injectable } from '@angular/core';
import { ErrorDto, FormService, ListService, RequestOptions, RestService } from '@demo/shared/data-access';
import { Observable } from 'rxjs';
import { UserDto, USERS_RESOURCE_BASE_PATH } from '../models/user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService implements FormService<UserDto>, ListService<UserDto> {
  constructor(private readonly restService: RestService) {}

  loadResource(id: string): Observable<UserDto> {
    return this.restService.loadResource<UserDto>(`${USERS_RESOURCE_BASE_PATH}/${id}`);
  }

  createResource(user: UserDto): Observable<UserDto> {
    return this.restService.createResource(USERS_RESOURCE_BASE_PATH, user);
  }

  saveResource(user: UserDto): Observable<UserDto> {
    return this.restService.updateResource(`${USERS_RESOURCE_BASE_PATH}/${user.id}`, user);
  }

  deleteResource(id: string): Observable<void> {
    return this.restService.deleteResource(`${USERS_RESOURCE_BASE_PATH}/${id}`);
  }

  queryResources(options: RequestOptions): Observable<UserDto[]> {
    return this.restService.queryResources(USERS_RESOURCE_BASE_PATH, options);
  }

  deleteResources(ids: string[]): Observable<Array<ErrorDto>> {
    return this.restService.deleteResources(USERS_RESOURCE_BASE_PATH, ids);
  }

  patchResources?(ids: string[], resource: Partial<UserDto>): Observable<Array<UserDto | ErrorDto>> {
    return this.restService.patchResources(
      USERS_RESOURCE_BASE_PATH,
      ids.map(id => ({ id, resource }))
    );
  }
}
