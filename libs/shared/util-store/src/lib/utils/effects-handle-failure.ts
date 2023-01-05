import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDto } from '@ngdux/data-model-common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, ActionCreator } from '@ngrx/store';
import { filter, tap } from 'rxjs/operators';

export function handleFailureEffect(
  snackBar: MatSnackBar,
  actions$: Actions<Action>,
  ...actions: ActionCreator<string, (props: { error: ErrorDto }) => { error: ErrorDto }>[]
) {
  return createEffect(
    () =>
      actions$.pipe(
        ofType(...actions),
        filter(({ error }: { error: ErrorDto }) => !!error.message),
        tap(({ error }: { error: ErrorDto }) => {
          snackBar.open(error.message, 'Ok');
        })
      ),
    { dispatch: false }
  );
}
