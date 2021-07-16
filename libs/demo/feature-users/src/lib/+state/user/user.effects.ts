import { Injectable } from '@angular/core';
import { changePasswordAction, logoutAction } from '@arviem/acm/feature-authentication';
import { AbstractFormEffects } from '@arviem/acm/feature/common/form';
import {
  CreateUserDto,
  PatchUserDto,
  UpdateUserDto,
  UserDto,
  USERS_I18N_SCOPE,
  UserService,
  UserSummaryDto
} from '@arviem/shared/acm/data-access/users';
import { displayConfirmationDialogAction, selectConfirmationDialogResponse } from '@arviem/shared/util-notification';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { exhaustMap, filter, first, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { formActions } from './user.actions';
import { formSelectors } from './user.selectors';

@Injectable()
export class UserEffects extends AbstractFormEffects<
  UserDto,
  CreateUserDto,
  UpdateUserDto,
  PatchUserDto,
  UserSummaryDto
> {
  showRemovalConfirmation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(formActions.showRemovalConfirmation),
      withLatestFrom(this.store.pipe(select(formSelectors.getResource))),
      tap(([action, resource]) => {
        this.store.dispatch(
          displayConfirmationDialogAction({
            settings: {
              i18nScope: USERS_I18N_SCOPE,
              title: 'deleteUserConfirmationTitle',
              message: 'deleteUserConfirmationText',
              label: 'username',
              confirmationInput: true,
              expectedInput: resource.email
            }
          })
        );
      }),
      switchMap(([action, resource]) =>
        this.store.pipe(
          select(selectConfirmationDialogResponse),
          first(confirmation => !!confirmation),
          map(() => formActions.delete({ resourceId: resource.resourceId }))
        )
      )
    )
  );

  showChangePasswordConfirmation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(formActions.showChangePasswordConfirmation),
      tap(() =>
        this.store.dispatch(
          displayConfirmationDialogAction({
            settings: {
              i18nScope: USERS_I18N_SCOPE,
              title: 'changePasswordConfirmationTitle',
              message: 'changePasswordConfirmationText'
            }
          })
        )
      ),
      switchMap(() =>
        this.store.pipe(
          select(selectConfirmationDialogResponse),
          first(confirmation => confirmation !== undefined)
        )
      ),
      filter(confirmation => !!confirmation),
      map(() => changePasswordAction())
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(formActions.deleteSuccess),
      exhaustMap(() =>
        this.store.pipe(
          select(formSelectors.getResource),
          first(currentUser => !currentUser),
          map(() => logoutAction())
        )
      )
    )
  );

  constructor(actions$: Actions, store: Store, userService: UserService) {
    super(actions$, store, userService, formActions, formSelectors, undefined, USERS_I18N_SCOPE);
  }
}
