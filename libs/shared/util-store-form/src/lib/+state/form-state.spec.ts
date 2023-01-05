const mockActions = 'mockActions';
jest.mock('./form-actions', () => ({
  createFormActions: jest.fn().mockReturnValue(mockActions)
}));

const mockReducer = 'mockReducer';
jest.mock('./form-reducer', () => ({
  createFormReducer: jest.fn().mockReturnValue(() => mockReducer)
}));

const mockSelectors = 'mockSelectors';
jest.mock('./form-selectors', () => ({
  createFormSelectors: jest.fn().mockReturnValue(mockSelectors)
}));

const mockFeatureSelector = 'mockFeatureSelector';
jest.mock('@ngrx/store', () => ({
  createFeatureSelector: jest.fn().mockReturnValue(mockFeatureSelector)
}));

import { createFeatureSelector } from '@ngrx/store';
import { createFormActions } from './form-actions';
import { createFormReducer } from './form-reducer';
import { createFormSelectors } from './form-selectors';
import { createFormState } from './form-state';

describe('formState', () => {
  const featureName = 'testFeatureName';
  const { actions, reducer, selectors } = createFormState(featureName);

  it('create form actions', () => {
    expect(createFormActions).toHaveBeenCalledWith(featureName);
  });

  it('create form reducer', () => {
    expect(createFormReducer).toHaveBeenCalledWith(actions);
    expect(reducer(undefined, { type: '' })).toBe(mockReducer);
  });

  it('create form selectors', () => {
    expect(createFeatureSelector).toHaveBeenCalledWith(featureName);
    expect(createFormSelectors).toHaveBeenCalledWith(mockFeatureSelector);
    expect(selectors).toStrictEqual(mockSelectors);
  });
});
