import { Injectable } from '@angular/core';
import { FormService, RestService } from '@demo/shared/data-access';
import { Observable, of } from 'rxjs';
import { UserDto } from '../models/user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService implements FormService<UserDto> {
  constructor(private readonly restService: RestService) {}

  loadResource(id: string): Observable<UserDto> {
    console.log('loadResource', id);
    return of({
      id,
      email: 'allan.artuso@gmail.com',
      firstName: 'Allan',
      lastName: 'Artuso'
    });

    return this.restService.loadResource<UserDto>(id);
  }

  saveResource(user: UserDto): Observable<UserDto> {
    console.log('saveResource', user.id, user);
    return of(user);

    return this.restService.updateResource(user.id, user);
  }

  deleteResource(id: string): Observable<void> {
    console.log('deleteResource', id);
    return of();

    return this.restService.deleteResource(id);
  }
}
