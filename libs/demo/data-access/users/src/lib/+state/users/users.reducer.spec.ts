const mockReducerFunction = jest.fn();
jest.mock('@demo/shared/util-store', () => ({
  createListEntityAdapter: jest.fn(),
  createListActions: jest.fn(),
  createListReducer: jest.fn().mockReturnValue(mockReducerFunction)
}));

import { UserDto } from '@demo/demo/data-model/users';
import { createListActions, createListEntityAdapter, createListReducer, ListState } from '@demo/shared/util-store';
import { Action } from '@ngrx/store';
import { usersReducer } from './users.reducer';

describe('UsersReducer', () => {
  beforeEach(() => {
    mockReducerFunction.mockReset();
  });

  it('creates the user reducer function correctly', () => {
    const testListState = {} as ListState<UserDto>;
    const testAction = {} as Action;

    usersReducer(testListState, testAction);

    expect(createListEntityAdapter).toHaveBeenCalled();
    expect(createListActions).toHaveBeenCalled();
    expect(createListReducer).toHaveBeenCalled();
    expect(mockReducerFunction).toHaveBeenCalledWith(testListState, testAction);
  });
});
