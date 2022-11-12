import { UserDto } from '@demo/demo/data-model/users';
import { createListActions } from '@demo/shared/util-store';

export const listActions = createListActions<UserDto>('Users');
