import { BulkOperationSuccess, PagingOptions, RequestState } from '@demo/shared/data-access';
import { ActionCreator, createAction, on, ReducerTypes } from '@ngrx/store';

export interface ApiRequestState {
  requestState: RequestState;
  errors: any;
  bulkOperationSuccesses?: BulkOperationSuccess[];
}

export interface LoadingState {
  loadingState: RequestState;
}

export function createRequestStateActionHandlers<T extends ApiRequestState>(
  loadAction: ActionCreator,
  saveAction: ActionCreator,
  saveSuccessAction: ActionCreator,
  saveFailureAction: ActionCreator<string, (props: { error: any }) => { error: any }>
): ReducerTypes<T, ActionCreator[]>[] {
  if (!loadAction) {
    loadAction = createAction('DummyRequestStateLoadAction');
  }

  return [
    on(loadAction, (state): any => ({ ...state, requestState: RequestState.IDLE })),
    on(saveAction, (state): any => ({
      ...state,
      requestState: RequestState.IN_PROGRESS,
      errors: {},
      bulkOperationSuccesses: undefined
    })),
    on(saveSuccessAction, (state): any => ({ ...state, requestState: RequestState.SUCCESS })),
    on(saveFailureAction, (state, { error }): any => ({
      ...state,
      requestState: RequestState.FAILURE,
      errors: error?.fieldErrors,
      bulkOperationSuccesses: error?.successes
    }))
  ];
}

export function createLoadingStateActionHandlers<T extends LoadingState>(
  loadAction: ActionCreator,
  loadSuccessAction: ActionCreator,
  loadFailureAction: ActionCreator
): ReducerTypes<T, ActionCreator[]>[] {
  return [
    on(loadAction, (state): any => ({ ...state, loadingState: RequestState.IN_PROGRESS })),
    on(loadSuccessAction, (state): any => ({ ...state, loadingState: RequestState.SUCCESS })),
    on(loadFailureAction, (state): any => ({ ...state, loadingState: RequestState.FAILURE }))
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
