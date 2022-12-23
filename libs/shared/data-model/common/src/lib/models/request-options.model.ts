import { DEFAULT_FILTERING_LOGIC, FilteringOptions } from './filtering-options.model';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, PagingOptions } from './paging-options.model';
import { SortingField, SortingOptions } from './sorting-options.model';

export const DEFAULT_REQUEST_OPTIONS: RequestOptions = {
  pagingOptions: {
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE
  },
  sortingOptions: {},
  filteringOptions: {
    logic: DEFAULT_FILTERING_LOGIC,
    filters: []
  }
};

export interface RequestOptions {
  requestParameters?: Record<string, string>;
  pagingOptions?: PagingOptions;
  sortingOptions?: SortingOptions;
  filteringOptions?: FilteringOptions;
}

export interface QueryOptionsDto {
  filter?: FilteringOptions;
  sort?: SortingField[];
  page?: number;
  pageSize?: number;
}
