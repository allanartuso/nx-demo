/* eslint-disable @typescript-eslint/ban-types */
import { RequestState } from '@demo/shared/data-access';
import { createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { FormSelectors, FormState } from '../models/form.model';

export function createFormSelectors<T>(
  getFormState: MemoizedSelector<object, FormState<T>, DefaultProjectorFn<FormState<T>>>
): FormSelectors<T> {
  const getRequestState = createSelector(getFormState, state => state.requestState);
  const getLoadingState = createSelector(getFormState, state => state.loadingState);
  const getFieldErrors = createSelector(getFormState, state => state.fieldErrors);
  const getResource = createSelector(getFormState, state => state.resource);

  const isReady = createSelector(
    getResource,
    getLoadingState,
    (resource, loadingState) => !!resource && loadingState === RequestState.SUCCESS
  );

  return {
    getRequestState,
    getLoadingState,
    getFieldErrors,
    getResource,
    isReady
  };
}
