import faker from 'faker';
import { UserDto } from './user.dto';
faker.setLocale('en');

export function createPersistentUser(id: string = getAlphaNumeric()): UserDto {
  return {
    id,
    ...createTransientUser()
  };
}

export function createTransientUser(): UserDto {
  const name = getFirstName();

  return {
    email: getEmail(name),
    name
  };
}

export function getWord(): string {
  return faker.random.word();
}

export function getFirstName(): string {
  return `${faker.name.firstName()} ${faker.name.lastName()}`;
}

export function getEmail(name?: string): string {
  return faker.internet.email(name).toLocaleLowerCase();
}

export function getAlphaNumeric(nOfCharacters = 8): string {
  return faker.random.alphaNumeric(nOfCharacters);
}
