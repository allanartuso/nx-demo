import { get } from 'lodash-es';

export const translations = {
  avatar: 'Avatar',
  email: 'E-mail',
  username: 'Username',
  firstName: 'First Name',
  lastName: 'Last Name',
  jobTitle: 'Job Title',
  phoneNumber: 'Phone Number',
  displayDensity: 'Display Density',
  language: 'Language',
  theme: 'Theme',
  displayDensityInfo: 'With the display density you can configure the spacing between the different elements on a page.'
};

export function translate(key: string): string {
  return get(translations, key, `missing translation ${key}`);
}
