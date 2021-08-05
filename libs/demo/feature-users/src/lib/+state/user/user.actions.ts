import { createFormActions } from '@demo/shared/util-store';
import { UserDto } from '../../models/user.dto';

export const formActions = createFormActions<UserDto>('User');
