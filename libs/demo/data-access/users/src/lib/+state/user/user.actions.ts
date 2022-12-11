import { UserDto } from '@demo/demo/data-model/users';
import { ErrorDto } from '@demo/shared/data-model';
import { createFormActions } from '@ngdux/form';

export const formActions = createFormActions<UserDto, ErrorDto>('User');
