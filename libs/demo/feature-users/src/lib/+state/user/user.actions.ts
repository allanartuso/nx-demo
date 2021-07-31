import { createFormActions } from '@demo/shared/util-store';
import { createAction } from '@ngrx/store';
import { UserDto } from '../../models/user.dto';

const showRemovalConfirmation = createAction('[User Page] Show User Removal Confirmation');

const showChangePasswordConfirmation = createAction('[Users Toolbar] Show Change Password Confirmation');

export const formActions = {
  ...createFormActions<UserDto>('User'),
  showRemovalConfirmation,
  showChangePasswordConfirmation
};
