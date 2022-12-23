import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserDto } from '@demo/demo/data-model/users';
import { ErrorDto } from '@demo/shared/data-model';
import { FormNotificationService } from '@demo/shared/util-notification';
import { AbstractFormEffects } from '@ngdux/form';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UserService } from '../../services/user.service';
import { userActions } from './user.state';

@Injectable()
export class UserEffects extends AbstractFormEffects<UserDto, ErrorDto> {
  constructor(
    router: Router,
    actions$: Actions,
    store: Store,
    userService: UserService,
    formNotificationService: FormNotificationService
  ) {
    super(router, actions$, store, userService, userActions, formNotificationService);
  }
}
