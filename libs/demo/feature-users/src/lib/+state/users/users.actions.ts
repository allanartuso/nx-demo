import { createListActions } from '@demo/shared/util-store';
import { createAction } from '@ngrx/store';
import { UserDto } from '../../models/user.dto';

const showRemovalsConfirmation = createAction('[Users Page] Show Users Removal Confirmation');

export const listActions = {
  ...createListActions<UserDto>('Users'),
  showRemovalsConfirmation
};
