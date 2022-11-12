import { UserDto } from '@demo/demo/data-model/users';
import { createFormActions } from '@demo/shared/util-store';

export const formActions = createFormActions<UserDto>('User');
