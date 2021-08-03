import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AbstractFormEffects } from '@demo/shared/util-store';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UserDto } from '../../models/user.dto';
import { UserService } from '../../services/user.service';
import { formActions } from './user.actions';

@Injectable()
export class UserEffects extends AbstractFormEffects<UserDto> {
  constructor(router: Router, actions$: Actions, store: Store, userService: UserService, snackBar: MatSnackBar) {
    super(router, actions$, store, userService, formActions, snackBar);
  }
}
