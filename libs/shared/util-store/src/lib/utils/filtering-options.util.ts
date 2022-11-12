import { FilteringLogic, FilteringOperator, FilteringOptions } from '@demo/shared/data-model';

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
