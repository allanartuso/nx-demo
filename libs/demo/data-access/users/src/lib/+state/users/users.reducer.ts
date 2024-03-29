import { UserDto } from '@demo/demo/data-model/users';
import { createListEntityAdapter, createListReducer, ListState } from '@demo/shared/util-store';
import { Action } from '@ngrx/store';
import { listActions } from './users.actions';

export const USERS_FEATURE_KEY = 'users';
export const entityAdapter = createListEntityAdapter<UserDto>();

const reducer = createListReducer(entityAdapter, listActions);

export function usersReducer(state: ListState<UserDto>, action: Action): ListState<UserDto> {
  return reducer(state, action);
}
