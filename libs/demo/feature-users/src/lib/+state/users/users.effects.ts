import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ListErrors } from '@demo/shared/data-access';
import { AbstractListEffects } from '@demo/shared/util-store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator, select, Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { Observable, of } from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';
import { UserDto } from '../../models/user.dto';
import { UserService } from '../../services/user.service';
import { listActions } from './users.actions';
import { listSelectors } from './users.selectors';

@Injectable()
export class UsersEffects extends AbstractListEffects<UserDto> {
  showRemovalsDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(listActions.showRemovalsConfirmation),
        withLatestFrom(this.store.pipe(select(listSelectors.getSelected))),
        tap(([, users]) => {
          console.log(users);
        })
      ),
    { dispatch: false }
  );

  deleteUsersSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(listActions.deleteSuccess),
        tap(({ resourceIds }) => {
          console.log(resourceIds);
        })
      ),
    { dispatch: false }
  );

  constructor(router: Router, actions$: Actions, store: Store, usersService: UserService) {
    super(router, actions$, store, usersService, listActions, listSelectors);
  }

  addGeneralErrorsArguments$(
    errors: ListErrors,
    failureAction: ActionCreator<string, ({ error }: { error: ListErrors }) => TypedAction<string>>
  ): Observable<TypedAction<string>> {
    return of(failureAction({ error: errors }));
  }
}
