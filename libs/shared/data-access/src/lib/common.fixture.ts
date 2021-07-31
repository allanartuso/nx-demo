/* eslint-disable @typescript-eslint/ban-types */
import faker from 'faker';

faker.setLocale('en');

export const DEFAULT_RESOURCE_COLLECTION_SIZE = 50;

export function getBoolean(): boolean {
  return faker.datatype.boolean();
}

export function getPositiveNumber(): number {
  return faker.datatype.number({ min: 1 });
}

export function getNumberInRange(from: number, to: number): number {
  return faker.datatype.number({ min: from, max: to });
}

export function getWord(): string {
  return faker.random.word();
}

export function getUniqueWord(): string {
  return faker.unique(faker.random.word, undefined, { maxTime: 100, maxRetries: 100 });
}

export function getFirstName(): string {
  return faker.name.firstName();
}

export function getLastName(): string {
  return faker.name.lastName();
}

export function getJobTitle(): string {
  return faker.company.catchPhrase();
}

export function getPhoneNumber(): string {
  return `+${faker.phone.phoneNumberFormat(2)}`;
}

export function getAvatar(): string {
  return faker.image.avatar();
}

export function getLogo(): string {
  return faker.image.business();
}

export function getColor(): string {
  return faker.internet.color();
}

export function getFont() {
  return getElementFromArray(['Arial', 'Helvetica']);
}

export function getGoogleFont() {
  return getElementFromArray(['Roboto', 'Roboto Mono', 'Open Sans', 'Gotu', 'Lato']);
}

export function getEmail(firstName?: string, lastName?: string): string {
  return faker.internet.email(firstName, lastName).toLocaleLowerCase();
}

export function getElementFromArray<T>(array: T[]): T {
  return faker.random.arrayElement(array);
}

export function getElementsFromArray<T>(array: T[], nbOfElements: number = array.length): T[] {
  const elements: Set<T> = new Set();

  if (nbOfElements > array.length) {
    nbOfElements = array.length;
  }

  while (elements.size < nbOfElements) {
    elements.add(getElementFromArray(array));
  }

  return Array.from(elements);
}

export function getElementFromEnum<T>(enumeration: Record<string, T>): T {
  // Numeric enums have automatic reverse mapping which means that we need to filter out the keys which are numeric.
  const enumKey = getElementFromArray(Object.keys(enumeration).filter(key => !parseInt(key, 10)));
  return enumeration[enumKey];
}

export function getElementsFromEnum<T>(
  enumeration: Record<string, T>,
  nbOfElements: number = Object.keys(enumeration).length
): T[] {
  const elements: Set<T> = new Set();
  const enumerationKeys = Object.keys(enumeration);

  if (nbOfElements > enumerationKeys.length) {
    nbOfElements = enumerationKeys.length;
  }

  while (elements.size < nbOfElements) {
    elements.add(enumeration[getElementFromArray(enumerationKeys)]);
  }

  return Array.from(elements);
}

export function getEnumValue<T>(enumObj: T): T[keyof T] {
  return getElementFromArray(Object.values(enumObj));
}

/**
 * Return a random object key or path.
 * Ex.:
 * object = { a: { b: { c: 3 }}}
 * return 'a.b.c'
 * @param object any object
 * @param path string
 */
export function getObjectPropertyPath<T>(object: T, path = ''): string {
  const key = getElementFromArray(Object.keys(object));
  const nextPath = path ? `${path}.${key}` : key;

  if (typeof object[key] === 'object' && !(object[key] instanceof Array)) {
    return getObjectPropertyPath(object[key], nextPath);
  }

  return nextPath;
}

export function getLatitude(): number {
  return +faker.address.latitude();
}

export function getLongitude(): number {
  return +faker.address.longitude();
}

export function getStreetName(): string {
  return faker.address.streetName();
}

export function getZipCode(): string {
  return faker.address.zipCode();
}

export function getCity(): string {
  return faker.address.city();
}

export function getCountryCode(): string {
  return faker.address.countryCode();
}

export function getUrl(): string {
  return faker.internet.url();
}

export function getDomainName(): string {
  return faker.internet.domainName();
}

export function getSemverVersion(): string {
  return faker.system.semver();
}

export function getLocale(): string {
  return faker.random.locale();
}

export function getIso8601Date(): string {
  return (faker.date.recent() as Date).toISOString();
}

export function getRecentDate(days = 1, refDate = new Date()): Date {
  return faker.date.recent(days, refDate);
}

export function getSoonDate(days = 1, refDate = new Date()): Date {
  return faker.date.soon(days, refDate);
}

export function getFewDaysAgoDate(nbOfDays = 3): Date {
  const fewDaysAgo = new Date();
  fewDaysAgo.setDate(fewDaysAgo.getDate() - nbOfDays);
  return fewDaysAgo;
}

export function getInNextDaysDate(nbOfDays = 3): Date {
  const inTheNextDays = new Date();
  inTheNextDays.setDate(inTheNextDays.getDate() + nbOfDays);
  return inTheNextDays;
}

export function getUuid(): string {
  return faker.datatype.uuid();
}

export function getAlpha(count: number, upperCase: boolean) {
  return faker.random.alpha({ count, upcase: upperCase });
}

export function getAlphaNumeric(nOfCharacters = 8): string {
  return faker.random.alphaNumeric(nOfCharacters);
}

export function getCurrencyCode(): string {
  return faker.finance.currencyCode();
}

export function getFinanceAmount(): number {
  return +faker.finance.amount();
}

export function getSentence(): string {
  return faker.lorem.sentence();
}
