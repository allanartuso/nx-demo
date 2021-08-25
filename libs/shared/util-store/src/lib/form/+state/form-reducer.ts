/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestState } from '@demo/shared/data-access';
import { ActionCreator, ActionReducer, createReducer, Creator, on, ReducerTypes } from '@ngrx/store';
import { createLoadingStateActionHandlers, createRequestStateActionHandlers } from '../../utils/action-handlers';
import { FormActions, FormState } from '../models/form.model';

export function createFormReducer<T>(
  actions: FormActions<T>,
  actionHandlers?: ReducerTypes<FormState<T>, ActionCreator[]>[],
  initialFormState?: object
): ActionReducer<FormState<T>> {
  const initialState: FormState<T> = { ...createInitialFormState<T>(), ...initialFormState };
  return createReducer<FormState<T>>(
    initialState,
    ...createFormActionHandlers<T>(initialState, actions),
    ...(actionHandlers || [])
  );
}

function createInitialFormState<T>(): FormState<T> {
  return {
    resource: undefined,
    loadingState: RequestState.IDLE,
    requestState: RequestState.IDLE,
    error: undefined
  };
}

function createFormActionHandlers<T>(
  initialFormState: FormState<T>,
  actions: FormActions<T>
): ReducerTypes<FormState<T>, ActionCreator<string, Creator<any[], object>>[]>[] {
  return [
    on(actions.reset, (): FormState<T> => initialFormState),
    on(
      actions.loadSuccess,
      actions.createSuccess,
      actions.saveSuccess,
      (state: FormState<T>, { resource }): FormState<T> => ({ ...state, resource })
    ),
    on(
      actions.deleteSuccess,
      (state: FormState<T>): FormState<T> => ({
        ...state,
        resource: undefined
      })
    ),
    on(
      actions.copy,
      (state: FormState<T>): FormState<T> => ({
        ...state,
        loadingState: RequestState.IDLE,
        requestState: RequestState.IDLE
      })
    ),
    ...createRequestStateActionHandlers<FormState<T>>(
      actions.load,
      actions.save,
      actions.saveSuccess,
      actions.saveFailure
    ),
    ...createRequestStateActionHandlers<FormState<T>>(
      undefined,
      actions.create,
      actions.createSuccess,
      actions.createFailure
    ),
    ...createRequestStateActionHandlers<FormState<T>>(
      undefined,
      actions.delete,
      actions.deleteSuccess,
      actions.deleteFailure
    ),
    ...createLoadingStateActionHandlers<FormState<T>>(actions.load, actions.loadSuccess, actions.loadFailure)
  ];
}
