import { RequestState } from '@demo/shared/data-model/common';
import { createLoadingStateActionHandlers, createRequestStateActionHandlers } from '@demo/shared/util-store-common';
import { ActionCreator, ActionReducer, createReducer, Creator, on, ReducerTypes } from '@ngrx/store';
import { FormActions, FormState } from '../models/form.model';

export function createFormReducer<T, E>(
  actions: FormActions<T, E>,
  actionHandlers?: ReducerTypes<FormState<T, E>, ActionCreator[]>[],
  initialFormState?: object
): ActionReducer<FormState<T, E>> {
  const initialState: FormState<T, E> = { ...createInitialFormState<T, E>(), ...initialFormState };
  return createReducer<FormState<T, E>>(
    initialState,
    ...createFormActionHandlers<T, E>(initialState, actions),
    ...(actionHandlers || [])
  );
}

function createInitialFormState<T, E>(): FormState<T, E> {
  return {
    resource: undefined,
    loadingState: RequestState.IDLE,
    requestState: RequestState.IDLE,
    errors: undefined
  };
}

function createFormActionHandlers<T, E>(
  initialFormState: FormState<T, E>,
  actions: FormActions<T, E>
): ReducerTypes<FormState<T, E>, ActionCreator<string, Creator<any[], object>>[]>[] {
  return [
    on(actions.reset, (): FormState<T, E> => initialFormState),
    on(
      actions.loadSuccess,
      actions.createSuccess,
      actions.saveSuccess,
      (state: FormState<T, E>, { resource }): FormState<T, E> => ({ ...state, resource })
    ),
    on(
      actions.deleteSuccess,
      (state: FormState<T, E>): FormState<T, E> => ({
        ...state,
        resource: undefined
      })
    ),
    on(
      actions.copy,
      (state: FormState<T, E>): FormState<T, E> => ({
        ...state,
        loadingState: RequestState.IDLE,
        requestState: RequestState.IDLE
      })
    ),
    ...createRequestStateActionHandlers<FormState<T, E>, E>(
      actions.load,
      actions.save,
      actions.saveSuccess,
      actions.saveFailure
    ),
    ...createRequestStateActionHandlers<FormState<T, E>, E>(
      undefined,
      actions.create,
      actions.createSuccess,
      actions.createFailure
    ),
    ...createRequestStateActionHandlers<FormState<T, E>, E>(
      undefined,
      actions.delete,
      actions.deleteSuccess,
      actions.deleteFailure
    ),
    ...createLoadingStateActionHandlers<FormState<T, E>>(actions.load, actions.loadSuccess, actions.loadFailure)
  ];
}
