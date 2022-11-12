const mockReducerFunction = jest.fn();
jest.mock('@demo/shared/util-store', () => ({
  createFormActions: jest.fn(),
  createFormReducer: jest.fn().mockReturnValue(mockReducerFunction)
}));

import { UserDto } from '@demo/demo/data-model/users';
import { createFormActions, createFormReducer, FormState } from '@demo/shared/util-store';
import { Action } from '@ngrx/store';
import { userReducer } from './user.reducer';

describe('UserReducer', () => {
  beforeEach(() => {
    mockReducerFunction.mockReset();
  });

  it('creates the user reducer function correctly', () => {
    const testFormState = {} as FormState<UserDto>;
    const testAction = {} as Action;

    userReducer(testFormState, testAction);

    expect(createFormActions).toHaveBeenCalled();
    expect(createFormReducer).toHaveBeenCalled();
    expect(mockReducerFunction).toHaveBeenCalledWith(testFormState, testAction);
  });
});
