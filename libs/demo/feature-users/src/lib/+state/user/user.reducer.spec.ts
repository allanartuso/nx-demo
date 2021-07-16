const mockReducerFunction = jest.fn();
jest.mock('@arviem/acm/feature/common/form', () => ({
  createFormActions: jest.fn(),
  createFormReducer: jest.fn().mockReturnValue(mockReducerFunction)
}));

import { createFormActions, createFormReducer, FormState } from '@arviem/acm/feature/common/form';
import { UserDto } from '@arviem/shared/acm/data-access/users';
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
