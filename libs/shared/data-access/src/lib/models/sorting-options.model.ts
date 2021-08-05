export enum SortingDirection {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
  NONE = ''
}

export const DEFAULT_SORTING_ORDER = SortingDirection.ASCENDING;

/**
 * Defines the sorting criterion for a single resource field.
 * Name and sorting order are required.
 */
export interface SortingField {
  field: string;
  direction: SortingDirection;
}

/**
 * The options required to sort resources by one or multiple fields.
 * Defines which fields to sort the resources by.
 */
export type SortingOptions = Record<string, SortingField>;
