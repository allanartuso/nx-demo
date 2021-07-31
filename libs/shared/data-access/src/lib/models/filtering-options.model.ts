export enum FilteringLogic {
  AND = 'and',
  OR = 'or'
}

export const DEFAULT_FILTERING_LOGIC = FilteringLogic.AND;

export enum FilteringOperator {
  Equal = 'eq',
  NotEqual = 'neq',
  LessThan = 'lt',
  LessThanOrEqual = 'lte',
  GreaterThan = 'gt',
  GreaterThanOrEqual = 'gte',
  StartsWith = 'startswith',
  EndsWith = 'endswith',
  Contains = 'contains'
}

export const DEFAULT_FILTERING_OPERATOR = FilteringOperator.Equal;

/**
 * Defines the filter criterion for a single resource field.
 * Field, filter value and operator are required.
 */
export interface FilteringField {
  field: string;
  value: string;
  operator: FilteringOperator;
}

/**
 * The options required to filter resources by one or multiple fields.
 * Defines which fields to filter the resources by.
 */
export interface FilteringOptions {
  filters: Array<FilteringField | FilteringOptions>;
  logic: FilteringLogic;
}
