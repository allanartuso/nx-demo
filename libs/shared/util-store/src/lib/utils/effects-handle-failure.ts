import { ErrorDto } from '@demo/shared/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, ActionCreator } from '@ngrx/store';
import { filter, tap } from 'rxjs/operators';

export function handleFailureEffect(
  actions$: Actions<Action>,
  ...actions: ActionCreator<string, (props: { error: ErrorDto }) => { error: ErrorDto }>[]
) {
  return createEffect(
    () =>
      actions$.pipe(
        ofType(...actions),
        filter(({ error }: { error: ErrorDto }) => !!error.message),
        tap(({ error }: { error: ErrorDto }) => {
          console.log(error);
        })

        // map(({ error }: { error: { generalErrors: string[] } }) =>
        //   displayUserNotificationAction({
        //     messages: error.generalErrors
        //   })
        // )
      ),
    { dispatch: false }
  );
}
