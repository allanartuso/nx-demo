import { createListActions } from '@demo/shared/util-store';
import { UserDto } from '../../models/user.dto';

export const listActions = createListActions<UserDto>('Users');
