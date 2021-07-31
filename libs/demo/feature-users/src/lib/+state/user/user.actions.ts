import { createFormActions } from '@demo/acm/feature/common/form';
import { CreateUserDto, UpdateUserDto, UserDto } from '@demo/shared/acm/data-access/users';
import { createAction } from '@ngrx/store';

const showRemovalConfirmation = createAction('[User Page] Show User Removal Confirmation');

const showChangePasswordConfirmation = createAction('[Users Toolbar] Show Change Password Confirmation');

export const formActions = {
  ...createFormActions<UserDto, CreateUserDto, UpdateUserDto>('User'),
  showRemovalConfirmation,
  showChangePasswordConfirmation
};
