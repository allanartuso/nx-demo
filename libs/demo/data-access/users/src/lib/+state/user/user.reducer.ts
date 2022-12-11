import { UserDto } from '@demo/demo/data-model/users';
import { ErrorDto } from '@demo/shared/data-model';
import { createFormReducer, FormState } from '@ngdux/form';
import { Action } from '@ngrx/store';
import { formActions } from './user.actions';

export const USER_FEATURE_KEY = 'user';
const reducer = createFormReducer(formActions);

export function userReducer(state: FormState<UserDto, ErrorDto>, action: Action): FormState<UserDto, ErrorDto> {
  return reducer(state, action);
}
