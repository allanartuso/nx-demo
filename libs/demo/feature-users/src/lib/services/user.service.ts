import { Injectable } from '@angular/core';
import { RestService } from '@demo/shared/acm/data-access/common';
import { Observable } from 'rxjs';
import { UserDto } from '../models/user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly restService: RestService) {}

  loadResource(id: string): Observable<UserDto> {
    return this.restService.loadResource<UserDto>(id);
  }

  saveResource(user: UserDto): Observable<UserDto> {
    return this.restService.updateResource(user.id, user);
  }

  deleteResource(id: string): Observable<UserDto> {
    return this.restService.deleteResource(id);
  }
}
