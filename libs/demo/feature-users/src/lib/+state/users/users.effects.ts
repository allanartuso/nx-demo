import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AbstractListEffects } from '@demo/shared/util-store';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UserDto } from '../../models/user.dto';
import { UserService } from '../../services/user.service';
import { listActions } from './users.actions';
import { listSelectors } from './users.selectors';

@Injectable()
export class UsersEffects extends AbstractListEffects<UserDto> {
  texts = {
    deleteConfirmationTitle: 'Delete users',
    deleteConfirmationMessage: 'Are you sure to delete the selected users?',
    deletedMessage: 'The users were deleted successfully.'
  };

  constructor(
    router: Router,
    actions$: Actions,
    store: Store,
    snackBar: MatSnackBar,
    usersService: UserService,
    dialog: MatDialog
  ) {
    super(router, actions$, store, snackBar, usersService, listActions, listSelectors, dialog);
  }
}
