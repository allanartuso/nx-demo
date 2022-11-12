import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDto } from '@demo/shared/data-model';
import { errorFixture } from '@demo/shared/data-model/test';
import { Action, createAction, props } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { handleFailureEffect } from './effects-handle-failure';

const loadFailureAction = createAction('[Action Handlers Test] Load Failure Action', props<{ error: ErrorDto }>());
const saveFailureAction = createAction('[Action Handlers Test] Save Failure Action', props<{ error: ErrorDto }>());

describe('handle effects failures', () => {
  let actions$: Observable<Action>;

  const errorDto: ErrorDto = errorFixture.createErrorDto();
  const mockSnackBar = { open: jest.fn() } as unknown as MatSnackBar;

  describe('handleFailure$', () => {
    it('emit a notification action when it contains general errors', () => {
      actions$ = hot('a', { a: loadFailureAction({ error: errorDto }) });
      const expected = hot('a', { a: loadFailureAction({ error: errorDto }) });

      expect(handleFailureEffect(mockSnackBar, actions$, saveFailureAction, loadFailureAction)).toBeObservable(
        expected
      );
    });
  });
});
