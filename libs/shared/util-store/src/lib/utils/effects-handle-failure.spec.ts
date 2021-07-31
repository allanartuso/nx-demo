import { displayUserNotificationAction, NotificationType } from '@demo/shared/util-notification';
import { Action, createAction, props } from '@ngrx/store';
import { hot } from '@nrwl/angular/testing';
import { Observable } from 'rxjs';
import { ErrorsDto } from '../models/errors.dto';
import { createFieldError } from '../models/errors.dto.fixture';
import { createFieldErrorsVm, ErrorsVm } from '../models/errors.model';
import { GeneralErrorCode } from '../models/general-error-codes';
import { createPersistentResourceDto } from '../models/resource.dto.fixture';
import { handleFailureEffect } from './effects-handle-failure';

const loadFailureAction = createAction('[Action Handlers Test] Load Failure Action', props<{ error: ErrorsVm }>());

const saveFailureAction = createAction('[Action Handlers Test] Save Failure Action', props<{ error: ErrorsVm }>());

describe('LogoEffects', () => {
  let actions$: Observable<Action>;

  const errorsDto: ErrorsDto = {
    generalErrors: [{ code: GeneralErrorCode.RESOURCE_NOT_FOUND, message: 'testError', arguments: [] }],
    fieldErrors: []
  };
  const errorsVm = new ErrorsVm(errorsDto.generalErrors);

  describe('handleFailure$', () => {
    it('emit a notification action when it contains general errors', () => {
      actions$ = hot('a', { a: loadFailureAction({ error: errorsVm }) });
      const expected = hot('a', {
        a: displayUserNotificationAction({
          messages: errorsVm.generalErrors.map(generalError => ({
            text: generalError.message,
            code: `errors.${generalError.code}`,
            arguments: generalError.arguments,
            type: NotificationType.ERROR,
            i18nScope: generalError.i18nScope
          }))
        })
      });

      expect(handleFailureEffect(actions$, saveFailureAction, loadFailureAction)).toBeObservable(expected);
    });

    it('does not emit any action when it does not contains general errors', () => {
      const fieldError = createFieldError({ ...createPersistentResourceDto(), testField: 'testValue' });
      const fieldErrorsVm = createFieldErrorsVm([fieldError]);
      actions$ = hot('a', {
        a: saveFailureAction({
          error: new ErrorsVm(undefined, fieldErrorsVm)
        })
      });
      const expected = hot('-');

      expect(handleFailureEffect(actions$, saveFailureAction, loadFailureAction)).toBeObservable(expected);
    });
  });
});
