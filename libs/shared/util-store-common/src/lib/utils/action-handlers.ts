import { ActionCreator, createAction, on, ReducerTypes } from '@ngrx/store';
import { RequestState } from '../request-state.model';

export interface ApiRequestState<E> {
  requestState: RequestState;
  errors: E;
}

export interface LoadingState {
  loadingState: RequestState;
}

export function createRequestStateActionHandlers<T extends ApiRequestState<E>, E>(
  loadAction: ActionCreator,
  saveAction: ActionCreator,
  saveSuccessAction: ActionCreator,
  saveFailureAction: ActionCreator<string, (props: { errors: E }) => { errors: E }>
): ReducerTypes<T, ActionCreator[]>[] {
  if (!loadAction) {
    loadAction = createAction('DummyRequestStateLoadAction');
  }

  return [
    on(loadAction, state => ({ ...state, requestState: RequestState.IDLE })),
    on(saveAction, state => ({
      ...state,
      requestState: RequestState.IN_PROGRESS,
      errors: undefined
    })),
    on(saveSuccessAction, state => ({ ...state, requestState: RequestState.SUCCESS })),
    on(saveFailureAction, (state, { errors }) => ({
      ...state,
      requestState: RequestState.FAILURE,
      errors
    }))
  ];
}

export function createLoadingStateActionHandlers<T extends LoadingState>(
  loadAction: ActionCreator,
  loadSuccessAction: ActionCreator,
  loadFailureAction: ActionCreator
): ReducerTypes<T, ActionCreator[]>[] {
  return [
    on(loadAction, state => ({ ...state, loadingState: RequestState.IN_PROGRESS })),
    on(loadSuccessAction, state => ({ ...state, loadingState: RequestState.SUCCESS })),
    on(loadFailureAction, state => ({ ...state, loadingState: RequestState.FAILURE }))
  ];
}
