import { UserDto } from '@demo/demo/data-model/users';
import { createFormReducer, FormState } from '@demo/shared/util-store';
import { Action } from '@ngrx/store';
import { formActions } from './user.actions';

export const USER_FEATURE_KEY = 'user';
const reducer = createFormReducer(formActions);

export function userReducer(state: FormState<UserDto>, action: Action): FormState<UserDto> {
  return reducer(state, action);
}
