import { ErrorDto, PagingOptions, RequestState } from '@demo/shared/data-model';
import { ActionCreator, createAction, on, ReducerTypes } from '@ngrx/store';

export interface ApiRequestState {
  requestState: RequestState;
  error: ErrorDto;
}

export interface LoadingState {
  loadingState: RequestState;
}

export function createRequestStateActionHandlers<T extends ApiRequestState>(
  loadAction: ActionCreator,
  saveAction: ActionCreator,
  saveSuccessAction: ActionCreator,
  saveFailureAction: ActionCreator<string, (props: { error: ErrorDto }) => { error: ErrorDto }>
): ReducerTypes<T, ActionCreator[]>[] {
  if (!loadAction) {
    loadAction = createAction('DummyRequestStateLoadAction');
  }

  return [
    on(loadAction, state => ({ ...state, requestState: RequestState.IDLE })),
    on(saveAction, state => ({
      ...state,
      requestState: RequestState.IN_PROGRESS,
      error: undefined
    })),
    on(saveSuccessAction, state => ({ ...state, requestState: RequestState.SUCCESS })),
    on(saveFailureAction, (state, { error }) => ({
      ...state,
      requestState: RequestState.FAILURE,
      error: error
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

export function getLastPageNumber<T>(summaries: T[], pagingOptions: PagingOptions): number {
  if (!summaries.length) {
    return pagingOptions.page - 1;
  }

  if (summaries.length < pagingOptions.pageSize) {
    return pagingOptions.page;
  }

  return undefined;
}
