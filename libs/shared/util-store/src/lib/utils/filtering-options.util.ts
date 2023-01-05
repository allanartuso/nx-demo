import { FilteringLogic, FilteringOperator, FilteringOptions } from '@ngdux/data-model-common';

export function createFilteringByResourceIds(resourceIds: string[]): FilteringOptions {
  return {
    logic: FilteringLogic.OR,
    filters: resourceIds.map(resourceId => ({
      logic: FilteringLogic.AND,
      filters: [
        {
          field: 'id',
          value: resourceId,
          operator: FilteringOperator.Equal
        }
      ]
    }))
  };
}
