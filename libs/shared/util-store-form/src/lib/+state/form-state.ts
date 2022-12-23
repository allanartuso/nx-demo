import { Action, createFeatureSelector } from '@ngrx/store';
import { FormState } from '../models/form.model';
import { createFormActions } from './form-actions';
import { createFormReducer } from './form-reducer';
import { createFormSelectors } from './form-selectors';

export function createFormState<T, E>(featureName: string) {
  const actions = createFormActions<T, E>(featureName);
  const reducer = createFormReducer(actions);
  const getState = createFeatureSelector<FormState<T, E>>(featureName);
  const selectors = createFormSelectors(getState);

  return {
    actions,
    reducer: (state: FormState<T, E>, action: Action): FormState<T, E> => reducer(state, action),
    selectors
  };
}
