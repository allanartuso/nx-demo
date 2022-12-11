/* eslint-disable @typescript-eslint/ban-types */
import { RequestState } from '@demo/shared/data-model';
import { createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { FormSelectors, FormState } from '../models/form.model';

export function createFormSelectors<T, E>(
  getFormState: MemoizedSelector<object, FormState<T, E>, DefaultProjectorFn<FormState<T, E>>>
): FormSelectors<T, E> {
  const getRequestState = createSelector(getFormState, state => state.requestState);
  const getLoadingState = createSelector(getFormState, state => state.loadingState);
  const getErrors = createSelector(getFormState, state => state.errors);
  const getResource = createSelector(getFormState, state => state.resource);

  const isReady = createSelector(
    getResource,
    getLoadingState,
    (resource, loadingState) => !!resource && loadingState === RequestState.SUCCESS
  );

  return {
    getRequestState,
    getLoadingState,
    getErrors,
    getResource,
    isReady
  };
}
