export const USERS_RESOURCE_BASE_PATH = 'users';

export interface UserDto {
  email: string;
  firstName?: string;
  lastName?: string;
  id?: string;
}