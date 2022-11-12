export const USERS_RESOURCE_BASE_PATH = 'users';

export interface UserDto {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
}
