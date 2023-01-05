import { UserDto } from '@demo/demo/data-model/users';
import { ErrorDto } from '@ngdux/data-model-common';
import { createFormState } from '@ngdux/form';

export const USER_FEATURE_KEY = 'user';
export const {
  actions: userActions,
  selectors: userSelectors,
  reducer: userReducer
} = createFormState<UserDto, ErrorDto>(USER_FEATURE_KEY);
