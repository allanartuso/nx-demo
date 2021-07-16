import { Injectable } from '@angular/core';
import { createResourcePath, FormService, GLOBAL_TENANT_ID, RestService } from '@arviem/shared/acm/data-access/common';
import { RequestOptions } from '@arviem/shared/data-access';
import { Observable } from 'rxjs';
import { CreateUserDto, UpdateUserDto, UserDto, USERS_RESOURCE_BASE_PATH } from '../models/user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService implements FormService<UserDto, CreateUserDto, UpdateUserDto> {
  constructor(private readonly restService: RestService) {}

  loadResource(resourceId: string): Observable<UserDto> {
    return this.restService.loadResource<UserDto>(resourceId);
  }

  loadUsers(requestOptions: RequestOptions): Observable<UserDto[]> {
    return this.restService.loadResources<UserDto>(
      createResourcePath(GLOBAL_TENANT_ID, USERS_RESOURCE_BASE_PATH),
      requestOptions
    );
  }

  createResource(tenantId: number, user: CreateUserDto): Observable<UserDto> {
    return this.restService.createResource(createResourcePath(GLOBAL_TENANT_ID, USERS_RESOURCE_BASE_PATH), user);
  }

  saveResource(user: UpdateUserDto): Observable<UserDto> {
    return this.restService.updateResource(user.resourceId, user);
  }

  deleteResource(resourceId: string): Observable<UserDto> {
    return this.restService.deleteResource(resourceId);
  }
}
