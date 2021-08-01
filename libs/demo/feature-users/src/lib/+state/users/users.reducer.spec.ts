const mockReducerFunction = jest.fn();
jest.mock('@demo/acm/feature/common/list', () => ({
  createListEntityAdapter: jest.fn(),
  createListActions: jest.fn(),
  createListReducer: jest.fn().mockReturnValue(mockReducerFunction)
}));

import {
  createListActions,
  createListEntityAdapter,
  createListReducer,
  ListState
} from '@demo/acm/feature/common/list';
import { UserDto } from '@demo/shared/acm/data-access/users';
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
