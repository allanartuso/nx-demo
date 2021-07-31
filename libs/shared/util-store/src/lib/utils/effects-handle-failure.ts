import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, ActionCreator } from '@ngrx/store';
import { filter, tap } from 'rxjs/operators';

export function handleFailureEffect<T extends { generalErrors: string[] }>(
  actions$: Actions<Action>,
  ...actions: ActionCreator<string, (props: { error: T }) => { error: T }>[]
) {
  return createEffect(
    () =>
      actions$.pipe(
        ofType(...actions),
        filter(({ error }: { error: { generalErrors: string[] } }) => !!error.generalErrors?.length),
        tap(({ error }: { error: { generalErrors: string[] } }) => {
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
