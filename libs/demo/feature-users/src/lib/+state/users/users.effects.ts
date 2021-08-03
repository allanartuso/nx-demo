import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ListErrors } from '@demo/shared/data-access';
import { ConfirmationDialogComponent } from '@demo/shared/ui-notification';
import { AbstractListEffects } from '@demo/shared/util-store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator, select, Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { UserDto } from '../../models/user.dto';
import { UserService } from '../../services/user.service';
import { listActions } from './users.actions';
import { listSelectors } from './users.selectors';

@Injectable()
export class UsersEffects extends AbstractListEffects<UserDto> {
  showRemovalsDialog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(listActions.showRemovalsConfirmation),
      switchMap(() => {
        const dialog = this.dialog.open(ConfirmationDialogComponent, {
          data: { message: 'Are you sure to delete the selected users?', title: 'Delete users' }
        });
        return dialog.afterClosed();
      }),
      filter(confirmed => confirmed),
      withLatestFrom(this.store.pipe(select(listSelectors.getSelectedResourceIds))),
      map(([, resourceIds]) => listActions.delete({ resourceIds }))
    )
  );

  constructor(
    router: Router,
    actions$: Actions,
    store: Store,
    snackBar: MatSnackBar,
    usersService: UserService,
    private readonly dialog: MatDialog
  ) {
    super(router, actions$, store, snackBar, usersService, listActions, listSelectors);
  }

  addGeneralErrorsArguments$(
    errors: ListErrors,
    failureAction: ActionCreator<string, ({ error }: { error: ListErrors }) => TypedAction<string>>
  ): Observable<TypedAction<string>> {
    return of(failureAction({ error: errors }));
  }
}
